// Inner pages seeded from the DA's brand.json → pages (placeholders until replaced in Sanity).
// Atelier Brume is the DA's case study; Ledger Studio, Maison Ondine and Nord Atelier are placeholder copies
// on the same model. scripts/seed.mjs imports everything here.
import type { AboutPage, CaseStudy, Chapter, ContactPage, Figure, Headline, NotFoundPage, Pricing, PtBlock } from './types';

let k = 0;
const key = () => `k${(k++).toString(36)}`;
const h = (lead: string, muted?: string, tail?: string): Headline => ({ lead, ...(muted && { muted }), ...(tail && { tail }) });
const pt = (text: string): PtBlock => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] });
type FigureIn = { [K in Figure['kind']]: Omit<Extract<Figure, { kind: K }>, '_type' | '_key'> }[Figure['kind']];
const fig = (f: FigureIn) => ({ _type: 'figure', _key: key(), ...f }) as Figure;
const chapter = (label: string, heading: Headline, text: string, figure?: Figure): Chapter =>
  ({ _key: key(), label, heading, body: figure ? [pt(text), figure] : [pt(text)] });

type CaseSeed = Pick<CaseStudy, 'title' | 'slug' | 'category' | 'summary' | 'lede' | 'meta' | 'results' | 'chapters' | 'quote'> & { n: number; heading: Headline };
const study = (c: CaseSeed): CaseStudy => ({
  ...c, label: `Case study · 0${c.n} · ${c.category}`, placeholder: true,
  seo: { title: `${c.title} · case study`, description: c.lede.slice(0, 155) },
});

