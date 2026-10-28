// English content, adapted from the French (the default), until Sanity holds it (scripts/seed.mjs imports it as
// language "en"). Facts from Thomas only (web-copy skill). Case studies reuse Bruno's text and images with the
// agency's OK, on condition that each links to the agency's own case study (`source`).
import type { AboutPage, ContactPage, NotFoundPage, Page, Pricing, Site } from '../types';
import { caseStudies, chapter, h, key } from './build.ts';
import type { Content } from './index.ts';

const site: Site = {
  name: 'Thomas Sanouiller',
  role: 'Freelance web developer · Normandy',
  description: 'Freelance web developer in Normandy, France. Webflow and Next.js sites, landing pages and day-rate support for brands and agencies.',
  nav: [
    { label: 'Work', href: '/#work', panel: [
      { eyebrow: '01 · Webflow', title: 'Audion', text: 'Webflow and three.js', href: '/work/audion' },
      { eyebrow: '02 · Webflow', title: 'La Première Brique', text: 'Webflow and APIs', href: '/work/la-premiere-brique' },
      { eyebrow: '03 · Next.js', title: 'Zelder', text: 'Shopify e-commerce', href: 'https://zelder.fr/' },
      { eyebrow: 'Archive', title: 'All work', text: 'The full list', href: '/#work' },
    ] },
    { label: 'Offers', href: '/#offers', panel: [
      { eyebrow: '01 · Development', title: 'Sites and apps', text: 'Webflow, Next.js or Astro', href: '/pricing' },
      { eyebrow: '02 · Landing page', title: 'One page, live fast', text: 'From €1,200 excl. VAT', href: '/pricing' },
      { eyebrow: '03 · Support', title: 'By the day', text: '€350 excl. VAT a day', href: '/pricing' },
      { eyebrow: 'Pricing', title: 'Every price', text: 'And the simulator', href: '/pricing' },
    ] },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/thomas-sanouiller/' },
    { label: 'GitHub', href: 'https://github.com/Thomagotchi' },
  ],
  contact: { email: 'thomassanouiller.contact@gmail.com', tz: 'Europe/Paris', place: 'Normandy', status: 'Available', reply: 'Within 24 h', lighthouse: '100 · 100 · 100 · 100' },
  footerLabel: 'Write to',
};

const pages: Page[] = [
  {
    title: 'Home',
    slug: 'index',
    seo: { title: 'Thomas Sanouiller · Freelance web developer in Normandy', description: site.description },
    blocks: [
      {
        _type: 'hero', _key: 'hero', label: 'Freelance · Normandy', scene: true,
        heading: { lead: 'Thomas Sanouiller,', muted: 'web developer', tail: 'for brands and agencies' },
        text: 'I turn demanding designs into Webflow or Next.js sites, motion and 3D included.',
        ctas: [{ label: 'Start a project', href: '/contact', variant: 'primary' }, { label: 'See work', href: '#work', variant: 'secondary' }],
      },
      {
        _type: 'kpi', _key: 'kpi', label: '02 · In numbers', heading: { lead: 'The path so far,', muted: 'counted' },
        stats: [{ value: '3', label: 'years of web development' }, { value: '2', label: 'years at a branding agency' }, { value: '24 h', label: 'to get back to you' }],
      },
      { _type: 'builtWith', _key: 'built', label: 'Tools', items: ['Webflow', 'Next.js', 'React', 'three.js', 'GSAP'] },
      {
        _type: 'statement', _key: 'practice', label: '01 · Practice', anchor: 'practice',
        text: 'At Bruno, I build the sites of brands like Audion and La Première Brique. The designers there care about every detail; my job is to get that detail online as drawn, on every screen. I work the same way for my freelance clients.',
      },
      {
        _type: 'stack', _key: 'stack', label: '03 · Stack', heading: { lead: 'Built on tools', muted: 'you already run' },
        groups: [
          { name: 'Frameworks', tools: ['Next.js', 'React', 'Astro'] },
          { name: 'Sites and e-commerce', tools: ['Webflow', 'Shopify'] },
          { name: 'Motion and 3D', tools: ['GSAP', 'three.js'] },
          { name: 'Automation', tools: ['Zapier', 'Make'] },
        ],
      },
      {
        _type: 'offers', _key: 'offers', label: '04 · Offers', anchor: 'offers',
        items: [
          { title: 'Sites and apps', meta: 'Webflow, Next.js or Astro · CMS and SEO', href: '/pricing' },
          { title: 'Landing page', meta: 'One page · from €1,200 excl. VAT', href: '/pricing' },
          { title: 'Support by the day', meta: 'For agencies and in-house teams · €350 excl. VAT a day', href: '/pricing' },
          { title: 'Monthly care', meta: 'Updates and backups · Small changes', href: '/pricing' },
        ],
        ctas: [{ label: 'Start a project', href: '/contact', variant: 'accent' }, { label: 'See pricing', href: '/pricing', variant: 'surface' }],
      },
      {
        _type: 'work', _key: 'work', label: '05 · Work', anchor: 'work', heading: { lead: 'Recent', muted: 'work' },
        items: [
          { title: 'Audion', meta: 'Webflow and three.js site · at Bruno · 2026', category: 'Webflow', href: '/work/audion' },
          { title: 'La Première Brique', meta: 'Webflow site connected through APIs · at Bruno · 2025', category: 'Webflow', href: '/work/la-premiere-brique' },
          { title: 'Zelder', meta: 'Next.js and Shopify e-commerce · build support · 2025', category: 'Next.js', href: 'https://zelder.fr/' },
        ],
      },
    ],
  },
];

