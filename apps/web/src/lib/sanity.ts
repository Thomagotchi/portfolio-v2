// Build-time only. Without a project id, the site builds from fallback.ts.
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { AboutPage, CaseStudy, ContactPage, NotFoundPage, Page, Pricing, SanityImage, Site } from './types';
import { fallbackPages, fallbackSite } from './fallback';
import { fallbackAbout, fallbackCases, fallbackContact, fallbackNotFound, fallbackPricing } from './fallback-pages';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

const client = projectId
  ? createClient({ projectId, dataset, apiVersion: '2026-10-01', useCdn: false, perspective: 'published' })
  : null;

const PAGE = `title, "slug": slug.current, seo, blocks, _updatedAt`;

export const getSite = async (): Promise<Site> =>
  (await client?.fetch<Site | null>(`*[_id == "site"][0]{name, role, description, nav, socials, contact, footerLabel}`)) ?? fallbackSite;

export const getPages = async (): Promise<Page[]> =>
  (await client?.fetch<Page[]>(`*[_type == "page" && defined(slug.current)]{${PAGE}}`)) ?? fallbackPages;

// Singletons (one document id each): fetched whole, the fallback fills the gap until the project exists.
const one = async <T>(id: string, fallback: T): Promise<T> => (await client?.fetch<T | null>(`*[_id == $id][0]`, { id })) ?? fallback;
export const getAbout = () => one<AboutPage>('aboutPage', fallbackAbout);
export const getContact = () => one<ContactPage>('contactPage', fallbackContact);
export const getPricing = () => one<Pricing>('pricing', fallbackPricing);
export const getNotFound = () => one<NotFoundPage>('notFound', fallbackNotFound);

export const getCases = async (): Promise<CaseStudy[]> =>
  (await client?.fetch<CaseStudy[]>(`*[_type == "caseStudy" && defined(slug.current)]{..., "slug": slug.current, next->{title, summary, "slug": slug.current}}`)) ?? fallbackCases;

export const imageUrl = (img: SanityImage, width: number) =>
  projectId ? createImageUrlBuilder({ projectId, dataset }).image(img).width(width).auto('format').url() : '';
