// Share image of each case study, per language (lib/og.ts), built as a static PNG: /og/fr/<slug>.png, /og/en/<slug>.png.
import type { APIRoute, GetStaticPaths } from 'astro';
import { caseOg } from '@/lib/og';
import { getCases } from '@/lib/sanity';
import { LOCALES, useT, type Lang } from '@/i18n';
import type { CaseStudy } from '@/lib/types';

export const getStaticPaths = (async () =>
  (await Promise.all(LOCALES.map(async (lang) => (await getCases(lang)).map((cs) => ({ params: { lang, slug: cs.slug }, props: { cs, lang } })))))
    .flat()) satisfies GetStaticPaths;

export const GET: APIRoute<{ cs: CaseStudy; lang: Lang }> = async ({ props }) =>
  new Response(new Uint8Array(await caseOg(props.cs, useT(props.lang).case.ogTag)), { headers: { 'Content-Type': 'image/png' } });
