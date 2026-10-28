// https://llmstxt.org: a plain summary of the site for AI assistants (GEO), both languages.
import type { APIRoute } from 'astro';
import { getAbout, getCases, getContact, getPricing, getSite } from '@/lib/sanity';
import { LOCALES, localize, type Lang } from '@/i18n';

const HEAD: Record<Lang, string> = { fr: 'Français', en: 'English' };

export const GET: APIRoute = async ({ site }) => {
  const url = (path: string, lang: Lang) => new URL(localize(path, lang), site).href;
  const parts = await Promise.all(LOCALES.map(async (lang) => {
    const [info, about, pricing, contact, cases] = await Promise.all([getSite(lang), getAbout(lang), getPricing(lang), getContact(lang), getCases(lang)]);
    const links = [
      [info.name, '/', info.description], [about.label, '/about', about.seo?.description], [pricing.label, '/pricing', pricing.seo?.description],
      [contact.label, '/contact', contact.seo?.description], ...cases.map((c) => [c.title, `/work/${c.slug}`, c.summary]),
    ].map(([title, path, desc]) => `- [${title}](${url(path!, lang)})${desc ? `: ${desc}` : ''}`);
    return `## ${HEAD[lang]}\n\n> ${info.description}\n\n${links.join('\n')}`;
  }));
  const name = (await getSite('fr')).name;
  return new Response(`# ${name}\n\n${parts.join('\n\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
