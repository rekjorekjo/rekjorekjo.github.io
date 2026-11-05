import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const base = '/astro-preview/';
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
    const types = {'.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.woff2':'font/woff2'};
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
  page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
  for (const file of pages) {
    const route = file.replace(/index\.html$/, '');
    await page.goto(origin + base + route, {waitUntil:'networkidle'});
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
  assert.deepEqual(failures, []);
  console.log(JSON.stringify({result:'passed', pages:pages.length, internalUrls:links.size, images, articlesWithLightbox:lightboxes, failures}, null, 2));
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
