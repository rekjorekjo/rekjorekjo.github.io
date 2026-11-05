import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { checkHome } from './check-home.mjs';
import { checkTaxonomy } from './check-taxonomy.mjs';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, '..');
const base = (process.env.PREVIEW_URL ?? 'http://127.0.0.1:4321').replace(/\/+$/, '');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const checks = [];
let taxonomyUrls = [];
async function check(name, callback) { await callback(); checks.push(name); }
try {
    await mkdir(output, { recursive: true });
    await check('首页文章数据、二进制底纹和卡片遮挡', async () => {
        const response = await page.goto(`${base}/`);
        assert.equal(response.status(), 200);
        await checkHome(page);
        assert.equal(await page.locator('.site-footer').count(), 0, 'footer is intentionally removed');
        await page.screenshot({ path: path.join(output, 'homepage-desktop.png'), fullPage: true });
    });
    await check('静态归档、全部分类与标签路由及文章集合', async () => {
        taxonomyUrls = await checkTaxonomy(page, base);
    });
    await check('文章数学公式、Python/SageMath 高亮、目录锚点与复制', async () => {
        await page.goto(`${base}/archive/`);
        if (!await page.locator('[data-post] h3 a').count()) return;
        const articleHref = await page.locator('[data-post] h3 a').first().getAttribute('href');
        await page.goto(new URL(articleHref, base).href);
        // Math and language fixture coverage is handled by npm test.
        assert.equal(await page.locator('.katex-error').count(), 0);
        assert.equal(await page.locator('.site-footer').count(), 0);
        const sidebar = page.locator('.toc');
        const header = page.locator('.article-header');
        if (await sidebar.isVisible()) {
            const headerTop = await header.evaluate(el => el.getBoundingClientRect().top);
            const tocTop = await sidebar.evaluate(el => el.getBoundingClientRect().top);
            assert(Math.abs(headerTop - tocTop) < 5, 'TOC should align with article header');
        }
        for (const pre of await page.locator('.prose pre').all())
            assert(await pre.locator('.line').count() > 0, 'code lines must be rendered');
        for (const link of await page.locator('.toc nav a').all()) {
            const hash = await link.getAttribute('href');
            assert(await page.evaluate(id => !!document.getElementById(decodeURIComponent(id.slice(1))), hash));
        }
        if (await page.locator('.code-toolbar button').count()) {
            const code = await page.locator('.prose pre code').first().textContent();
            await page.locator('.code-toolbar button').first().click();
            assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n'), code);
        }
        assert.equal(await page.locator('.reading-controls, #font-up, #font-down').count(), 0);
        assert.equal(await page.locator('.image-lightbox').count(), 1);
        const zoomable = page.locator('#article-content img.is-zoomable');
        if (await zoomable.count()) {
            await zoomable.first().scrollIntoViewIfNeeded();
            await zoomable.first().click();
            assert.equal(await page.locator('#image-lightbox').evaluate(el => el.open), true);
            await page.locator('#lightbox-zoom').click();
            assert.equal(await page.locator('#lightbox-zoom').getAttribute('aria-pressed'), 'true');
            await page.keyboard.press('Escape');
            assert.equal(await page.locator('#image-lightbox').evaluate(el => el.open), false);
        }
        // Long articles must keep the current section visible inside the TOC.
        const tocCount = await page.locator('.toc nav a').count();
        if (tocCount > 12) {
            const targetHash = await page.locator('.toc nav a').nth(Math.floor(tocCount * 0.7)).getAttribute('href');
            await page.evaluate(hash => {
                document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({block: 'start', behavior: 'instant'});
            }, targetHash);
            await page.waitForFunction(hash => {
                const nav = document.querySelector('.toc nav');
                const link = Array.from(nav?.querySelectorAll('a') ?? []).find(a => a.getAttribute('href') === hash);
                if (!nav || !link || !link.classList.contains('is-active')) return false;
                const nr = nav.getBoundingClientRect(), lr = link.getBoundingClientRect();
                return lr.top >= nr.top - 2 && lr.bottom <= nr.bottom + 2;
            }, targetHash, {timeout: 3500});
        }
        if (tocCount)
            await page.locator('.toc nav a').last().click();
        await page.waitForTimeout(700);
        assert(await page.locator('#reading-progress').evaluate(el => parseFloat(el.style.width) >= 0));
        await page.goto(new URL(articleHref, base).href);
        await page.screenshot({ path: path.join(output, 'article-desktop.png'), fullPage: true, animations: 'disabled' });
    });
    await check('页面内部链接均可访问', async () => {
        await page.goto(`${base}/archive/`);
        const paths = ['/', '/archive/', '/about/', ...(await page.locator('[data-post] h3 a').evaluateAll(els => els.map(el => el.getAttribute('href').replace(new URL(document.baseURI).pathname.replace(/archive\/$/, ''), '/'))))];
        for (const route of paths) {
            assert.equal((await context.request.get(`${base}${route}`)).status(), 200);
            await page.goto(`${base}${route}`);
            const links = await page.locator('a[href^="/"]').evaluateAll(els => [...new Set(els.map(el => el.getAttribute('href')))]);
            for (const href of links)
                assert.equal((await context.request.get(new URL(href.split('#')[0], base).href)).status(), 200, href);
        }
        assert.equal((await context.request.get(`${base}/does-not-exist/`)).status(), 404);
    });
    await check('手机与平板无页面横向溢出', async () => {
        for (const width of [360, 390, 768]) {
            await page.setViewportSize({ width, height: 844 });
            for (const route of ['/', '/archive/', ...taxonomyUrls.slice(0, 3)]) {
                await page.goto(route.startsWith('http') ? route : `${base}${route}`);
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px ${route} overflow`);
            }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(`${base}/`);
        await checkHome(page);
        assert.equal(await page.getByRole('link', { name: '搜索文章' }).count(), 0);
        await page.getByRole('link', { name: '分类' }).click();
        assert(new URL(page.url()).pathname.endsWith('/categories/'));
        await page.goto(`${base}/`);
        await page.screenshot({ path: path.join(output, 'homepage-mobile.png'), fullPage: true, animations: 'disabled' });
        await page.goto(`${base}/archive/`);
        if (!await page.locator('[data-post] h3 a').count()) return;
        const mobileArticle = await page.locator('[data-post] h3 a').first().getAttribute('href');
        await page.goto(new URL(mobileArticle, base).href);
        await page.screenshot({ path: path.join(output, 'article-mobile.png'), fullPage: true, animations: 'disabled' });
    });
    assert.deepEqual(errors, []);
    await writeFile(path.join(output, 'verification.json'), JSON.stringify({ result: 'passed', checks, browserErrors: errors }, null, 2));
    console.log(JSON.stringify({ result: 'passed', checks, browserErrors: errors }, null, 2));
}
finally {
    await browser.close();
}