const cases: CaseStudy[] = [
  study({
    n: 1, title: 'Atelier Brume', slug: 'atelier-brume', category: 'Webflow', summary: 'Identity and site in three weeks',
    heading: h('Atelier Brume,', 'a studio site', 'built in three weeks'),
    lede: 'A ceramics studio in Lyon, selling through Instagram and a slow template site. A new identity and a Webflow site the team now runs alone.',
    meta: [{ label: 'Client', value: 'Atelier Brume' }, { label: 'Year', value: '2025' }, { label: 'Role', value: 'Design and development' }, { label: 'Stack', value: 'Webflow, GSAP' }, { label: 'Live', value: 'atelierbrume.fr' }],
    results: [{ value: '+38%', label: 'enquiries in 3 months' }, { value: '0.8s', label: 'largest paint' }, { value: '100', label: 'Lighthouse' }, { value: '3', label: 'weeks, brief to launch' }],
    chapters: [
      chapter('01 · Brief', h('Show the work', 'at full size'), 'The studio sold through Instagram and a template site that took four seconds to show a bowl. They wanted the pieces large, commissions taken online, and a site they could edit without calling anyone.'),
      chapter('02 · Approach', h('Three weeks,', 'five steps'), 'One week to agree the structure and the identity, one to design every template, one to build, train and launch. Each step ends with a call and a link to review.',
        fig({ kind: 'steps', steps: [{ when: 'W1', label: 'Audit and structure' }, { when: 'W1', label: 'Identity' }, { when: 'W2', label: 'Page designs' }, { when: 'W2–3', label: 'Webflow build' }, { when: 'W3', label: 'Launch and training' }] })),
      chapter('03 · Build', h('Same studio,', 'rebuilt'), 'Rebuilt in Webflow with a CMS for pieces and exhibitions, GSAP for the reveals and every image served at the size it is shown. Drag the line to compare.',
        fig({ kind: 'compare', before: 'Before · template · LCP 4.2 s', after: 'After · Webflow · LCP 0.8 s' })),
      chapter('04 · Results', h('Faster, and', 'finally theirs'), 'Measured on mobile, before and after launch. The team publishes new pieces every week.',
        fig({ kind: 'lighthouse', scores: [{ label: 'Performance', before: 54, after: 100 }, { label: 'Accessibility', before: 71, after: 100 }, { label: 'Best practices', before: 83, after: 100 }, { label: 'SEO', before: 76, after: 100 }] })),
    ],
    quote: { text: 'We publish new pieces ourselves every week now. The site finally looks like the studio.', cite: 'Claire M., founder, Atelier Brume' },
  }),
  study({
    n: 2, title: 'Ledger Studio', slug: 'ledger-studio', category: 'Next.js', summary: 'Headless CMS and client portal',
    heading: h('Ledger Studio,', 'a client portal', 'on a headless CMS'),
    lede: 'An accounting studio in Paris sending reports by email. A Next.js site and a client portal, with every page edited in Sanity.',
    meta: [{ label: 'Client', value: 'Ledger Studio' }, { label: 'Year', value: '2025' }, { label: 'Role', value: 'Development' }, { label: 'Stack', value: 'Next.js, Sanity' }, { label: 'Live', value: 'ledgerstudio.fr' }],
    results: [{ value: '-60%', label: 'support emails' }, { value: '1.1s', label: 'largest paint' }, { value: '100', label: 'Lighthouse' }, { value: '6', label: 'weeks, brief to launch' }],
    chapters: [
      chapter('01 · Brief', h('Reports,', 'without the inbox'), 'Clients asked for their documents by email every month. The studio wanted one place to publish them, and a public site the partners could update.'),
      chapter('02 · Approach', h('Six weeks,', 'five steps'), 'Structure and content model first, then the portal flows, then the build in two-week sprints with a review link at every step.',
        fig({ kind: 'steps', steps: [{ when: 'W1', label: 'Content model' }, { when: 'W2', label: 'Portal flows' }, { when: 'W3', label: 'Designs' }, { when: 'W3–5', label: 'Next.js build' }, { when: 'W6', label: 'Launch and training' }] })),
      chapter('03 · Build', h('One site,', 'two audiences'), 'A public site and a signed-in portal on the same Next.js app, with content and documents in Sanity. Drag the line to compare.',
        fig({ kind: 'compare', before: 'Before · email · no portal', after: 'After · Next.js · LCP 1.1 s' })),
      chapter('04 · Results', h('Fewer emails,', 'faster pages'), 'Measured on mobile, before and after launch. Clients now find their reports themselves.',
        fig({ kind: 'lighthouse', scores: [{ label: 'Performance', before: 62, after: 100 }, { label: 'Accessibility', before: 78, after: 100 }, { label: 'Best practices', before: 92, after: 100 }, { label: 'SEO', before: 83, after: 100 }] })),
    ],
    quote: { text: 'Our clients stopped asking where their reports are. That alone paid for the project.', cite: 'Julien R., partner, Ledger Studio' },
  }),
  study({
    n: 3, title: 'Maison Ondine', slug: 'maison-ondine', category: 'Astro', summary: 'Editorial site, fast by default',
    heading: h('Maison Ondine,', 'an editorial site', 'fast by default'),
    lede: 'A perfume house publishing long stories on a heavy theme. An Astro site where every article loads in under a second on a cheap phone.',
    meta: [{ label: 'Client', value: 'Maison Ondine' }, { label: 'Year', value: '2024' }, { label: 'Role', value: 'Design and development' }, { label: 'Stack', value: 'Astro, Sanity' }, { label: 'Live', value: 'maisonondine.fr' }],
    results: [{ value: '+52%', label: 'time on page' }, { value: '0.6s', label: 'largest paint' }, { value: '100', label: 'Lighthouse' }, { value: '4', label: 'weeks, brief to launch' }],
    chapters: [
      chapter('01 · Brief', h('Long stories,', 'short waits'), 'The house wrote long, image-rich stories that took six seconds to open. They wanted the writing first and the images at full quality.'),
      chapter('02 · Approach', h('Four weeks,', 'five steps'), 'An audit of the old theme, an editorial grid, then a static Astro build with images sized at build time.',
        fig({ kind: 'steps', steps: [{ when: 'W1', label: 'Audit' }, { when: 'W1', label: 'Editorial grid' }, { when: 'W2', label: 'Templates' }, { when: 'W3', label: 'Astro build' }, { when: 'W4', label: 'Launch' }] })),
      chapter('03 · Build', h('Same stories,', 'lighter pages'), 'Static pages from Sanity, images in AVIF at the size they are shown, no client JavaScript on articles. Drag the line to compare.',
        fig({ kind: 'compare', before: 'Before · theme · LCP 5.8 s', after: 'After · Astro · LCP 0.6 s' })),
      chapter('04 · Results', h('Read to', 'the end'), 'Measured on mobile, before and after launch. Readers now finish the stories.',
        fig({ kind: 'lighthouse', scores: [{ label: 'Performance', before: 38, after: 100 }, { label: 'Accessibility', before: 74, after: 100 }, { label: 'Best practices', before: 79, after: 100 }, { label: 'SEO', before: 81, after: 100 }] })),
    ],
    quote: { text: 'The stories finally open as fast as people want to read them.', cite: 'Inès D., editor, Maison Ondine' },
  }),
  study({
    n: 4, title: 'Nord Atelier', slug: 'nord-atelier', category: 'Webflow', summary: 'Marketing site with a visual CMS',
    heading: h('Nord Atelier,', 'a marketing site', 'the team edits'),
    lede: 'An architecture practice in Lille waiting on an agency for every change. A Webflow site the team updates themselves, project by project.',
    meta: [{ label: 'Client', value: 'Nord Atelier' }, { label: 'Year', value: '2024' }, { label: 'Role', value: 'Design and development' }, { label: 'Stack', value: 'Webflow' }, { label: 'Live', value: 'nordatelier.fr' }],
    results: [{ value: '+24', label: 'projects published' }, { value: '0.9s', label: 'largest paint' }, { value: '100', label: 'Lighthouse' }, { value: '3', label: 'weeks, brief to launch' }],
    chapters: [
      chapter('01 · Brief', h('Every change,', 'a ticket'), 'Each new project meant an email to the agency and a two-week wait. The practice wanted to publish projects the day they were photographed.'),
      chapter('02 · Approach', h('Three weeks,', 'five steps'), 'A project template first, then the pages around it, then training so the team could publish on day one.',
        fig({ kind: 'steps', steps: [{ when: 'W1', label: 'Structure' }, { when: 'W1', label: 'Project template' }, { when: 'W2', label: 'Page designs' }, { when: 'W2–3', label: 'Webflow build' }, { when: 'W3', label: 'Training' }] })),
      chapter('03 · Build', h('Same practice,', 'in their hands'), 'Webflow with a CMS for projects and people, and a component library the team can recombine. Drag the line to compare.',
        fig({ kind: 'compare', before: 'Before · agency CMS · LCP 3.6 s', after: 'After · Webflow · LCP 0.9 s' })),
      chapter('04 · Results', h('Published', 'the same day'), 'Measured on mobile, before and after launch. Projects go live the day they are shot.',
        fig({ kind: 'lighthouse', scores: [{ label: 'Performance', before: 58, after: 100 }, { label: 'Accessibility', before: 69, after: 100 }, { label: 'Best practices', before: 88, after: 100 }, { label: 'SEO', before: 72, after: 100 }] })),
    ],
    quote: { text: 'We publish a project the day it is photographed. No tickets, no waiting.', cite: 'Marc L., partner, Nord Atelier' },
  }),
];
// Next project: each case points at the following one, the last back to the first.
cases.forEach((c, i) => { const n = cases[(i + 1) % cases.length]; c.next = { title: n.title, slug: n.slug, summary: n.summary }; });
export const fallbackCases = cases;

