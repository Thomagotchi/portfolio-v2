// https://llmstxt.org: a plain summary of the site for AI assistants (GEO).
import type { APIRoute } from 'astro';
import { getPages, getSite } from '@/lib/sanity';

export const GET: APIRoute = async ({ site }) => {
  const [info, pages] = await Promise.all([getSite(), getPages()]);
  const links = pages
    .filter((p) => !p.seo?.noindex)
    .map((p) => `- [${p.title}](${new URL(p.slug === 'index' ? '/' : `/${p.slug}`, site)})${p.seo?.description ? `: ${p.seo.description}` : ''}`);
  return new Response(`# ${info.name}\n\n> ${info.description}\n\n## Pages\n\n${links.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
