// pnpm seed: writes apps/studio/seed.ndjson from apps/web/src/lib/fallback.ts (the DA placeholders), then
// imports it: `pnpm --filter studio exec sanity dataset import ../studio/seed.ndjson production --replace`.
// Node 24 strips the TypeScript types natively.
import { writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fallbackPages, fallbackSite } from '../apps/web/src/lib/fallback.ts';
import { fallbackAbout, fallbackCases, fallbackContact, fallbackNotFound, fallbackPricing } from '../apps/web/src/lib/fallback-pages.ts';

// Sanity needs a _key on every object in an array, and the member _type (apps/studio/schemas) by field name.
const TYPE = {
  nav: 'navItem', panel: 'panelItem', socials: 'link', ctas: 'cta', stats: 'stat', groups: 'group', items: { offers: 'offer', work: 'project' },
  meta: 'cell', results: 'cell', facts: 'cell', chapters: 'chapter', timeline: 'entry', principles: 'principle', points: 'point',
  types: 'projectType', options: 'option', delivery: 'speed', care: 'plan', faq: 'qa', steps: 'step', scores: 'score', links: 'link',
};
const keyed = (v, field, parent) => Array.isArray(v)
  ? v.map((x) => {
    if (!x || typeof x !== 'object') return x;
    const t = typeof TYPE[field] === 'object' ? TYPE[field][parent] : TYPE[field];
    return { _key: randomUUID().slice(0, 8), ...(t && { _type: t }), ...keyed(x) };
  })
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, keyed(x, k, v._type)])) : v;

const docs = [
  { _id: 'site', _type: 'site', ...keyed(fallbackSite) },
  ...fallbackPages.map((p) => ({ _id: `page-${p.slug}`, _type: 'page', ...keyed({ ...p, slug: { _type: 'slug', current: p.slug } }) })),
  // Case studies reference the next one by id; singletons use their schema name as id (apps/studio/sanity.config.ts).
  ...fallbackCases.map(({ next, ...c }) => ({
    _id: `case-${c.slug}`, _type: 'caseStudy', ...keyed({ ...c, slug: { _type: 'slug', current: c.slug } }),
    ...(next && { next: { _type: 'reference', _ref: `case-${next.slug}` } }),
  })),
  ...Object.entries({ aboutPage: fallbackAbout, contactPage: fallbackContact, pricing: fallbackPricing, notFound: fallbackNotFound })
    .map(([id, d]) => ({ _id: id, _type: id, ...keyed(d) })),
];
writeFileSync('apps/studio/seed.ndjson', docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`seed: ${docs.length} documents → apps/studio/seed.ndjson`);
