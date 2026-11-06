import assert from 'node:assert/strict';

export async function checkHome(page) {
  assert.equal(await page.locator('#terminal-input, .hero, [data-terminal]').count(), 0);
  const rows = page.locator('main [data-post]');
  const ids = await rows.evaluateAll(els => els.map(el => el.dataset.id));
  assert(ids.length <= 6);
  assert.equal(Number(await page.locator('.latest-count').textContent()), ids.length);
  if (!ids.length) assert(await page.locator('#home-empty').isVisible());
  const flow = page.locator('[data-binary-flow]');
  assert.equal(await flow.getAttribute('aria-hidden'), 'true');
  assert.equal(await flow.evaluate(el => getComputedStyle(el).pointerEvents), 'none');
  assert.match((await flow.locator('.binary-copy').allTextContents()).join('').replace(/\s/g, ''), /^[01]+$/);
  assert.equal(await flow.locator('[data-binary-track]').count(), 4);
  assert.equal(await flow.locator('.binary-bit').count(), 384);
  // Each repeated copy references the same underlying glyphs and brightness.
  for (const track of await flow.locator('[data-binary-track]').all()) {
    const hrefs = await track.locator('[data-binary-copy]').allTextContents();
    assert.equal(new Set(hrefs).size, 1);
    assert.equal(hrefs.length, 3);
  }
  for (const row of await rows.all()) {
    const styles = await row.evaluate(el => ({ background: getComputedStyle(el).backgroundImage, opacity: getComputedStyle(el).opacity }));
    assert(styles.background.includes('0.88') && styles.background.includes('0.76'));
    assert.equal(styles.opacity, '1', 'text must not inherit card background transparency');
    const box = await row.boundingBox();
    assert(await row.evaluate((el, { x, y }) => el.contains(document.elementFromPoint(x, y)), { x: box.x + box.width / 2, y: box.y + 10 }));
    // Only inspect the first visible card: lower cards may be below the viewport.
    break;
  }
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  return ids;
}
