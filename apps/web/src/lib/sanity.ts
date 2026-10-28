// Build-time only. Without a project id, the site builds from lib/content (one file per language).
// Every document has `language` (fr | en); singletons are one document per language: `<type>-<lang>`.
// French strings pass through the typography fix (non-breaking spaces) whichever source they come from.
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { typo, type Lang } from '@/i18n';
import type { AboutPage, CaseStudy, ContactPage, NotFoundPage, Page, Pricing, SanityImage, Site } from './types';
import { fallback } from './content';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

const client = projectId
  ? createClient({ projectId, dataset, apiVersion: '2026-10-01', useCdn: false, perspective: 'published' })
  : null;

const PAGE = `title, "slug": slug.current, seo, blocks, _updatedAt`;

const q = async <T>(lang: Lang, query: string, fb: T): Promise<T> => typo(lang, (await client?.fetch<T | null>(query, { lang })) ?? fb);
// Singletons: fetched whole, the fallback fills the gap until the project exists.
const one = <T>(type: string, lang: Lang, fb: T) => q(lang, `*[_id == "${type}-" + $lang][0]`, fb);

export const getSite = (lang: Lang) =>
  q<Site>(lang, `*[_id == "site-" + $lang][0]{name, role, description, nav, socials, contact, footerLabel}`, fallback[lang].site);
export const getPages = (lang: Lang) =>
  q<Page[]>(lang, `*[_type == "page" && language == $lang && defined(slug.current)]{${PAGE}}`, fallback[lang].pages);
export const getAbout = (lang: Lang) => one<AboutPage>('aboutPage', lang, fallback[lang].about);
export const getContact = (lang: Lang) => one<ContactPage>('contactPage', lang, fallback[lang].contact);
export const getPricing = (lang: Lang) => one<Pricing>('pricing', lang, fallback[lang].pricing);
export const getNotFound = (lang: Lang) => one<NotFoundPage>('notFound', lang, fallback[lang].notFound);
export const getCases = (lang: Lang) =>
  q<CaseStudy[]>(lang, `*[_type == "caseStudy" && language == $lang && defined(slug.current)]{..., "slug": slug.current, next->{title, summary, "slug": slug.current}}`, fallback[lang].cases);

export const imageUrl = (img: SanityImage, width: number) =>
  projectId ? createImageUrlBuilder({ projectId, dataset }).image(img).width(width).auto('format').url() : '';