export const fallbackAbout: AboutPage = {
  label: 'About', heading: h('Thomas Sanouiller,', 'developer', 'for the long run'),
  lede: 'Freelance web developer in France since 2016. I design, build and look after sites for studios and small teams, in Webflow, Astro and Next.js.',
  facts: [{ label: 'Based', value: 'France' }, { label: 'Since', value: '2016' }, { label: 'Languages', value: 'FR · EN' }, { label: 'Projects', value: '60+' }],
  statementLabel: 'Practice',
  statement: 'I build sites the way I would want mine built: fast on a cheap phone, easy to edit on a Monday morning, and still running three years later without a rewrite.',
  timelineLabel: 'Timeline', timelineHeading: h('Ten years,', 'one practice'),
  timeline: [
    ['2016', 'First sites', 'WordPress sites for local shops and associations, while still studying.', ['WordPress', 'PHP']],
    ['2018', 'Agency years', 'Front-end developer in a Lyon agency: campaigns, e-commerce, first React projects.', ['React', 'Shopify']],
    ['2020', 'Independent', 'Went freelance. Webflow for marketing sites, Next.js for products.', ['Webflow', 'Next.js']],
    ['2022', 'Headless', 'Moved client work to headless content: Sanity, Next.js and Vercel.', ['Sanity', 'Vercel']],
    ['2024', 'Astro and 3D', 'Astro for content sites; three.js and GSAP for motion that stays fast.', ['Astro', 'three.js', 'GSAP']],
    ['2026', 'Now', 'Design, development and care, start to finish, for studios and small teams.', ['Design', 'Build', 'Care']],
  ].map(([year, title, text, tags]) => ({ _key: key(), year: year as string, title: title as string, text: text as string, tags: tags as string[] })),
  principlesLabel: 'How I work',
  principles: [
    { _key: key(), title: 'Open by default', text: 'Your code, your accounts, your CMS. Nothing is locked to me.' },
    { _key: key(), title: 'Fast first', text: 'Every page ships at 100 on Lighthouse, or I tell you why not.' },
    { _key: key(), title: 'Kept running', text: 'Updates, backups and small changes after launch, on a monthly plan.' },
  ],
  ctas: [{ label: 'Start a project', href: '/contact', variant: 'accent' }, { label: 'See pricing', href: '/pricing', variant: 'secondary' }],
  seo: { title: 'About · Thomas Sanouiller', description: 'Freelance web developer in France since 2016: design, development and care of fast sites in Webflow, Astro and Next.js.' },
  placeholder: true,
};

