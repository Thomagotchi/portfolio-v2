// Fallback content per language: what the site builds from until the Sanity project exists, and what
// scripts/seed.mjs imports into it. Every document in Sanity carries `language` (fr | en).
import type { Lang } from '@/i18n';
import type { AboutPage, CaseStudy, ContactPage, NotFoundPage, Page, Pricing, Site } from '../types';
import { en } from './en.ts';
import { fr } from './fr.ts';

export type Content = { site: Site; pages: Page[]; cases: CaseStudy[]; about: AboutPage; contact: ContactPage; pricing: Pricing; notFound: NotFoundPage };

export const fallback: Record<Lang, Content> = { fr, en };
