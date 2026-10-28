// Locales, URLs and typography. French is the default and lives at the root with French slugs; English
// lives under /en with English slugs. Content and code write canonical paths (/about, /pricing, /work/x,
// /#work); `localize` turns them into the URL of a locale, so a link never has to know the language.
import { ui, type Ui } from './ui';

export const LOCALES = ['fr', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'fr';
/** BCP 47 tags for <html lang>, hreflang, og:locale and Intl. */
export const TAG: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB' };

export const langOf = (l?: string): Lang => (l === 'en' ? 'en' : 'fr');

/** Canonical first segment → French slug. English keeps the canonical slug. */
const FR_SLUGS: Record<string, string> = { about: 'a-propos', pricing: 'tarifs', work: 'projets', contact: 'contact' };
const EN_SLUGS = Object.fromEntries(Object.entries(FR_SLUGS).map(([en, fr]) => [fr, en]));

/** '/pricing?x#y' → '/tarifs?x#y' (fr) | '/en/pricing?x#y' (en). External, mailto and #hash links pass through. */
export function localize(href: string, lang: Lang): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const [, path = '', rest = ''] = href.match(/^([^?#]*)(.*)$/) ?? [];
  const parts = path.split('/').filter(Boolean);
  if (lang === 'fr') {
    if (parts[0] && FR_SLUGS[parts[0]]) parts[0] = FR_SLUGS[parts[0]];
    return `/${parts.join('/')}${rest}`;
  }
  if (parts[0] === 'en') return href; // already localized: idempotent
  return `/en${parts.length ? `/${parts.join('/')}` : ''}${rest}`;
}

/** A served path (either locale) → its canonical path: '/tarifs' → '/pricing', '/en/work/x' → '/work/x'. */
export function canonicalOf(pathname: string): string {
  const parts = pathname.replace(/(index)?\.html$/, '').split('/').filter(Boolean);
  if (parts[0] === 'en') parts.shift();
  else if (parts[0] && EN_SLUGS[parts[0]]) parts[0] = EN_SLUGS[parts[0]];
  return `/${parts.join('/')}`;
}

/** The same page in every locale, for hreflang and the language switch. */
export const alternates = (canonical: string) =>
  Object.fromEntries(LOCALES.map((l) => [l, localize(canonical, l)])) as Record<Lang, string>;

// French typography: a non-breaking space before : and a narrow one before ; ? ! (and inside « »), so the
// mark never starts a line. Applied to every French string at the data layer: editors type plain spaces.
const NBSP = '\u00a0', NNBSP = '\u202f';
export const frTypo = (s: string) =>
  s.replace(/ :(?=\s|$)/g, `${NBSP}:`).replace(/ ([;?!])(?=\s|$|["»)])/g, `${NNBSP}$1`).replace(/« /g, `«${NNBSP}`).replace(/ »/g, `${NNBSP}»`);

/** Deep-maps the strings of a content object (URLs and keys untouched: they never hold " :" or " ?"). */
export function typo<T>(lang: Lang, value: T): T {
  if (lang !== 'fr') return value;
  const walk = (v: unknown): unknown =>
    typeof v === 'string' ? frTypo(v)
    : typeof v === 'function' ? (...a: unknown[]) => walk(v(...a)) // UI templates: type the output
    : Array.isArray(v) ? v.map(walk) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v;
  return walk(value) as T;
}

const typed = { fr: typo('fr', ui.fr), en: ui.en };
/** UI strings for a locale: `const t = useT(Astro.currentLocale)`. */
export const useT = (l?: string): Ui => typed[langOf(l)];

/** Numbers the way each locale writes them (fr: 2 400, en: 2,400). */
export const num = (lang: Lang, n: number) => new Intl.NumberFormat(TAG[lang]).format(n).replace(/[\u00a0\u202f]/g, NNBSP);
