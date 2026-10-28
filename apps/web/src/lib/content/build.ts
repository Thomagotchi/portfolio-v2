// Builders shared by the content files (one per language): Sanity-shaped portable text, figures, chapters
// and case studies, so each language file only holds words.
import type { Lang } from '@/i18n';
import type { CaseStudy, Chapter, Figure, Headline, PtBlock } from '../types';

let k = 0;
export const key = () => `k${(k++).toString(36)}`;
export const h = (lead: string, muted?: string, tail?: string): Headline => ({ lead, ...(muted && { muted }), ...(tail && { tail }) });
const pt = (text: string): PtBlock => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] });
type FigureIn = { [K in Figure['kind']]: Omit<Extract<Figure, { kind: K }>, '_type' | '_key'> }[Figure['kind']];
export const fig = (f: FigureIn) => ({ _type: 'figure', _key: key(), ...f }) as Figure;
export const chapter = (label: string, heading: Headline, text: string, figure?: Figure): Chapter =>
  ({ _key: key(), label, heading, body: figure ? [pt(text), figure] : [pt(text)] });

export type CaseSeed = Pick<CaseStudy, 'title' | 'slug' | 'category' | 'summary' | 'heading' | 'lede' | 'meta' | 'results' | 'chapters' | 'quote' | 'source' | 'media' | 'placeholder'>;
const LABEL: Record<Lang, [string, string]> = { fr: ['Étude de cas', 'étude de cas'], en: ['Case study', 'case study'] };

/** Meta description from the lede: whole if it fits 155 characters, else cut at a word with an ellipsis. */
const clip = (s: string) => (s.length <= 155 ? s : `${s.slice(0, 154).replace(/[\s,;:]+\S*$/, '')}…`);

/** Numbers the studies in order, labels them per language and links each to the next (the last to the first). */
export function caseStudies(lang: Lang, seeds: CaseSeed[]): CaseStudy[] {
  const [label, seo] = LABEL[lang];
  const cases: CaseStudy[] = seeds.map((c, i) => ({
    ...c, label: `${label} · ${String(i + 1).padStart(2, '0')} · ${c.category}`,
    seo: { title: `${c.title} · ${seo}`, description: clip(c.lede) },
  }));
  cases.forEach((c, i) => { const n = cases[(i + 1) % cases.length]; c.next = { title: n.title, slug: n.slug, summary: n.summary }; });
  return cases;
}