const cases = caseStudies('en', [
  {
    title: 'Audion', slug: 'audion', category: 'Webflow', summary: 'Webflow and three.js site',
    heading: h('Audion,', 'giving sound', 'an identity'),
    lede: "Audion is a digital audio advertising platform: brands use it to run and manage campaigns across podcasts, streaming and digital radio. At Bruno, I built the website for its new identity.",
    meta: [{ label: 'Client', value: 'Audion' }, { label: 'Year', value: '2025–2026' }, { label: 'Role', value: 'Web development' }, { label: 'Stack', value: 'Webflow, three.js' }, { label: 'Agency', value: 'Bruno' }],
    chapters: [
      chapter('01 · Context', h('A market leader', 'nobody noticed'), "Despite leading its market, Audion's identity lacked presence and character. The Bruno team built a strong, distinctive identity rooted in a physical picture of sound."),
      chapter('02 · Build', h('From designs', 'to a live site'), "I built the site in Webflow from Yoann Verzeletti's designs, and used three.js for the 3D elements."),
      chapter('03 · Team', h('A team', 'effort'), 'Direction: Barthélémy and Léonard Chalvet. Creative direction: Pierre Jeannelle. Art direction and web design: Yoann Verzeletti. Copywriting: Victor Brami. Web development: Thomas Sanouiller. Motion design: Shayan Fabre. Project management: Grégoire Dehem. Photography: Théo Gomez.'),
    ],
    source: { label: 'The case study on bruno.co', href: 'https://www.bruno.co/audion' },
    media: {
      cover: { file: 'audion/cover.png', alt: "Audion's website, “The Performance Audio Platform”, on a monitor" },
      wide: { file: 'audion/wide.png', alt: 'Grid of Audion brand applications' },
      tall: { file: 'audion/tall.png', alt: 'The Audion app on a smartphone' },
    },
  },
  {
    title: 'La Première Brique', slug: 'la-premiere-brique', category: 'Webflow', summary: 'Webflow site connected through APIs',
    heading: h('La Première Brique,', 'a brand built', 'brick by brick'),
    lede: "La Première Brique lets anyone invest in real estate from €1. At Bruno, I built the site for its new identity with Alexis Prevost-Maynen, connected to the platform through webhooks.",
    meta: [{ label: 'Client', value: 'La Première Brique' }, { label: 'Year', value: '2025' }, { label: 'Role', value: 'Web development' }, { label: 'Stack', value: 'Webflow, GSAP, Zapier, Make' }, { label: 'Live', value: 'lapremierebrique.fr' }, { label: 'Agency', value: 'Bruno' }],
    chapters: [
      chapter('01 · Context', h('From community', 'to fintech'), 'Their first identity, community-driven and offbeat, did not match their ambition: to become a credible tech and finance player while staying close and easy to understand. Bruno led the full rebrand: branding, design, website, UX and UI.'),
      chapter('02 · Build', h('A site wired', 'to the platform'), "The site is built in Webflow and animated with GSAP. Forms and data go through webhooks set up in Zapier and Make, which connect it to La Première Brique's back end."),
      chapter('03 · Team', h('A team', 'effort'), 'Direction: Barthélémy Chalvet. Strategy: Camille Perez. Creative direction: Pierre Jeannelle. Art direction: Claudia Carvalho. Copywriting: Victor Brami. Web design: Claudia Carvalho and Tanguy Caruel. Web development: Thomas Sanouiller and Alexis Prevost-Maynen. 3D: Christophe Zidler. Motion design: Maël Masson. Illustration: Maëlle Dubois. Product design: Tony Lixivel. Project management: Grégoire Dehem.'),
    ],
    source: { label: 'The case study on bruno.co', href: 'https://www.bruno.co/la-premiere-brique' },
    media: {
      cover: { file: 'la-premiere-brique/cover.webp', alt: 'Billboard “L’investissement commence avec La Première Brique” at Gare du Nord' },
      wide: { file: 'la-premiere-brique/wide.png', alt: 'Screens from the La Première Brique app' },
      tall: { file: 'la-premiere-brique/tall.png', alt: 'The La Première Brique app on a smartphone' },
    },
  },
]);

