// Pricing simulator: a pure function of the state and the Sanity pricing document (ported from the DA
// board). Every figure is excl. VAT and rounded to 10 €. Unit tests: estimate.test.ts (pnpm test:unit).
import type { Pricing } from './types';

export type EstimateState = { type: number; pages: number; opts: boolean[]; delivery: number; care: number };
export type Estimate = {
  /** Base, extra pages, flat options, % options (second language), express surcharge. */
  parts: [number, number, number, number, number];
  total: number; weeks: number; deposit: number; care: number;
};

export const round10 = (n: number) => Math.round(n / 10) * 10;
type Lang = 'fr' | 'en';
/** 1234 → '1 230' (fr) | '1,230' (en): rounded to 10, narrow no-break space as the French separator. */
export const eur = (n: number, lang: Lang = 'fr') =>
  new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB').format(round10(n)).replace(/[\u00a0\u202f]/g, '\u202f');
/** '2 400 €' (fr) | '€2,400' (en). */
export const money = (n: number, lang: Lang = 'fr') => (lang === 'fr' ? `${eur(n, lang)}\u00a0€` : `€${eur(n, lang)}`);

export const initialState = (r: Pricing): EstimateState => ({
  type: r.start ?? 0, pages: r.types[r.start ?? 0].pages, opts: r.options.map((o) => !!o.on), delivery: 0, care: 0,
});

export function estimate(s: EstimateState, r: Pricing): Estimate {
  const t = r.types[s.type], d = r.delivery[s.delivery];
  const extra = Math.max(0, s.pages - t.pages);
  const on = r.options.filter((_, i) => s.opts[i]);
  const base = t.base, pages = extra * r.pagePrice;
  const flat = on.reduce((a, o) => a + (o.pct ? 0 : o.price ?? 0), 0);
  const sub = base + pages + flat;
  const pct = on.reduce((a, o) => a + (o.pct ? (sub * o.pct) / 100 : 0), 0);
  const rush = ((sub + pct) * d.pct) / 100;
  const wk = (t.weeks + extra * r.pageWeeks + on.reduce((a, o) => a + o.weeks, 0)) * d.factor;
  const parts = [base, pages, flat, pct, rush].map(round10) as Estimate['parts'];
  const total = parts.reduce((a, b) => a + b, 0);
  return { parts, total, weeks: Math.ceil(wk * 2) / 2, deposit: round10((total * r.deposit) / 100), care: r.care[s.care].month };
}

/** Contact budget chip for a total: index into contactPage.budgets (under 3k, 3–6k, 6–12k, 12k+). */
export const budgetIndex = (total: number, bands = [3000, 6000, 12000]) => {
  const i = bands.findIndex((b) => total < b);
  return i === -1 ? bands.length : i;
};

export type ContactChips = { types: string[]; budgets: string[] };
export type EstimateMsg = (type: string, pages: number, opts: string, total: string, weeks: string) => string;

/** Query string for the contact page from an estimate (chips + a message the client can edit). Contact types
 *  are picked by position, whatever the language: [0] design, [1] development, [2] maintenance. */
export function contactQuery(s: EstimateState, r: Pricing, ct: ContactChips, msg: EstimateMsg, lang: Lang = 'fr') {
  const e = estimate(s, r);
  const types = [ct.types[1], ...(s.opts[0] ? [ct.types[0]] : []), ...(s.care ? [ct.types[2]] : [])];
  const opts = r.options.filter((_, i) => s.opts[i]).map((o) => `, ${o.label.toLowerCase()}`).join('');
  const weeks = lang === 'fr' ? String(e.weeks).replace('.', ',') : String(e.weeks);
  return new URLSearchParams({ type: types.join(','), budget: ct.budgets[budgetIndex(e.total)] ?? '', msg: msg(r.types[s.type].label, s.pages, opts, money(e.total, lang), weeks) }).toString();
}
