// getStaticPaths for the routes that exist once per locale (pages/… and pages/en/…). Each route file is two
// lines: it picks its locale and renders the view (src/views).
import type { Lang } from '@/i18n';
import { getCases, getPages } from './sanity';

/** Sanity pages except the home ("index"), which has its own index route per locale. */
export const pagePaths = async (lang: Lang) =>
  (await getPages(lang)).filter((p) => p.slug !== 'index').map((page) => ({ params: { slug: page.slug }, props: { page } }));

export const homePage = async (lang: Lang) => (await getPages(lang)).find((p) => p.slug === 'index')!;

export const casePaths = async (lang: Lang) =>
  (await getCases(lang)).map((cs) => ({ params: { slug: cs.slug }, props: { cs } }));
