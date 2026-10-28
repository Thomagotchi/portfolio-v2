// pnpm test:unit (node --test, Node 24 strips the types).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { budgetIndex, contactQuery, estimate, eur, initialState } from './estimate.ts';
import { fallbackPricing as r } from './fallback-pages.ts';

test('default state: showcase site with design', () => {
  const e = estimate(initialState(r), r);
  assert.deepEqual(e.parts, [2400, 0, 1800, 0, 0]);
  assert.equal(e.total, 4200);
  assert.equal(e.weeks, 4.5);
  assert.equal(e.deposit, 1260);
  assert.equal(e.care, 0);
});

test('extra pages, % option on the subtotal, express on everything', () => {
  const e = estimate({ type: 1, pages: 12, opts: [true, true, false, true, false], delivery: 1, care: 2 }, r);
  assert.deepEqual(e.parts, [4800, 1000, 2400, 1640, 2460]);
  assert.equal(e.total, 12300);
  assert.equal(e.weeks, 6); // (5 + 1 + 2.5) × 0.7 = 5.95 → next half week
  assert.equal(e.deposit, 3690);
  assert.equal(e.care, 190);
});

test('included pages are free, fewer pages never discount', () => {
  const base = estimate({ ...initialState(r), pages: 5 }, r).total;
  assert.equal(estimate({ ...initialState(r), pages: 1 }, r).total, base);
  assert.equal(estimate({ ...initialState(r), pages: 6 }, r).total, base + r.pagePrice);
});

test('every figure is rounded to 10', () => {
  const e = estimate({ type: 2, pages: 13, opts: [false, true, true, false, true], delivery: 1, care: 1 }, r);
  for (const v of [...e.parts, e.total, e.deposit]) assert.equal(v % 10, 0);
});

test('budget bands and the contact query', () => {
  assert.deepEqual([2999, 3000, 5999, 6000, 12000].map((t) => budgetIndex(t)), [0, 1, 1, 2, 3]);
  const q = new URLSearchParams(contactQuery(initialState(r), r, ['a', 'b', 'c', 'd']));
  assert.equal(q.get('type'), 'Development,Design');
  assert.equal(q.get('budget'), 'b');
  assert.match(q.get('msg')!, /4 200 € excl\. VAT, about 4\.5 weeks/);
  assert.equal(eur(1234), '1 230');
});
