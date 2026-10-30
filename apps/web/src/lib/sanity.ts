// Build-time only: Sanity is the only content source (PUBLIC_SANITY_PROJECT_ID in the root .env).
// Every document has `language` (fr | en); singletons are one document per language: `<type>-<lang>`.
// French strings pass through the typography fix (non-breaking spaces).
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { typo, type Lang } from '@/i18n';
import type { AboutPage, CaseStudy, ContactPage, NotFoundPage, Page, Pricing, SanityImage, Site } from './types';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

if (!projectId) throw new Error('PUBLIC_SANITY_PROJECT_ID is missing: copy .env.example to .env at the repo root and fill it.');
const client = createClient({ projectId, dataset, apiVersion: '2026-10-01', useCdn: false, perspective: 'published' });

const PAGE = `title, "slug": slug.current, seo, blocks, _updatedAt`;

const q = async <T>(lang: Lang, query: string, what: string): Promise<T> => {
  const res = await client.fetch<T | null>(query, { lang });
  if (res == null) throw new Error(`Sanity: no published ${what} (${lang}).`);
  return typo(lang, res);
};
// Singletons: fetched whole, one document per language.
const one = <T>(type: string, lang: Lang) => q<T>(lang, `*[_id == "${type}-" + $lang][0]`, `${type}-${lang}`);

export const getSite = (lang: Lang) =>
  q<Site>(lang, `*[_id == "site-" + $lang][0]{name, role, description, nav, socials, contact, footerLabel}`, 'site');
export const getPages = (lang: Lang) =>
  q<Page[]>(lang, `*[_type == "page" && language == $lang && defined(slug.current)]{${PAGE}}`, 'pages');
export const getAbout = (lang: Lang) => one<AboutPage>('aboutPage', lang);
export const getContact = (lang: Lang) => one<ContactPage>('contactPage', lang);
export const getPricing = (lang: Lang) => one<Pricing>('pricing', lang);
export const getNotFound = (lang: Lang) => one<NotFoundPage>('notFound', lang);
export const getCases = (lang: Lang) =>
  q<CaseStudy[]>(lang, `*[_type == "caseStudy" && language == $lang && defined(slug.current)]{..., "slug": slug.current, "coverVideo": coverVideo.asset->url, "screenVideo": screenVideo.asset->url, next->{title, summary, "slug": slug.current}}`, 'case studies');

export const imageUrl = (img: SanityImage, width: number) =>
  createImageUrlBuilder({ projectId, dataset }).image(img).width(width).auto('format').url();
