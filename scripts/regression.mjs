import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { checkHome } from './check-home.mjs';
import { checkTaxonomy } from './check-taxonomy.mjs';
import { tagSlug } from '../src/lib/taxonomy-core.ts';
import { deployment, validateRepositoryName } from '../deployment.mjs';
import { author, postDisplay, site as siteConfig } from '../src/config.ts';

for (const name of ['ctf.notes', 'ctf_notes', 'ctf-notes', 'CTF42']) assert.equal(validateRepositoryName(name), name);
for (const name of ['', '.', '..', 'a/b', 'a\\b', '../a', 'a/../b', '%2e%2e', 'a?b', ' a', 'a#b']) assert.throws(() => validateRepositoryName(name));
for (const base of ['', '.', '..', '/./', '/../', '/a/b/', '/a/../b/', '//repo//', '/a\\b/']) assert.throws(() => deployment({ BASE_PATH: base }));
assert.equal(deployment({}).base, '/');
assert.equal(deployment({BASE_PATH:'/'}).base, '/');
assert.equal(deployment({BASE_PATH:'ctf.notes'}).base, '/ctf.notes/');
assert.equal(deployment({BASE_PATH:'/ctf.notes/'}).base, '/ctf.notes/');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspace = path.resolve(root, '../../work');
await fs.mkdir(workspace, { recursive: true });
const temp = await fs.mkdtemp(path.join(workspace, 'regression-'));
assert(temp.startsWith(workspace + path.sep));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];

