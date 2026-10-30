// pnpm test:unit (node --test, Node 24 strips the types).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { budgetIndex, contactQuery, estimate, eur, initialState } from './estimate.ts';
import { en, fr } from './estimate.fixtures.ts';
import { ui } from '../i18n/ui.ts';

const r = en.pricing;

test('default state: showcase site, 5 pages, with design (start = 1, after the landing page)', () => {
  const e = estimate(initialState(r), r);
  assert.deepEqual(e.parts, [600, 1200, 1500, 0, 0]); // 600 + 4 × 300; design 500 + 4 × 250
  assert.equal(e.total, 3300);
  assert.equal(e.weeks, 4.5);
  assert.equal(e.deposit, 990);
  assert.equal(e.care, 0);
});

const none = r.options.map(() => false);
const only = (...i: number[]) => r.options.map((_, k) => i.includes(k));

test('pages: 600 € the first, 300 € each other; a 5-page site without options is 1 800 €', () => {
  assert.equal(estimate({ ...initialState(r), type: 0, pages: 1, opts: none }, r).total, 600);
  assert.equal(estimate({ ...initialState(r), type: 1, pages: 5, opts: none }, r).total, 1800);
});

test('options: design and copywriting per page, SEO flat, language and motion as % of the subtotal', () => {
  const at = (opts: boolean[]) => estimate({ ...initialState(r), type: 1, pages: 5, opts }, r).total;
  assert.equal(at(only(0)), 1800 + 500 + 4 * 250);
  assert.equal(at(only(4)), 1800 + 5 * 100);
  assert.equal(at(only(3)), 1800 + 300);
  assert.equal(at(only(1)), 1980);
  assert.equal(at(only(2)), 2160);
});

test('extra pages, % option on the subtotal, express on everything', () => {
  const e = estimate({ type: 2, pages: 12, opts: [true, true, false, true, false], delivery: 1, care: 2 }, r);
  assert.deepEqual(e.parts, [1500, 3300, 3550, 840, 2300]);
  assert.equal(e.total, 11490);
  assert.equal(e.weeks, 6); // (3 + 2.75 + 1.5 + 0.5 + 0.5) × 0.7 = 5.775 → next half week
  assert.equal(e.deposit, 3450);
  assert.equal(e.care, 240);
});

test('every figure is rounded to 10', () => {
  const e = estimate({ type: 3, pages: 13, opts: [false, true, true, false, true], delivery: 1, care: 1 }, r);
  for (const v of [...e.parts, e.total, e.deposit]) assert.equal(v % 10, 0);
});

test('budget bands and the contact query', () => {
  assert.deepEqual([1999, 2000, 5999, 6000, 10000].map((t) => budgetIndex(t)), [0, 1, 1, 2, 3]);
  const q = new URLSearchParams(contactQuery(initialState(r), r, { ...en.contact, budgets: ['a', 'b', 'c', 'd'] }, ui.en.pricing.msg, 'en'));
  assert.equal(q.get('type'), 'Development,Design');
  assert.equal(q.get('budget'), 'b');
  assert.match(q.get('msg')!, /€3,300 excl\. VAT, about 4\.5 weeks/);
  assert.equal(eur(1234), '1\u202f230');
  assert.equal(eur(1234, 'en'), '1,230');
});

test('French contact query: French chips, French numbers', () => {
  const q = new URLSearchParams(contactQuery(initialState(fr.pricing), fr.pricing, fr.contact, ui.fr.pricing.msg, 'fr'));
  assert.equal(q.get('type'), 'Développement,Design');
  assert.equal(q.get('budget'), '2 k€ – 6 k€');
  assert.match(q.get('msg')!, /3\u202f300\u00a0€ HT, environ 4,5 semaines/);
});

test('both languages price the same', () => {
  assert.deepEqual(estimate(initialState(fr.pricing), fr.pricing), estimate(initialState(r), r));
});

test('a type billed by the day: days × rate, nothing else, no deposit', () => {
  const rd = { ...r, types: [...r.types, { label: 'Support', note: '', base: 350, pages: 5, weeks: 0, days: true }] };
  const s = { ...initialState(rd), type: rd.types.length - 1, pages: 7, opts: rd.options.map(() => true), delivery: 1, care: 2 };
  const e = estimate(s, rd);
  assert.deepEqual(e.parts, [2450, 0, 0, 0, 0]);
  assert.deepEqual([e.total, e.weeks, e.deposit, e.care], [2450, 1.5, 0, 0]);
  const q = new URLSearchParams(contactQuery(s, rd, en.contact, ui.en.pricing.msg, 'en'));
  assert.equal(q.get('type'), en.contact.types[3]);
  assert.match(q.get('msg')!, /Support, 7 days\. €2,450/);
});

test('maintenance alone: the plan per month is the estimate', () => {
  const rm = { ...r, types: [...r.types, { label: 'Maintenance', note: '', base: 0, pages: 1, weeks: 0, careOnly: true }] };
  const s = { ...initialState(rm), type: rm.types.length - 1, pages: 9, opts: rm.options.map(() => true), delivery: 1, care: 2 };
  const e = estimate(s, rm);
  assert.deepEqual([e.total, e.weeks, e.deposit, e.care], [240, 0, 0, 240]);
  const q = new URLSearchParams(contactQuery(s, rm, en.contact, ui.en.pricing.msg, 'en'));
  assert.equal(q.get('type'), en.contact.types[2]);
  assert.match(q.get('msg')!, /Maintenance, Full plan\. €240 excl\. VAT a month/);
});
