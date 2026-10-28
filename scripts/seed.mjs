// pnpm seed: writes apps/studio/seed.ndjson from apps/web/src/lib/content (fr + en), then imports it:
// `pnpm --filter studio exec sanity dataset import ../studio/seed.ndjson production --replace`.
// Every document gets `language`; singletons are `<type>-<lang>`, the ids the site and the Studio use.
// Node 24 strips the TypeScript types natively.
import { writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fallback } from '../apps/web/src/lib/content/index.ts';

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

const docs = Object.entries(fallback).flatMap(([language, c]) => [
  { _id: `site-${language}`, _type: 'site', language, ...keyed(c.site) },
  ...c.pages.map((p) => ({ _id: `page-${language}-${p.slug}`, _type: 'page', language, ...keyed({ ...p, slug: { _type: 'slug', current: p.slug } }) })),
  // Case studies reference the next one (same language) by id.
  ...c.cases.map(({ next, ...cs }) => ({
    _id: `case-${language}-${cs.slug}`, _type: 'caseStudy', language, ...keyed({ ...cs, slug: { _type: 'slug', current: cs.slug } }),
    ...(next && { next: { _type: 'reference', _ref: `case-${language}-${next.slug}` } }),
  })),
  ...Object.entries({ aboutPage: c.about, contactPage: c.contact, pricing: c.pricing, notFound: c.notFound })
    .map(([type, d]) => ({ _id: `${type}-${language}`, _type: type, language, ...keyed(d) })),
]);
writeFileSync('apps/studio/seed.ndjson', docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`seed: ${docs.length} documents → apps/studio/seed.ndjson`);