// Guard against vertical grid gaps reappearing when the TOC starts next to the header.
async function assertArticleSpacing(page, { demo }) {
    for (const width of [1440, 1050, 768]) {
        await page.setViewportSize({ width, height: 900 });
        const metrics = await page.evaluate(() => {
            const header = document.querySelector('.article-header').getBoundingClientRect();
            const body = document.querySelector('#article-content').getBoundingClientRect();
            const toc = document.querySelector('.toc').getBoundingClientRect();
            return {
                gap: body.top - header.bottom,
                tocOffset: toc.top - header.top,
                hasNotices: !!document.querySelector('.article-notices'),
                overflow: document.documentElement.scrollWidth > window.innerWidth
            };
        });
        assert.equal(metrics.hasNotices, demo, `unexpected notice state at ${width}px`);
        assert(Math.abs(metrics.tocOffset) < 5, `TOC/header misaligned at ${width}px: ${JSON.stringify(metrics)}`);
        assert(!metrics.overflow, `article overflows viewport at ${width}px`);
        const [min, max] = demo ? [75, 140] : [35, 65];
        assert(metrics.gap >= min && metrics.gap <= max,
            `article header-to-body gap regressed at ${width}px: ${JSON.stringify(metrics)}`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
}
const unit = spawnSync(process.execPath, ['--experimental-strip-types', path.join(root, 'scripts/test-taxonomy.mjs')], {encoding:'utf8'});
assert.equal(unit.status, 0, unit.stdout + unit.stderr);
console.log(unit.stdout.trim());
try {
    for (const name of ['src', 'public', 'astro.config.mjs', 'deployment.mjs', 'package.json', 'tsconfig.json'])
        await fs.cp(path.join(root, name), path.join(temp, name), { recursive: true });
    await fs.symlink(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'junction');
    const content = path.join(temp, 'src/content/posts');
    assert(path.resolve(content).startsWith(path.resolve(temp) + path.sep));
    await fs.rm(content, { recursive: true, force: true }); // copied test tree only
    await fs.mkdir(content, { recursive: true });
    await fs.mkdir(path.join(content, 'assets'), { recursive: true });
    await fs.writeFile(path.join(content, 'assets', 'qa-lightbox.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAFElEQVR4nGM0ygtgwA2Y8MiNYGkALgMBBMh1O8wAAAAASUVORK5CYII=', 'base64'));
    for (let i = 0; i < 8; i++)
        await fs.writeFile(path.join(content, `qa-${i}.md`), `---\ntitle: 'QA ${i}'\ndescription: searchable\ndate: 2099-01-01\n${i === 0 ? 'categories: [Notes, Number Theory]' : 'category: Notes'}\ntags: [${i % 2 ? 'Python3' : 'Python'}, QA]\nminutes: 1\n${i === 1 ? 'demo: true\n' : ''}---\n## Proof\n\n| Wide | Table |\n| --- | --- |\n| xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx | value |\n\n$x^2$\n\n$$\\sum_{i=1}^{n}i=\\frac{n(n+1)}2$$\n\n\`\`\`python\nprint("proofxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")\n\`\`\`\n\n\`\`\`sage\nInteger(3)^2\n\`\`\`\n\n\`\`\`sagemath\nInteger(4)^2\n\`\`\`\n`);
    await fs.appendFile(path.join(content, 'qa-0.md'), '\n![QA image](./assets/qa-lightbox.png)\n\n```text\n[+] Sample output 200 OK\n```\n\n```bash\npython3 solve.py\n```\n');
    await fs.appendFile(path.join(content, 'qa-0.md'), Array.from({length: 26}, (_, i) => `\n## QA heading ${i + 1}\n\nLong chapter filler content.\n`).join('') + '\n' + 'More notes after the final heading.\n\n'.repeat(20));
    for (const kind of ['plaintext', 'output', 'log', 'ansi']) await fs.appendFile(path.join(content, 'qa-0.md'), `\n\n\`\`\`${kind}\n[+] Terminal output 200 OK\n\`\`\`\n`);
    const noDescriptionFile = path.join(content, 'qa-2.md');
    await fs.writeFile(noDescriptionFile, (await fs.readFile(noDescriptionFile, 'utf8')).replace('description: searchable\n', ''));
    await fs.writeFile(path.join(content, 'qa-private.md'), `---\ntitle: PRIVATE_DRAFT_SENTINEL\ndescription: PRIVATE_DRAFT_SENTINEL\ndate: 2100-01-01\ncategory: CTF\ntags: [PRIVATE_DRAFT_SENTINEL]\nminutes: 1\ndraft: true\n---\nPRIVATE_DRAFT_BODY_SENTINEL`);
    for (const name of await fs.readdir(path.join(root, 'tests/fixtures'))) await fs.copyFile(path.join(root, 'tests/fixtures', name), path.join(content, name));
    async function verifyBrowserScenario(origin, base) {
      const command = spawn(process.execPath, [path.join(root, 'scripts/verify.mjs')], {env: {...process.env, PREVIEW_URL: origin + base}, stdio: ['ignore','pipe','pipe']});
      let log = ''; command.stdout.on('data', chunk => log += chunk); command.stderr.on('data', chunk => log += chunk);
      const status = await new Promise((resolve, reject) => { command.once('error', reject); command.once('close', resolve); });
      assert.equal(status, 0, log);
    }
    const originals = new Map();
    for (const name of await fs.readdir(content)) if (name.endsWith('.md')) originals.set(name, await fs.readFile(path.join(content, name), 'utf8'));
    for (const [scenario, site, base, mode, optional = false] of [
      ['unconfigured', '', '/'], ['custom', 'https://review.invalid', '/'],
      ['user-pages', 'https://reviewer.github.io', '/'], ['project-pages', 'https://reviewer.github.io', '/notebook/', undefined, true],
      ['without-demos-root', 'https://review.invalid', '/', 'real-only'],
      ['without-demos-dotted', 'https://reviewer.github.io', '/ctf.notes/', 'real-only'],
      ['empty-root', 'https://review.invalid', '/', 'empty'],
      ['empty-dotted', 'https://reviewer.github.io', '/ctf.notes/', 'empty']
    ]) {
        const profile = optional ? { ...author, signature: 'QA signature', bio: 'QA bio', tags: ['QA'], showContacts: true, email: 'qa@example.invalid', github: 'https://github.com/rekjorekjo', showBlogInfo: true, blogParagraphs: ['QA introduction'] } : author;
        await fs.writeFile(path.join(temp, 'src/config.ts'), `export const site = ${JSON.stringify(siteConfig)};\nexport const author = ${JSON.stringify(profile)};\nexport const postDisplay = ${JSON.stringify({...postDisplay, showDescriptions: optional})};\n`);
        if (mode) for (const name of await fs.readdir(content)) {
          if (!name.endsWith('.md')) continue;
          const body = await fs.readFile(path.join(content, name), 'utf8');
          if (mode === 'empty' || /^demo:\s*true\s*$/m.test(body.split('---')[1] ?? '')) await fs.unlink(path.join(content, name));
        }

        const build = spawnSync(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build', '--root', temp], { env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', SITE_URL: site, BASE_PATH: base }, encoding: 'utf8' });
        assert.equal(build.status, 0, build.stdout + build.stderr);
        const dist = path.join(temp, 'dist');
        async function scan(dir) { for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
            const file = path.join(dir, entry.name);
            if (entry.isDirectory())
                await scan(file);
            else if (/\.(html|xml|js|json)$/.test(file))
                assert(!(await fs.readFile(file, 'utf8')).includes('PRIVATE_DRAFT_'), file);
        } }
        await scan(dist);
        assert(!(await fs.readdir(path.join(dist, 'posts')).catch(() => [])).includes('qa-private'));
        const server = createServer(async (req, res) => { try {
            const url = new URL(req.url, 'http://localhost');
            assert(url.pathname.startsWith(base));
            let relative = decodeURIComponent(url.pathname.slice(base.length));
            if (!relative || relative.endsWith('/'))
                relative += 'index.html';
            const file = path.resolve(dist, relative);
            assert(file.startsWith(dist + path.sep));
            const body = await fs.readFile(file);
            res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' })[path.extname(file)] ?? 'application/octet-stream');
            res.end(body);
        }
        catch {
            res.writeHead(404).end();
        } });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        const origin = `http://127.0.0.1:${server.address().port}`;
        const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
        try {
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', e => errors.push(e.message));
            await page.goto(origin + base);
            const homeIds = await checkHome(page);
            assert.equal(await page.locator('main [data-post] .post-main > p').count(), optional ? homeIds.length - (homeIds.includes('qa-2') ? 1 : 0) : 0, 'card descriptions follow the setting and omit absent descriptions');
            if (mode === 'empty') {
                assert.equal(homeIds.length, 0);
                assert.equal(await page.locator('.demo-notice').count(), 0);
                await page.goto(origin + base + 'archive/');
                assert(await page.getByText('还没有发布的文章，新的笔记正在整理中。').count() > 0);
                assert.equal(await page.locator('[data-post]').count(), 0);
                await page.goto(origin + base + 'about/');
                assert.equal(await page.locator('main a[href*="/posts/"]').count(), 0);
                assert.deepEqual(errors, []);
                await verifyBrowserScenario(origin, base);
                results.push({scenario, result:'passed', base, independentVerify:'passed'});
                continue;
            }
            assert(await page.locator('main [data-post]').evaluateAll(els => els.every(el => el.dataset.draft === 'false')));
            if (mode === 'real-only') assert.equal(await page.locator('.demo-notice').count(), 0);
            assert.deepEqual(homeIds, (mode === 'real-only' ? [0,2,3,4,5,6] : [0,1,2,3,4,5]).map(i => `qa-${i}`));
            assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'index,follow');
            if (site)
                assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), site + base);
            else
                assert.equal(await page.locator('link[rel=canonical]').count(), 0);
            await page.locator('main [data-post] h3 a').first().click();
            await page.waitForURL(origin + base + 'posts/qa-0/');
            await page.goto(origin + base + 'archive/');
            assert.equal(await page.locator('[data-post][data-id^=qa-]').count(), mode === 'real-only' ? 7 : 8);
            if (!mode) {
              await page.goto(origin + base + 'posts/qa-1/');
              assert.equal(await page.locator('.article-demo').count(), 1, 'explicit demo remains published');
              await assertArticleSpacing(page, { demo: true });
            }
            await page.goto(origin + base + 'about/');
            assert.equal(await page.locator('.profile-panel').count(), 1);
            assert.equal(await page.locator('.profile-avatar').count(), 1);
            assert.equal(await page.locator('.profile-id').textContent(), '@rekjorekjo');
            assert.equal(await page.locator('.profile-signature').count(), optional ? 1 : 0);
            assert.equal(await page.locator('.profile-bio').count(), optional ? 1 : 0);
            assert.equal(await page.locator('.profile-interests span').count(), optional ? 1 : 0);
            assert.equal(await page.locator('.profile-contact').count(), optional ? 2 : 0);
            assert.equal(await page.locator('#about-notes-title').count(), optional ? 1 : 0);
            assert.equal(await page.getByText('暂未公开', {exact: true}).count(), 0);
            assert.deepEqual(await page.locator('.site-header nav a').allTextContents(), ['首页', '归档', '分类', '关于']);
            await page.locator('[data-language-switch]').click();
            assert.deepEqual(await page.locator('.site-header nav a').allTextContents(), ['Home', 'Archive', 'Categories', 'About']);
            assert.equal(await page.locator('html').getAttribute('lang'), 'en');
            await page.reload();
            await page.waitForFunction(() => document.documentElement.lang === 'en');
            assert.equal(await page.locator('html').getAttribute('lang'), 'en', 'interface language should persist');
            await page.locator('[data-language-switch]').click();
            assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
            await page.goto(origin + base + 'categories/');
            assert(await page.locator('.category-entry').count() > 0);
            assert.equal(await page.locator('#search').count(), 0);
            await page.goto(origin + base + 'categories/Notes/');
            assert.equal(await page.locator('[data-post][data-id^=qa-]').count(), mode === 'real-only' ? 7 : 8);
            await page.goto(origin + base + 'categories/Notes/Number%20Theory/');
            assert.equal(await page.locator('[data-post][data-id="qa-0"]').count(), 1);
            await page.goto(origin + base + `tags/${tagSlug('Python')}/`);
            assert.equal(await page.locator('[data-post][data-id^=qa-]').count(), 4);
            await checkTaxonomy(page, origin + base);
            const expected = {
              'categories/CTF/': ['taxonomy-special'],
              'categories/CTF/Crypto/': ['taxonomy-special'],
              'categories/Notes/': [(mode === 'real-only' ? [0,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7]).map(i => `qa-${i}`), 'taxonomy-special', 'taxonomy-legacy'].flat(),
              'categories/Notes/Number%20Theory/': ['qa-0'],
              'categories/CTF/Crypto/Number%20Theory/': ['taxonomy-special'],
              'categories/Notes/Security/': ['taxonomy-special'],
              'categories/%E6%9C%AA%E5%88%86%E7%B1%BB/': ['taxonomy-uncategorized'],
              [`tags/${tagSlug('Python/SageMath')}/`]: ['taxonomy-special'],
              [`tags/${tagSlug('100%')}/`]: ['taxonomy-special', 'taxonomy-legacy'],
              [`tags/${tagSlug('中文标签')}/`]: ['taxonomy-special', 'taxonomy-uncategorized'],
              [`tags/${tagSlug('with space')}/`]: ['taxonomy-special', 'taxonomy-legacy'],
              [`tags/${tagSlug('C#')}/`]: ['taxonomy-special'],
              [`tags/${tagSlug('C++')}/`]: ['taxonomy-special'],
              [`tags/${tagSlug('Python')}/`]: ['qa-0', 'qa-2', 'qa-4', 'qa-6', 'taxonomy-special'],
              [`tags/${tagSlug('python')}/`]: ['taxonomy-special'],
              [`tags/${tagSlug('Python3')}/`]: (mode === 'real-only' ? [3,5,7] : [1,3,5,7]).map(i => `qa-${i}`),
              [`tags/${tagSlug('QA')}/`]: (mode === 'real-only' ? [0,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7]).map(i => `qa-${i}`),
            };
            for (const [route, ids] of Object.entries(expected)) {
              assert.equal((await page.goto(origin + base + route)).status(),200);
              assert.deepEqual((await page.locator('[data-post]').evaluateAll(els=>els.map(el=>el.dataset.id))).sort(), ids.sort(),route);
            }
            if (mode === 'real-only') await verifyBrowserScenario(origin, base);
            await page.goto(origin + base + 'posts/qa-2/');
            assert.equal(await page.locator('.article-header > p').count(), 0, 'missing descriptions do not create empty paragraphs');
            assert.equal(await page.locator('meta[name=description]').getAttribute('content'), siteConfig.description, 'missing description uses the site SEO fallback');
            await page.goto(origin + base + 'posts/qa-0/?q=ignore');
            assert.equal(await page.locator('.article-header > p').count(), optional ? 1 : 0);
            assert.equal(await page.title(), 'QA 0 / Rekjo');
            assert.equal(await page.locator('.article-demo').count(), 0, 'omitted demo defaults to false');
            await assertArticleSpacing(page, { demo: false });
            assert.equal(await page.locator('meta[name=description]').getAttribute('content'), 'searchable');
            if (site)
                assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), site + base + 'posts/qa-0/');
            assert(await page.locator('.katex').count() >= 2);
            assert.equal(await page.locator('.katex-error').count(), 0);
            for (const pre of await page.locator('.prose pre').all()) {
                const kind = await pre.locator('xpath=..').getAttribute('data-code-kind');
                if (kind !== 'output') assert(await pre.locator('span[style]').count() > 0);
            }
            assert.equal(await page.locator('.code-wrapper').count(), 9);
            assert.equal(await page.locator('.code-wrapper[data-code-kind="output"]').count(), 5);
            assert.equal(await page.locator('.code-wrapper[data-code-kind="output"] .code-toolbar > span').first().textContent(), '输出');
            assert.equal(await page.locator('.code-wrapper[data-code-kind="output"] pre span').evaluateAll(els => new Set(els.map(el => getComputedStyle(el).color)).size), 1, 'output tokens remain neutral');
            await page.locator('[data-language-switch]').click();
            assert.equal(await page.locator('.code-wrapper[data-code-kind="output"] .code-toolbar > span').first().textContent(), 'Output');
            assert.equal(await page.locator('.code-toolbar button').first().textContent(), 'Copy code');
            await page.locator('[data-language-switch]').click();
            const code = await page.locator('.prose pre code').first().textContent();
            await page.locator('.code-toolbar button').first().click();
            assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n'), code);
            assert.equal(await page.locator('.toc-inner').evaluate(el => getComputedStyle(el).position), 'sticky');
            await page.locator('.toc nav a').first().click();
            assert.match(page.url(), /#proof$/);
            for (const width of [360, 390, 768]) {
                await page.setViewportSize({ width, height: 844 });
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
                if (width < 760) {
                    assert(await page.locator('#mobile-toc-trigger').isVisible());
                    assert.equal(await page.locator('#mobile-toc-trigger svg').count(), 1, 'compact TOC button has a single icon');
                    assert.equal((await page.locator('#mobile-toc-trigger').innerText()).trim(), '', 'TOC button has no visible text');
                    const triggerSize = await page.locator('#mobile-toc-trigger').boundingBox();
                    assert(triggerSize.width >= 44 && triggerSize.height >= 44, 'touch target must be at least 44px');
                    await page.locator('.toc nav').waitFor({ state: 'hidden' });
                    await page.locator('#mobile-toc-trigger').click();
                    await page.locator('.toc nav').waitFor({ state: 'visible' });
                    assert.equal(await page.locator('#mobile-toc-trigger').getAttribute('aria-expanded'), 'true');
                    assert.equal(await page.locator('#article-toc').getAttribute('aria-modal'), 'true');
                    await page.keyboard.press('Shift+Tab');
                    assert(await page.locator('.toc .to-top').evaluate(el => el === document.activeElement));
                    await page.keyboard.press('Tab');
                    assert(await page.locator('.toc-toggle').evaluate(el => el === document.activeElement));
                    await page.keyboard.press('Escape');
                    await page.locator('.toc nav').waitFor({ state: 'hidden' });
                    assert(await page.locator('#mobile-toc-trigger').evaluate(el => el === document.activeElement));
                    await page.locator('#mobile-toc-trigger').click();
                    await page.locator('.toc nav').waitFor({ state: 'visible' });
                    await page.locator('#mobile-toc-backdrop').click({position:{x:5,y:5}});
                    await page.locator('.toc nav').waitFor({ state:'hidden' });
                    await page.locator('#mobile-toc-trigger').click();
                    await page.locator('.toc nav').waitFor({ state: 'visible' });
                    await page.locator('.toc nav a').last().click();
                    await page.locator('.toc nav').waitFor({ state: 'hidden' });
                    await page.waitForFunction(() => Math.abs(document.querySelector('#qa-heading-26').getBoundingClientRect().top) < 120);
                    await page.locator('#mobile-toc-trigger').click();
                    await page.locator('.toc nav').waitFor({state:'visible'});
                    assert(await page.locator('.toc nav .is-active').count() === 1, 'current chapter should be highlighted');
                    await page.locator('.toc-toggle').click();
                    await page.locator('.toc nav').waitFor({state:'hidden'});
                }
            }
            if (scenario === 'project-pages') {
              const noJs = await browser.newContext({javaScriptEnabled:false, viewport:{width:360,height:844}});
              try {
                const staticPage = await noJs.newPage();
                await staticPage.goto(origin + base + 'posts/qa-0/');
                assert(await staticPage.locator('.toc nav').isVisible(), 'no-JS mobile TOC remains available');
                assert(!(await staticPage.locator('#mobile-toc-trigger').isVisible()));
                assert(!(await staticPage.locator('[data-language-switch]').isVisible()));
              } finally { await noJs.close(); }
            }
            for (const route of ['', 'archive/', 'categories/', 'categories/Notes/', 'categories/Notes/Number%20Theory/', `tags/${tagSlug('Python')}/`, 'about/', 'posts/qa-0/']) {
                await page.goto(origin + base + route);
                const urls = await page.locator('[href],[src]').evaluateAll(els => els.flatMap(el => [el.getAttribute('href'), el.getAttribute('src')]).filter(v => v?.startsWith('/')));
                for (const url of urls) {
                    assert(url.startsWith(base), url);
                    assert(!url.includes('//'), url);
                    assert.equal((await context.request.get(origin + url.split('#')[0])).status(), 200, url);
                }
            }
            assert.deepEqual(errors, []);
            results.push({ scenario, result: 'passed', base, canonical: site || 'omitted' });
        }
        finally {
            await context.close();
            await new Promise(resolve => server.close(resolve));
        }
    }
    for (const base of ['/', '/ctf.notes/']) {
      const badFile = path.join(content, 'invalid-category.md');
      for (const [label, lines, message] of [
        ['slash', 'categories: ["CTF/Crypto"]', '非法分类名称'],
        ['dot', 'categories: [".."]', '非法分类名称'],
        ['conflict', 'categories: [[Notes, Number Theory], [Notes, number theory]]', 'URL 冲突'],
      ]) {
        await fs.writeFile(badFile, `---\ntitle: Invalid fixture\ndescription: Invalid taxonomy\ndate: 2099-01-01\n${lines}\ntags: []\nminutes: 1\n---\nFixture only.`);
        const built = spawnSync(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build', '--root', temp], {env:{...process.env, ASTRO_TELEMETRY_DISABLED:'1', SITE_URL:'https://review.invalid', BASE_PATH:base}, encoding:'utf8'});
        assert.notEqual(built.status, 0, `${label} must fail the build`);
        assert((built.stdout + built.stderr).includes(message), built.stdout + built.stderr);
        results.push({scenario:`reject-${label}`,base,result:'passed (expected build rejection)'});
      }
      await fs.unlink(badFile);
    }
    for (const [name, body] of originals) await fs.writeFile(path.join(content, name), body);
    const dev = spawn(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'dev', '--root', temp, '--ignore-lock', '--host', '127.0.0.1', '--port', '4487'], { env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', SITE_URL: '', BASE_PATH: '/' }, stdio: 'ignore' });
    try {
        let ready = false;
        for (let i = 0; i < 100; i++) {
            try {
                const res = await fetch('http://127.0.0.1:4487/posts/qa-private/');
                if (res.ok) {
                    const html = await res.text();
                    assert(html.includes('PRIVATE_DRAFT_BODY_SENTINEL'));
                    assert(html.includes('noindex,nofollow'));
                    assert(html.includes('草稿预览'));
                    ready = true;
                    break;
                }
            }
            catch { }
            await new Promise(r => setTimeout(r, 100));
        }
        assert(ready, 'development draft preview did not become ready');
        results.push({ scenario: 'development-draft-preview', result: 'passed' });
    }
    finally {
        dev.kill();
        await new Promise(resolve => dev.once('exit', resolve));
    }
    await fs.writeFile(path.join(root, '../regression-results.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
}
finally {
    await browser.close();
    await fs.rm(temp, { recursive: true, force: true });
}
