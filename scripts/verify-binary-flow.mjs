import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkHome } from './check-home.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, '..');
const url = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4321/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await checkHome(page);
  const motion = page.locator('.binary-motion').first();
  const transform = await motion.evaluate(el => getComputedStyle(el).transform);
  const content = await page.locator('.binary-copy').allTextContents();
  await page.waitForTimeout(600);
  assert.notEqual(await motion.evaluate(el => getComputedStyle(el).transform), transform);
  assert.deepEqual(await page.locator('.binary-copy').allTextContents(), content);

  // Periodic copies have identical glyphs/opacity. At a wrap, moving the parent
  // by exactly one tile brings the next copy to the same screen coordinates.
  const periodic = await motion.evaluate(el => {
    const animation = el.getAnimations()[0];
    const period = Number.parseFloat(getComputedStyle(el).getPropertyValue('--binary-period'));
    animation.pause();
    animation.currentTime = 0;
    const first = el.querySelectorAll('[data-binary-copy]')[0].getBoundingClientRect();
    const duration = Number(animation.effect.getTiming().duration);
    animation.currentTime = duration - 0.001;
    const second = el.querySelectorAll('[data-binary-copy]')[1].getBoundingClientRect();
    // Discard the manipulated test animation so CSS play-state can control the
    // fresh instance (WAAPI play/pause otherwise override the CSS pause state).
    el.style.animation = 'none';
    el.getBoundingClientRect();
    el.style.animation = '';
    return { delta: Math.hypot(first.x - second.x, first.y - second.y), period, duration };
  });
  assert(periodic.delta < 0.01);
  assert.equal(periodic.period / (periodic.duration / 1000), 12);

  const card = page.locator('main [data-post]').first();
  if (await card.count()) {
    // Hiding animated layers can change Chromium's font antialiasing mode.
    // Hide text to measure only the card's soft attenuation, without glyph antialiasing.
    await card.evaluate(el => [...el.children].forEach(child => { child.style.visibility = 'hidden'; }));
    const box = await card.boundingBox();
    // Rounded antialiased border pixels intentionally blend with their exterior;
    // compare the opaque interior rather than that outside-edge fringe.
    const clip = { x: box.x + 4, y: box.y + 4, width: box.width - 8, height: box.height - 8 };
    const before = await page.screenshot({ clip });
    await page.locator('.binary-flow').evaluate(el => { el.style.visibility = 'hidden'; });
    const without = await page.screenshot({ clip });
    await fs.writeFile(path.resolve(root, '../../work/binary-occlusion-with.png'), before);
    await fs.writeFile(path.resolve(root, '../../work/binary-occlusion-without.png'), without);
    const transmission = await page.evaluate(async images => {
      const pixels = await Promise.all(images.map(async encoded => {
        const img = new Image(); img.src = `data:image/png;base64,${encoded}`; await img.decode();
        const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height).data;
      }));
      let changed = 0; let maximum = 0;
      pixels[0].forEach((value, index) => { const delta = Math.abs(value - pixels[1][index]); if (delta) changed++; maximum = Math.max(maximum, delta); });
      return { changedChannels: changed, maxChannelDelta: maximum };
    }, [before.toString('base64'), without.toString('base64')]);
    assert(transmission.changedChannels > 0, 'a faint trace of the background should pass through');
    assert(transmission.maxChannelDelta <= 36, 'transmitted pattern must remain much dimmer than article text');
    await page.locator('.binary-flow').evaluate(el => { el.style.visibility = ''; });
    await card.evaluate(el => [...el.children].forEach(child => { child.style.visibility = ''; }));
  }

  await page.waitForFunction(() => [...document.querySelectorAll('.binary-bit')].some(el => Number.parseFloat(el.style.transitionDuration) > 0));
  const durations = await page.locator('.binary-bit').evaluateAll(els => els.map(el => {
    const value = el.style.transitionDuration;
    return Number.parseFloat(value) / (value.endsWith('ms') ? 1000 : 1);
  }).filter(Boolean));
  assert(durations.length > 0);
  assert(durations.every(value => value >= 1.5 && value <= 3));
  assert(new Set(durations).size > 1);

  // A false hidden state must not hard-pause the animation. A browser can report
  // a page as hidden while an embedded preview is still being viewed.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  assert.equal(await motion.evaluate(el => getComputedStyle(el).animationPlayState), 'running');
  assert.equal(await page.locator('[data-binary-flow]').getAttribute('data-paused'), null);
  const beforeHiddenState = await motion.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41);
  await page.waitForTimeout(500);
  assert.notEqual(await motion.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41), beforeHiddenState);
  await page.evaluate(() => { delete document.hidden; });

  // Preserve the viewport pause even though document.hidden no longer controls it.
  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.id = 'qa-binary-offscreen-spacer';
    spacer.style.height = `${innerHeight * 3}px`;
    document.body.append(spacer);
    scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  });
  await page.waitForFunction(() => document.querySelector('[data-binary-flow]').hasAttribute('data-paused'));
  assert.equal(await motion.evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
  await page.evaluate(() => { document.getElementById('qa-binary-offscreen-spacer').remove(); scrollTo({ top: 0, behavior: 'instant' }); });
  await page.waitForFunction(() => !document.querySelector('[data-binary-flow]').hasAttribute('data-paused'));
  assert.equal(await motion.evaluate(el => getComputedStyle(el).animationPlayState), 'running');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.querySelector('[data-binary-flow]').hasAttribute('data-reduced'));
  assert.equal(await motion.evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator('[data-binary-flow]').getAttribute('data-reduced'), '');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const [width, height, name] of [[1440, 900, 'desktop'], [768, 1024, 'tablet'], [390, 844, 'mobile']]) {
    await page.setViewportSize({ width, height });
    await checkHome(page);
    const visibleTracks = await page.locator('[data-binary-track]').evaluateAll(els => els.filter(el => getComputedStyle(el).display !== 'none').length);
    assert.equal(visibleTracks, width < 760 ? 3 : 4);
    // CSS provides visible positions even when the JS enhancement fails.
    const tracksInViewport = await page.locator('[data-binary-track]').evaluateAll(els => els.filter(el => {
      if (getComputedStyle(el).display === 'none') return false;
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
    }).length);
    assert(tracksInViewport >= (width < 760 ? 2 : 3), `${name}: fewer than expected visible tracks`);
    assert.equal(await page.locator('[data-binary-flow]').getAttribute('data-flow-version'), 'css-tracks-v2');
    await page.screenshot({ path: path.join(output, `binary-flow-${name}.png`), fullPage: true });
  }
  // No-JavaScript fallback is essential: if an Astro script bundle is blocked,
  // the CSS animation must still be positioned and visible on the homepage.
  const cssOnly = await browser.newPage({viewport: {width: 390, height: 844}, reducedMotion: 'no-preference'});
  try {
    await cssOnly.route(/\.js(?:\?|$)/, route => route.abort());
    await cssOnly.goto(url, {waitUntil: 'domcontentloaded'});
    const baseline = await cssOnly.locator('.binary-motion').first().evaluate(el => ({
      state: getComputedStyle(el).animationPlayState,
      transform: getComputedStyle(el).transform,
    }));
    assert.equal(baseline.state, 'running', 'CSS-only fallback must play without JS');
    const unobscuredGlyphs = await cssOnly.locator('.binary-bit').evaluateAll(els => els.filter(el => {
      if (getComputedStyle(el).display === 'none') return false;
      const r = el.getBoundingClientRect();
      const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
      return x > 0 && x < innerWidth && y > 0 && y < innerHeight &&
        !document.elementFromPoint(x, y)?.closest('[data-post], .latest-heading, .site-header');
    }).length);
    assert(unobscuredGlyphs >= 3, `mobile first viewport has too few exposed digits: ${unobscuredGlyphs}`);
    await cssOnly.screenshot({ path: path.join(output, 'binary-flow-css-only-mobile.png') });
    await cssOnly.waitForTimeout(600);
    assert.notEqual(await cssOnly.locator('.binary-motion').first().evaluate(el => getComputedStyle(el).transform), baseline.transform,
      'no-JS CSS animation must move, not just render static digits');
  } finally { await cssOnly.close(); }

  const session = await page.context().newCDPSession(page);
  await session.send('Performance.enable');
  const metric = async () => (await session.send('Performance.getMetrics')).metrics.find(m => m.name === 'TaskDuration').value;
  const start = await metric();
  await page.waitForTimeout(3000);
  const taskMilliseconds = Math.round(((await metric()) - start) * 1000);
  const report = { result: 'passed', periodic, brightnessDurationRangeSeconds: [Math.min(...durations), Math.max(...durations)], cardOcclusion: 'soft transmission checked: background channel difference is nonzero and no greater than 36/255 (text hidden)', viewports: [1440, 768, 390], cssOnlyFallback: 'passed', viewportPause: 'passed', visibilityLifecycle: 'false hidden state cannot hard-pause visible animation', reducedMotion: 'passed', mainThreadTaskMillisecondsOver3Seconds: taskMilliseconds };
  await fs.writeFile(path.join(output, 'binary-flow-verification.json'), JSON.stringify(report, null, 2));
  console.log(report);
} finally { await browser.close(); }
