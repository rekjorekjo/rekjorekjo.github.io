import assert from 'node:assert/strict';

export async function checkTaxonomy(page, base) {
  const url = new URL(`${base.replace(/\/+$/, '')}/`);
  await page.goto(new URL('archive/', url).href);
  assert.equal(await page.locator('#search, .search-field, .header-search').count(), 0);
  const archiveIds = await page.locator('[data-post]').evaluateAll(els => els.map(el => el.dataset.id));
  assert.equal(new Set(archiveIds).size, archiveIds.length);
  if (archiveIds.length) assert(await page.locator('.archive-year').count() > 0);
  else assert(await page.getByText('还没有发布的文章，新的笔记正在整理中。').isVisible());
  const tagMembers = await page.locator('[data-post]').evaluateAll(rows => {
    const entries = {};
    rows.forEach(row => row.querySelectorAll('.tags a').forEach(a => {
      (entries[a.href] ??= []).push(row.dataset.id);
    }));
    return entries;
  });
  await page.goto(new URL('categories/', url).href);
  const categories = await page.locator('.category-entry').evaluateAll(els => els.map(el => ({
    url: el.href, count: Number(el.querySelector('.category-total').textContent),
  })));
  const tagUrls = await page.locator('.taxonomy-tags .tags a').evaluateAll(els => els.map(el => el.href));
  assert.equal(new Set(categories.map(entry => decodeURIComponent(entry.url).normalize('NFC').toUpperCase().toLowerCase().normalize('NFC'))).size, categories.length);
  assert.equal(new Set(tagUrls).size, tagUrls.length);
  assert.deepEqual([...tagUrls].sort(), Object.keys(tagMembers).sort());
  for (const {url: href, count} of categories) {
    assert.equal((await page.goto(href)).status(), 200, href);
    const ids = await page.locator('[data-post]').evaluateAll(els => els.map(el => el.dataset.id));
    assert.equal(ids.length, count, href);
    assert.equal(new Set(ids).size, ids.length);
    assert(ids.every(id => archiveIds.includes(id)));
  }
  for (const href of tagUrls) {
    assert.equal((await page.goto(href)).status(), 200, href);
    const ids = await page.locator('[data-post]').evaluateAll(els => els.map(el => el.dataset.id));
    assert.deepEqual(ids.sort(), [...new Set(tagMembers[href])].sort(), href);
  }
  return [new URL('categories/', url).href, ...categories.map(entry => entry.url), ...tagUrls];
}
