// Seed content from the DA's brand.json. Used when there is no Sanity project id, and imported by
// scripts/seed.mjs to fill a new dataset. Placeholders (email, socials, availability, work rows, case-study
// names) are kept on purpose: replace them in Sanity. Inner pages: fallback-pages.ts.
import type { Page, Site } from './types';

export const fallbackSite: Site = {
  name: 'Thomas Sanouiller',
  role: 'Freelance web developer · France',
  description: 'Freelance web developer in France. Design, development and maintenance of fast websites on Next.js, Astro and Webflow.',
  nav: [
    { label: 'Work', href: '/#work', panel: [
      { eyebrow: '01 · Webflow', title: 'Atelier Brume', text: 'Identity and site in three weeks', href: '/work/atelier-brume' },
      { eyebrow: '02 · Next.js', title: 'Ledger Studio', text: 'Headless CMS and client portal', href: '/work/ledger-studio' },
      { eyebrow: '03 · Astro', title: 'Maison Ondine', text: 'Fast editorial site', href: '/work/maison-ondine' },
      { eyebrow: 'Archive', title: 'All work', text: 'Every project', href: '/#work' },
    ] },
    { label: 'Offers', href: '/#offers', panel: [
      { eyebrow: '01 · Design', title: 'Layouts and direction', text: 'Identity, page designs', href: '/pricing' },
      { eyebrow: '02 · Development', title: 'Built and launched', text: 'Next.js, Astro or Webflow', href: '/pricing' },
      { eyebrow: '03 · Maintenance', title: 'Monthly care', text: 'Updates, backups, small changes', href: '/pricing' },
      { eyebrow: 'Pricing', title: 'Compare plans', text: 'Three price points', href: '/pricing' },
    ] },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Malt', href: 'https://www.malt.fr/' },
    { label: 'Read.cv', href: 'https://read.cv/' },
  ],
  contact: { email: 'hello@thomassanouiller.fr', tz: 'Europe/Paris', place: 'France', status: 'Available', reply: 'Within 24 h', lighthouse: '100 · 100 · 100 · 100' },
  footerLabel: 'Write to',
};

export const fallbackPages: Page[] = [
  {
    title: 'Home',
    slug: 'index',
    seo: { title: 'Thomas Sanouiller · Freelance web developer', description: fallbackSite.description },
    blocks: [
      {
        _type: 'hero', _key: 'hero', label: 'Freelance web developer · France', scene: true,
        heading: { lead: 'Thomas Sanouiller,', muted: 'sites built', tail: 'to stay open' },
        text: 'Design, development and maintenance on Next.js, Astro and Webflow.',
        ctas: [{ label: 'Start a project', href: '/contact', variant: 'primary' }, { label: 'See work', href: '#work', variant: 'secondary' }],
      },
      {
        _type: 'kpi', _key: 'kpi', label: '02 · In numbers', heading: { lead: 'The practice,', muted: 'counted' },
        stats: [{ value: '3', label: 'service lines' }, { value: '3', label: 'price points' }, { value: '2', label: 'languages, FR and EN' }],
      },
      { _type: 'builtWith', _key: 'built', label: 'Built with', items: ['Next.js', 'Astro', 'Webflow', 'three.js'] },
      {
        _type: 'statement', _key: 'practice', label: '01 · Practice', anchor: 'practice',
        text: 'Design, development and maintenance on Next.js, Astro and Webflow. A quiet, precise identity: one grotesk, glyphic capitals for tags, generous space, and one mark, an open frame whose missing corner waits beside it as a pixel.',
      },
      {
        _type: 'stack', _key: 'stack', label: '03 · Stack', heading: { lead: 'Built on tools', muted: 'you already run' },
        groups: [
          { name: 'Frameworks', tools: ['Next.js', 'Astro'] },
          { name: 'Visual builders', tools: ['Webflow', 'Tailwind'] },
          { name: 'Motion and 3D', tools: ['GSAP', 'three.js'] },
          { name: 'Content and hosting', tools: ['Sanity', 'Vercel'] },
        ],
      },
      {
        _type: 'offers', _key: 'offers', label: '04 · Offers', anchor: 'offers',
        items: [
          { title: 'Layouts and direction', meta: 'Visual identity · Page designs', href: '/pricing' },
          { title: 'Built and launched', meta: 'Next.js, Astro or Webflow · CMS and SEO setup', href: '/pricing' },
          { title: 'Monthly care', meta: 'Updates and backups · Small changes', href: '/pricing' },
        ],
        ctas: [{ label: 'Start a project', href: '/contact', variant: 'accent' }, { label: 'See work', href: '#work', variant: 'surface' }],
      },
      {
        _type: 'work', _key: 'work', label: '05 · Work', anchor: 'work', heading: { lead: 'Selected', muted: 'work' },
        items: [
          { title: 'Atelier Brume', meta: 'Identity and Webflow site · 3 weeks', category: 'Webflow', href: '/work/atelier-brume' },
          { title: 'Ledger Studio', meta: 'Headless CMS and client portal', category: 'Next.js', href: '/work/ledger-studio' },
          { title: 'Maison Ondine', meta: 'Editorial site, fast by default', category: 'Astro', href: '/work/maison-ondine' },
          { title: 'Nord Atelier', meta: 'Marketing site with a visual CMS', category: 'Webflow', href: '/work/nord-atelier' },
          { title: 'Halden Labs', meta: 'Docs and product site', category: 'Next.js' },
          { title: 'Studio Vey', meta: 'Portfolio with a 3D hero', category: 'Astro' },
        ],
      },
    ],
  },
];
