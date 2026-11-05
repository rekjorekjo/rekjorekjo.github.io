import assert from 'node:assert/strict';
import { validateCategorySegment, categoryRoute, collectCategoryPaths, collectTags, tagSlug, registerRoute } from '../src/lib/taxonomy-core.ts';
for (const value of ['', ' ', '.', '..', '/', '\\', 'CTF/Crypto', 'CTF\\Crypto', 'A%2fB', 'A?B', 'A#B', 'A:B', ' A', 'A ', 'A.', 'CON', 'nul.txt', 'A\u0000B']) assert.throws(() => validateCategorySegment(value), /非法分类/);
for (const value of ['CTF', 'Crypto', 'Number Theory', '数论', '.NET', 'ctf.notes']) assert.equal(validateCategorySegment(value), value);
assert.equal(categoryRoute(['CTF', 'Crypto', '数论']), 'CTF/Crypto/%E6%95%B0%E8%AE%BA');
assert.throws(() => collectCategoryPaths([['CTF', 'Crypto'], ['CTF', 'crypto']]), /URL 冲突/);
assert.throws(() => collectCategoryPaths([['é'], ['e\u0301']]), /URL 冲突/);
assert.throws(() => collectCategoryPaths([['É'], ['é']]), /URL 冲突/);
assert.throws(() => collectCategoryPaths([['σ'], ['ς']]), /URL 冲突/);
assert.throws(() => collectCategoryPaths([['I'], ['ı']]), /URL 冲突/);
assert.deepEqual(collectCategoryPaths([['A', 'B'], ['A', 'C'], ['A', 'B']]), [['A'], ['A', 'B'], ['A', 'C']]);
const registry = new Map(); registerRoute(registry, 'tags/slug', 'first');
assert.throws(() => registerRoute(registry, 'tags/SLUG', 'second'), /URL 冲突/);
const names = ['Python/SageMath', '100%', '中文', 'with space', 'C#', 'C++', 'Python', 'python', '.', '..', 'with\\backslash'];
const tags = collectTags([names, ['100%', '100%']]);
assert.equal(tags.length, names.length); assert.equal(new Set(tags.map(tag => tag.slug)).size, names.length);
assert.equal(tags.find(tag => tag.name === '100%').count, 2);
for (const name of names) { assert.equal(tagSlug(name), tagSlug(name)); assert.match(tagSlug(name), /^t-[0-9a-f]{32}$/); }
assert.throws(() => tagSlug(''), /非法标签/); assert.throws(() => tagSlug('\ud800'), /非法标签/);
console.log('Taxonomy validation, route conflict detection, tag mapping and counts passed.');

assert.equal(tagSlug('Python'), 't-fd2b80b48d3c64bf6edb51f2dbfeb097'); // permalink stability
