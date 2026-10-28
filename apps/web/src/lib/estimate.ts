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
export const eur = (n: number) => new Intl.NumberFormat('fr-FR').format(round10(n)).replace(/ | /g, ' ');

export const initialState = (r: Pricing): EstimateState => ({
  type: 0, pages: r.types[0].pages, opts: r.options.map((o) => !!o.on), delivery: 0, care: 0,
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

/** Query string for /contact from an estimate (chips + a message the client can edit). */
export function contactQuery(s: EstimateState, r: Pricing, budgets: string[]) {
  const e = estimate(s, r);
  const types = ['Development', ...(s.opts[0] ? ['Design'] : []), ...(s.care ? ['Maintenance'] : [])];
  const opts = r.options.filter((_, i) => s.opts[i]).map((o) => `, ${o.label.toLowerCase()}`).join('');
  const msg = `Estimate from the simulator: ${r.types[s.type].label}, ${s.pages} pages${opts}. ${eur(e.total)} € excl. VAT, about ${e.weeks} weeks.`;
  return new URLSearchParams({ type: types.join(','), budget: budgets[budgetIndex(e.total)] ?? '', msg }).toString();
}
