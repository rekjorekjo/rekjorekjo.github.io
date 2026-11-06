import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { chromium } from '@playwright/test';
import { author, postDisplay } from '../src/config.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const base = process.env.BASE_PATH ?? '/';
const redirects = JSON.parse(await fs.readFile(path.join(root, 'legacy-redirects.json'), 'utf8').catch(() => '{}'));
const pages = [];
async function walk(dir) {
  for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.html')) pages.push(path.relative(dist, file).replaceAll('\\', '/'));
  }
}
await walk(dist);
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    assert(url.pathname.startsWith(base));
    let relative = decodeURIComponent(url.pathname.slice(base.length));
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const file = path.resolve(dist, relative);
    assert(file.startsWith(dist + path.sep));
    const body = await fs.readFile(file);
    const types = {'.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.woff2':'font/woff2', '.pdf':'application/pdf'};
    res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = process.env.AUDIT_ORIGIN?.replace(/\/+$/, '') ?? `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({channel:'chrome', headless:true});
const failures = [], links = new Set();
let images = 0, lightboxes = 0;
try {
  const page = await browser.newPage();
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => {
    if (!request.url().startsWith('http')) return;
    // Chrome's built-in PDF viewer can hand off an iframe request with ERR_ABORTED.
    // Every local PDF URL is also fetched and required to return HTTP 200 below.
    if (request.failure()?.errorText === 'net::ERR_ABORTED' && new URL(request.url()).pathname.endsWith('.pdf')) return;
    failures.push(`${request.url()}: ${request.failure()?.errorText}`);
  });
  for (const file of pages) {
    const route = file.replace(/index\.html$/, '');
    if (redirects['/' + route]) continue;
    await page.goto(origin + base + route, {waitUntil:'networkidle'});
    if (!postDisplay.showDescriptions) assert.equal(await page.locator('[data-post] .post-main > p, .article-header > p').count(), 0, `${file}: visible description`);
    if (route === 'about/') {
      assert.equal(await page.locator('.profile-contact').count(), author.showContacts ? [author.email, author.github, author.x].filter(Boolean).length : 0);
      assert.equal(await page.locator('#about-notes-title').count(), author.showBlogInfo && author.blogParagraphs.some(p => p.trim()) ? 1 : 0);
      assert.equal(await page.getByText('暂未公开', {exact:true}).count(), 0);
    }
    await page.setViewportSize({width:360,height:844});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${file}: mobile overflow`);
    await page.setViewportSize({width:1280,height:720});
    assert.equal(await page.locator('.katex-error').count(), 0, `${file}: math rendering error`);
    const canonical = await page.locator('link[rel=canonical]').getAttribute('href').catch(() => null);
    if (canonical) assert.equal(canonical, new URL(base + route, 'https://rekjorekjo.github.io').href);
    for (const value of await page.locator('[href],[src]').evaluateAll(els => els.flatMap(el => [el.getAttribute('href'),el.getAttribute('src')]).filter(v => v?.startsWith('/')))) {
      assert(value.startsWith(base), `${file}: escapes preview: ${value}`);
      links.add(value.split('#')[0]);
    }
    // The lightbox dialog intentionally starts with an empty image until opened.
    const imageResults = await page.locator('img[src]:not([src=""])').evaluateAll(async els => Promise.all(els.map(async el => { el.loading = 'eager'; try { await el.decode(); return {ok:true, src:el.currentSrc}; } catch { return {ok:false, src:el.currentSrc || el.src}; } })));
    assert(imageResults.every(image => image.ok), `${file}: broken images ${JSON.stringify(imageResults.filter(image => !image.ok))}; responses: ${JSON.stringify(failures)}`);
    images += imageResults.length;
    for (const hash of await page.locator('.toc nav a').evaluateAll(els => els.map(el => el.getAttribute('href'))))
      assert(await page.evaluate(value => !!document.getElementById(decodeURIComponent(value.slice(1))), hash), `${file}: missing TOC target ${hash}`);
    const image = page.locator('#article-content img.is-zoomable').first();
    if (await image.count()) {
      await image.scrollIntoViewIfNeeded(); await image.click();
      assert(await page.locator('#image-lightbox').evaluate(el => el.open));
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#image-lightbox').evaluate(el => el.open), false);
      lightboxes++;
    }
  }
  for (const link of links) assert.equal((await page.request.get(origin + link)).status(), 200, link);
  for (const [from, to] of Object.entries(redirects)) {
    const response = await page.request.get(origin + from);
    assert.equal(response.status(), 200, from);
    assert((await response.text()).includes(`content="0;url=${to}"`), `${from}: missing redirect to ${to}`);
    assert.equal((await page.request.get(origin + to)).status(), 200, from);
  }
  for (const [from, to] of Object.entries(redirects).slice(0, 2)) {
    await page.goto(origin + from);
    await page.waitForURL(origin + to);
  }
  assert.deepEqual(failures, []);
  console.log(JSON.stringify({result:'passed', pages:pages.length, legacyRedirects:Object.keys(redirects).length, internalUrls:links.size, images, articlesWithLightbox:lightboxes, failures}, null, 2));
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