const about: AboutPage = {
  label: 'About', heading: h('Thomas Sanouiller,', 'web developer', 'in Normandy'),
  lede: 'I have been building websites for three years, two of them at Bruno, a French branding agency working for international brands. I also take freelance projects, directly or as extra hands on a team.',
  facts: [{ label: 'Based in', value: 'Normandy' }, { label: 'Experience', value: '3 years' }, { label: 'Degree', value: 'RNCP level 6' }, { label: 'Languages', value: 'FR · EN' }],
  statementLabel: 'A line I keep in mind',
  statement: 'The great difficulty in education is to get experience out of ideas.',
  statementCite: 'George Santayana',
  timelineLabel: 'Timeline', timelineHeading: h('Three years,', 'two degrees'),
  timeline: [
    ['2024', 'Career change', "I switch careers and earn OpenClassrooms' web developer diploma (French level 5, two years of higher education).", ['HTML', 'CSS', 'JavaScript', 'React']],
    ['2024', 'Apprentice at Bruno', "I join Bruno, a branding agency, as an apprentice web developer. First Webflow sites for the agency's clients.", ['Webflow', 'GSAP']],
    ['2025', 'La Première Brique, Zelder', "A Webflow site connected to an investment platform through webhooks, then build support on Zelder's Next.js and Shopify store.", ['Webflow', 'Zapier', 'Make', 'Next.js', 'Shopify']],
    ['2026', 'RNCP level 6', 'JavaScript / React application developer degree (three to four years of higher education) with OpenClassrooms. Alongside it, the Audion site, with three.js.', ['React', 'three.js']],
    ['2026', 'Now', 'Developer at Bruno, and freelance as a sole trader: Webflow and Next.js sites, landing pages, support by the day.', ['Webflow', 'Next.js', 'Freelance']],
  ].map(([year, title, text, tags]) => ({ _key: key(), year: year as string, title: title as string, text: text as string, tags: tags as string[] })),
  principlesLabel: 'How I work',
  principles: [
    { _key: key(), title: 'True to the design', text: 'I build what the designer drew, down to the easing curve. If something will not work in code, I say so before I start.' },
    { _key: key(), title: 'Fast on mobile', text: 'I aim for 100 on Lighthouse and send you the report. This site scores 100 on all four.' },
    { _key: key(), title: 'Yours, all of it', text: 'The code, the accounts and the CMS are in your name. You could switch developers tomorrow.' },
  ],
  ctas: [{ label: 'Start a project', href: '/contact', variant: 'accent' }, { label: 'See pricing', href: '/pricing', variant: 'secondary' }],
  seo: { title: 'About · Thomas Sanouiller', description: 'Web developer in Normandy for three years, two of them at Bruno, a branding agency. Webflow, Next.js, React and three.js.' },
};

const contact: ContactPage = {
  label: 'Contact', heading: h('Tell me about', 'the site', 'you need'),
  lede: 'Five short questions. I read every brief myself and reply within 24 hours, with a first estimate or my questions.',
  types: ['Design', 'Development', 'Maintenance', 'Support by the day', 'Not sure yet'],
  budgets: ['Under €3k', '€3k to €6k', '€6k to €12k', '€12k and up'],
  timings: ['As soon as possible', 'In 1 to 2 months', 'In 3 months or more', 'No fixed date'],
  done: { title: 'Brief sent.', text: 'I will reply within 24 h.' },
  seo: { title: 'Contact · Thomas Sanouiller', description: 'Send a short brief for a website, a landing page or days of support. Reply within 24 hours.' },
};