export const fallbackContact: ContactPage = {
  label: 'Contact', heading: h('Tell me about', 'the site', 'you need'),
  lede: 'Five short questions. I read every brief myself and reply within 24 hours, with a first estimate or a few questions.',
  types: ['Design', 'Development', 'Maintenance', 'Not sure yet'],
  budgets: ['Under 3 k€', '3 to 6 k€', '6 to 12 k€', '12 k€ and up'],
  timings: ['As soon as possible', 'In 1 to 2 months', 'In 3 months or more', 'Flexible'],
  done: { title: 'Brief sent.', text: 'I reply within 24 h.' },
  seo: { title: 'Contact · Thomas Sanouiller', description: 'Send a short brief for a website project: design, development or maintenance. Reply within 24 hours.' },
  placeholder: true,
};

export const fallbackPricing: Pricing = {
  label: 'Pricing', heading: h('Prices,', 'in the open'),
  lede: 'Three price points, then a simulator for your own project. Every figure is a starting estimate excluding VAT; the final quote follows a call.',
  points: [
    { _key: key(), label: 'Design', title: 'Layouts and direction', from: 1800, items: ['Identity and page designs', 'Two rounds of changes', 'Figma file handed over'] },
    { _key: key(), label: 'Development', title: 'Built and launched', from: 2400, items: ['Next.js, Astro or Webflow', 'CMS and SEO setup', 'Training session'] },
    { _key: key(), label: 'Maintenance', title: 'Monthly care', from: 90, per: ' / month', items: ['Updates and backups', 'Uptime monitoring', 'Small changes'] },
  ],
  simLabel: 'Simulator', simHeading: h('Your project,', 'priced', 'live'), faqLabel: 'Questions',
  types: [
    { label: 'Showcase site', note: 'Up to 5 pages', base: 2400, pages: 5, weeks: 3 },
    { label: 'Site and CMS', note: 'Up to 8 pages, Sanity or Webflow CMS', base: 4800, pages: 8, weeks: 5 },
    { label: 'Web app', note: 'Accounts and a dashboard', base: 9000, pages: 10, weeks: 8 },
  ],
  pagePrice: 250, pageWeeks: 0.25, maxPages: 24,
  options: [
    { label: 'Design included', note: 'Layouts and direction', price: 1800, weeks: 1.5, on: true },
    { label: 'Second language', note: 'FR and EN', pct: 20, weeks: 0.5 },
    { label: 'Motion and 3D', note: 'GSAP reveals, a three.js hero', price: 1200, weeks: 1 },
    { label: 'SEO setup', note: 'Audit, schema, redirects', price: 600, weeks: 0.5 },
    { label: 'Copywriting help', note: 'Structure and editing', price: 800, weeks: 1 },
  ],
  delivery: [{ label: 'Standard', pct: 0, factor: 1 }, { label: 'Express', note: '30% sooner', pct: 25, factor: 0.7 }],
  care: [{ label: 'None', month: 0 }, { label: 'Essential', note: 'Updates, backups', month: 90 }, { label: 'Full', note: 'Plus 2 h of changes', month: 190 }],
  deposit: 30,
  faq: [
    { question: 'What is included in the price?', answer: 'Design if selected, development, CMS setup, launch and a training session. Hosting and the domain are billed to you directly, at cost.' },
    { question: 'How do payments work?', answer: '30% to book the dates, 40% when the designs are signed off, 30% at launch. Invoices in euros, excluding VAT.' },
    { question: 'Can I edit the site myself?', answer: 'Yes. Every site ships with a CMS, Webflow or Sanity, and a short video guide for your team.' },
    { question: 'What if the scope changes?', answer: 'The estimate is updated before any extra work starts. Nothing is billed without your written OK.' },
  ],
  seo: { title: 'Pricing · Thomas Sanouiller', description: 'Website prices in the open: three price points and a live simulator for design, development and care. Excluding VAT.' },
  placeholder: true,
};

export const fallbackNotFound: NotFoundPage = {
  label: 'Error 404', heading: h('This page is', 'off the grid'), found: h('Back on', 'the grid'),
  lede: 'The link may be old, or the page moved when the site was rebuilt. The pixel went looking for it. Drag it back to its corner.',
  links: [{ label: 'Home', href: '/' }, { label: 'Work', href: '/#work' }, { label: 'Pricing', href: '/pricing' }, { label: 'Contact', href: '/contact' }],
  seo: { title: 'Page not found · Thomas Sanouiller', description: 'This page does not exist or has moved.', noindex: true },
};