const pricing: Pricing = {
  label: 'Pricing', heading: h('Prices,', 'in the open'),
  lede: 'Five starting points, then a simulator to price your own project. Every figure excludes VAT; the final quote follows a call.',
  points: [
    { _key: key(), label: 'Landing page', title: 'One page, live fast', from: 1200, items: ['Your design or mine', 'Webflow or Astro', 'Contact form and basic SEO'], sim: { type: 0 } },
    { _key: key(), label: 'Development', title: 'Built and launched', from: 2400, items: ['Next.js, Astro or Webflow', 'CMS and SEO setup', 'Training session'], sim: { type: 1 } },
    { _key: key(), label: 'Support', title: 'By the day', from: 350, per: ' / day', exact: true, items: ['Webflow build or Next.js front end', 'For an agency or an in-house team', 'Billed on days worked'] },
    { _key: key(), label: 'Design', title: 'Layouts and direction', from: 1800, items: ['Identity and page designs', 'Two rounds of changes', 'Figma file handed over'], sim: { opt: 0 } },
    { _key: key(), label: 'Maintenance', title: 'Monthly care', from: 90, per: ' / month', items: ['Updates and backups', 'Uptime monitoring', 'Small changes'], sim: { care: 1 } },
  ],
  start: 1,
  simLabel: 'Simulator', simHeading: h('Your project,', 'priced', 'live'), faqLabel: 'Questions',
  types: [
    { label: 'Landing page', note: 'A single page', base: 1200, pages: 1, weeks: 1.5 },
    { label: 'Showcase site', note: 'Up to 5 pages', base: 2400, pages: 5, weeks: 3 },
    { label: 'Site and CMS', note: 'Up to 8 pages, Sanity or Webflow CMS', base: 4800, pages: 8, weeks: 5 },
    { label: 'Web app', note: 'Accounts and a dashboard', base: 9000, pages: 10, weeks: 8 },
  ],
  pagePrice: 250, pageWeeks: 0.25, maxPages: 24,
  options: [
    { label: 'Design included', note: 'Layouts and direction', price: 1800, weeks: 1.5, on: true },
    { label: 'Second language', note: 'FR and EN', pct: 20, weeks: 0.5 },
    { label: 'Motion and 3D', note: 'GSAP reveals, a three.js scene', price: 1200, weeks: 1 },
    { label: 'SEO setup', note: 'Audit, structured data, redirects', price: 600, weeks: 0.5 },
    { label: 'Copywriting help', note: 'Structure and editing', price: 800, weeks: 1 },
  ],
  delivery: [{ label: 'Standard', pct: 0, factor: 1 }, { label: 'Express', note: '30% sooner', pct: 25, factor: 0.7 }],
  care: [{ label: 'None', month: 0 }, { label: 'Essential', note: 'Updates, backups', month: 90 }, { label: 'Full', note: 'Plus 2 h of changes', month: 190 }],
  deposit: 30,
  faq: [
    { question: 'What is included in the price?', answer: 'Design if selected, development, CMS setup, launch and a training session. Hosting and the domain are billed to you directly, at cost.' },
    { question: 'How does support by the day work?', answer: 'I join your project for a number of days we agree on: Webflow builds, React or Next.js front end, GSAP motion. €350 excl. VAT a day, billed on days worked.' },
    { question: 'How do payments work?', answer: '30% to book the dates, 40% when the designs are signed off, 30% at launch. Invoices in euros, excluding VAT.' },
    { question: 'Can I edit the site myself?', answer: 'Yes. Every site ships with a CMS, Webflow or Sanity, and a short video guide for your team.' },
    { question: 'What if the scope changes?', answer: 'The estimate is updated before any extra work starts. Nothing is billed without your written OK.' },
  ],
  seo: { title: 'Pricing · Thomas Sanouiller', description: 'Prices in the open: landing page, website, support at €350 a day, design and care, with a live simulator. Excl. VAT.' },
};

const notFound: NotFoundPage = {
  label: 'Error 404', heading: h('This page is', 'off the grid'), found: h('Back on', 'the grid'),
  lede: 'The link may be old, or the page has moved. The pixel went looking for it: drag it back to its corner.',
  links: [{ label: 'Home', href: '/' }, { label: 'Work', href: '/#work' }, { label: 'Pricing', href: '/pricing' }, { label: 'Contact', href: '/contact' }],
  seo: { title: 'Page not found · Thomas Sanouiller', description: 'This page does not exist or has moved.', noindex: true },
};

export const en: Content = { site, pages, cases, about, contact, pricing, notFound };
