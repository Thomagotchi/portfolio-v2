// Contenu français (langue par défaut), en attendant Sanity (scripts/seed.mjs l'importe en language "fr").
// Faits fournis par Thomas uniquement (skill web-copy). Études de cas : textes et images de Bruno, avec leur
// accord, à condition de lier chaque étude à celle de l'agence (`source`). Liens en chemins canoniques
// (/pricing, /work/x) : i18n/localize les traduit (/tarifs, /projets/x).
import type { AboutPage, ContactPage, NotFoundPage, Page, Pricing, Site } from '../types';
import { caseStudies, chapter, h, key } from './build.ts';
import type { Content } from './index.ts';

const site: Site = {
  name: 'Thomas Sanouiller',
  role: 'Développeur web freelance · Normandie',
  description: 'Développeur web freelance en Normandie. Sites Webflow et Next.js, landing pages et renfort à la journée, pour les marques et les agences.',
  nav: [
    { label: 'Projets', href: '/#work', panel: [
      { eyebrow: '01 · Webflow', title: 'Audion', text: 'Webflow et three.js', href: '/work/audion' },
      { eyebrow: '02 · Webflow', title: 'La Première Brique', text: 'Webflow et API', href: '/work/la-premiere-brique' },
      { eyebrow: '03 · Next.js', title: 'Zelder', text: 'E-commerce Shopify', href: 'https://zelder.fr/' },
      { eyebrow: 'Archive', title: 'Tous les projets', text: 'La liste complète', href: '/#work' },
    ] },
    { label: 'Offres', href: '/#offers', panel: [
      { eyebrow: '01 · Développement', title: 'Sites et applications', text: 'Webflow, Next.js ou Astro', href: '/pricing' },
      { eyebrow: '02 · Landing page', title: 'Une page, vite en ligne', text: 'Dès 1 200 € HT', href: '/pricing' },
      { eyebrow: '03 · Renfort', title: 'À la journée', text: '350 € HT / jour', href: '/pricing' },
      { eyebrow: 'Tarifs', title: 'Tous les prix', text: 'Et le simulateur', href: '/pricing' },
    ] },
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/thomas-sanouiller/' },
    { label: 'GitHub', href: 'https://github.com/Thomagotchi' },
  ],
  contact: { email: 'thomassanouiller.contact@gmail.com', tz: 'Europe/Paris', place: 'Normandie', status: 'Disponible', reply: 'Sous 24 h', lighthouse: '100 · 100 · 100 · 100' },
  footerLabel: 'Écrire à',
};

const pages: Page[] = [
  {
    title: 'Accueil',
    slug: 'index',
    seo: { title: 'Thomas Sanouiller · Développeur web freelance en Normandie', description: site.description },
    blocks: [
      {
        _type: 'hero', _key: 'hero', label: 'Freelance · Normandie', scene: true,
        heading: { lead: 'Thomas Sanouiller,', muted: 'développeur web', tail: 'pour les marques et les agences' },
        text: 'Je transforme des maquettes exigeantes en sites Webflow ou Next.js, animations et 3D comprises.',
        ctas: [{ label: 'Lancer un projet', href: '/contact', variant: 'primary' }, { label: 'Voir les projets', href: '#work', variant: 'secondary' }],
      },
      {
        _type: 'kpi', _key: 'kpi', label: '02 · En chiffres', heading: { lead: 'Le parcours,', muted: 'en chiffres' },
        stats: [{ value: '3', label: 'ans de développement web' }, { value: '2', label: 'ans en agence de branding' }, { value: '24 h', label: 'pour vous répondre' }],
      },
      { _type: 'builtWith', _key: 'built', label: 'Outils', items: ['Webflow', 'Next.js', 'React', 'three.js', 'GSAP'] },
      {
        _type: 'statement', _key: 'practice', label: '01 · Pratique', anchor: 'practice',
        text: "Chez Bruno, je développe les sites de marques comme Audion ou La Première Brique. Les designers y soignent chaque détail ; mon travail, c'est que ce détail arrive en ligne tel quel, sur tous les écrans. Je fais pareil pour mes clients en freelance.",
      },
      {
        _type: 'stack', _key: 'stack', label: '03 · Stack', heading: { lead: 'Des outils', muted: 'que vous utilisez déjà' },
        groups: [
          { name: 'Frameworks', tools: ['Next.js', 'React', 'Astro'] },
          { name: 'Sites et e-commerce', tools: ['Webflow', 'Shopify'] },
          { name: 'Animation et 3D', tools: ['GSAP', 'three.js'] },
          { name: 'Automatisation', tools: ['Zapier', 'Make'] },
        ],
      },
      {
        _type: 'offers', _key: 'offers', label: '04 · Offres', anchor: 'offers',
        items: [
          { title: 'Sites et applications', meta: 'Webflow, Next.js ou Astro · CMS et SEO', href: '/pricing' },
          { title: 'Landing page', meta: 'Une page · dès 1 200 € HT', href: '/pricing' },
          { title: 'Renfort à la journée', meta: 'Pour les agences et les équipes · 350 € HT / jour', href: '/pricing' },
          { title: 'Suivi mensuel', meta: 'Mises à jour et sauvegardes · Retouches', href: '/pricing' },
        ],
        ctas: [{ label: 'Lancer un projet', href: '/contact', variant: 'accent' }, { label: 'Voir les tarifs', href: '/pricing', variant: 'surface' }],
      },
      {
        _type: 'work', _key: 'work', label: '05 · Projets', anchor: 'work', heading: { lead: 'Projets', muted: 'récents' },
        items: [
          { title: 'Audion', meta: 'Site Webflow et three.js · chez Bruno · 2026', category: 'Webflow', href: '/work/audion' },
          { title: 'La Première Brique', meta: 'Site Webflow relié par API · chez Bruno · 2025', category: 'Webflow', href: '/work/la-premiere-brique' },
          { title: 'Zelder', meta: 'E-commerce Next.js et Shopify · renfort intégration · 2025', category: 'Next.js', href: 'https://zelder.fr/' },
        ],
      },
    ],
  },
];

const cases = caseStudies('fr', [
  {
    title: 'Audion', slug: 'audion', category: 'Webflow', summary: 'Site Webflow et three.js',
    heading: h('Audion,', 'donner une identité', 'au son'),
    lede: "Audion est une plateforme de publicité audio digitale : les marques y diffusent et pilotent leurs campagnes sur les podcasts, le streaming et la radio digitale. Chez Bruno, j'ai développé le site de sa nouvelle identité.",
    meta: [{ label: 'Client', value: 'Audion' }, { label: 'Année', value: '2025–2026' }, { label: 'Rôle', value: 'Développement web' }, { label: 'Stack', value: 'Webflow, three.js' }, { label: 'Agence', value: 'Bruno' }],
    chapters: [
      chapter('01 · Contexte', h('Un leader,', 'sans présence'), "Malgré sa position de leader, l'identité d'Audion manquait de présence et de singularité. L'équipe de Bruno a construit une identité forte et distinctive, ancrée dans une représentation physique du son."),
      chapter('02 · Développement', h('Des maquettes', 'au site en ligne'), "J'ai intégré le site dans Webflow à partir des maquettes de Yoann Verzeletti, et utilisé three.js pour les éléments en 3D."),
      chapter('03 · Équipe', h('Un projet', "d'équipe"), 'Direction : Barthélémy et Léonard Chalvet. Direction de création : Pierre Jeannelle. Direction artistique et web design : Yoann Verzeletti. Conception-rédaction : Victor Brami. Développement web : Thomas Sanouiller. Motion design : Shayan Fabre. Gestion de projet : Grégoire Dehem. Photo : Théo Gomez.'),
    ],
    source: { label: "L'étude de cas sur bruno.co", href: 'https://www.bruno.co/audion' },
    media: {
      cover: { file: 'audion/cover.png', alt: "Le site d'Audion, « The Performance Audio Platform », affiché sur un écran" },
      wide: { file: 'audion/wide.png', alt: 'Mosaïque des déclinaisons de la marque Audion' },
      tall: { file: 'audion/tall.png', alt: "L'application Audion sur smartphone" },
    },
  },
  {
    title: 'La Première Brique', slug: 'la-premiere-brique', category: 'Webflow', summary: 'Site Webflow relié par API',
    heading: h('La Première Brique,', 'une marque construite', 'brique par brique'),
    lede: "La Première Brique rend l'investissement immobilier accessible à tous, dès 1 €. Chez Bruno, j'ai développé avec Alexis Prevost-Maynen le site de sa nouvelle identité, relié à la plateforme par webhooks.",
    meta: [{ label: 'Client', value: 'La Première Brique' }, { label: 'Année', value: '2025' }, { label: 'Rôle', value: 'Développement web' }, { label: 'Stack', value: 'Webflow, GSAP, Zapier, Make' }, { label: 'En ligne', value: 'lapremierebrique.fr' }, { label: 'Agence', value: 'Bruno' }],
    chapters: [
      chapter('01 · Contexte', h('Du communautaire', 'à la fintech'), "Leur première identité, très communautaire et décalée, ne reflétait pas leur ambition : devenir un acteur crédible de la tech et de la finance, en restant proche et pédagogique. Bruno a mené la refonte complète : branding, design, site, UX et UI."),
      chapter('02 · Développement', h('Un site', 'relié à la plateforme'), 'Le site est intégré dans Webflow et animé avec GSAP. Les formulaires et les données passent par des webhooks montés avec Zapier et Make, qui font le lien avec le back-end de La Première Brique.'),
      chapter('03 · Équipe', h('Un projet', "d'équipe"), 'Direction : Barthélémy Chalvet. Planning stratégique : Camille Perez. Direction de création : Pierre Jeannelle. Direction artistique : Claudia Carvalho. Conception-rédaction : Victor Brami. Web design : Claudia Carvalho et Tanguy Caruel. Développement web : Thomas Sanouiller et Alexis Prevost-Maynen. 3D : Christophe Zidler. Motion design : Maël Masson. Illustration : Maëlle Dubois. Product design : Tony Lixivel. Gestion de projet : Grégoire Dehem.'),
    ],
    source: { label: "L'étude de cas sur bruno.co", href: 'https://www.bruno.co/la-premiere-brique' },
    media: {
      cover: { file: 'la-premiere-brique/cover.webp', alt: "Affiche « L'investissement commence avec La Première Brique » à la gare du Nord" },
      wide: { file: 'la-premiere-brique/wide.png', alt: "Écrans de l'application La Première Brique" },
      tall: { file: 'la-premiere-brique/tall.png', alt: "L'application La Première Brique sur smartphone" },
    },
  },
]);

const about: AboutPage = {
  label: 'À propos', heading: h('Thomas Sanouiller,', 'développeur web', 'en Normandie'),
  lede: "Je développe des sites depuis trois ans, dont deux chez Bruno, une agence de branding française qui travaille pour des marques internationales. Je prends aussi des projets en freelance, en direct ou en renfort d'équipe.",
  facts: [{ label: 'Basé en', value: 'Normandie' }, { label: 'Expérience', value: '3 ans' }, { label: 'Diplôme', value: 'RNCP niveau 6' }, { label: 'Langues', value: 'FR · EN' }],
  statementLabel: 'Une phrase que je garde',
  statement: "La plus grande difficulté de l'éducation, c'est de transformer les idées en expérience.",
  statementCite: 'George Santayana',
  timelineLabel: 'Parcours', timelineHeading: h('Trois ans,', 'deux diplômes'),
  timeline: [
    ['2024', 'Reconversion', "Je change de voie et j'obtiens le diplôme de développeur web d'OpenClassrooms (niveau 5, bac +2).", ['HTML', 'CSS', 'JavaScript', 'React']],
    ['2024', 'Alternance chez Bruno', "J'entre chez Bruno, agence de branding, comme développeur web en alternance. Premiers sites Webflow pour les clients de l'agence.", ['Webflow', 'GSAP']],
    ['2025', 'La Première Brique, Zelder', "Un site Webflow relié à une plateforme d'investissement par webhooks, puis un renfort sur l'e-commerce Next.js et Shopify de Zelder.", ['Webflow', 'Zapier', 'Make', 'Next.js', 'Shopify']],
    ['2026', 'Titre RNCP niveau 6', "Diplôme de développeur d'application JavaScript / React (bac +3/4) avec OpenClassrooms. En parallèle, le site d'Audion, avec three.js.", ['React', 'three.js']],
    ['2026', "Aujourd'hui", 'Développeur chez Bruno, et freelance en entreprise individuelle : sites Webflow et Next.js, landing pages, renfort à la journée.', ['Webflow', 'Next.js', 'Freelance']],
  ].map(([year, title, text, tags]) => ({ _key: key(), year: year as string, title: title as string, text: text as string, tags: tags as string[] })),
  principlesLabel: 'Ma façon de travailler',
  principles: [
    { _key: key(), title: 'Fidèle à la maquette', text: "Je développe ce que le designer a dessiné, jusqu'à la courbe d'animation. Si quelque chose ne passe pas en code, je le dis avant de commencer." },
    { _key: key(), title: 'Rapide sur mobile', text: 'Je vise 100 sur Lighthouse et je vous envoie le rapport. Ce site obtient 100 sur ses quatre scores.' },
    { _key: key(), title: 'Tout est à vous', text: 'Le code, les comptes et le CMS sont à votre nom. Vous pouvez changer de développeur demain.' },
  ],
  ctas: [{ label: 'Lancer un projet', href: '/contact', variant: 'accent' }, { label: 'Voir les tarifs', href: '/pricing', variant: 'secondary' }],
  seo: { title: 'À propos · Thomas Sanouiller', description: 'Développeur web en Normandie depuis trois ans, dont deux chez Bruno, agence de branding. Webflow, Next.js, React et three.js.' },
};

const contact: ContactPage = {
  label: 'Contact', heading: h('Parlez-moi', 'du site', 'dont vous avez besoin'),
  lede: 'Cinq questions courtes. Je lis chaque brief moi-même et je réponds sous 24 heures, avec une première estimation ou mes questions.',
  types: ['Design', 'Développement', 'Maintenance', 'Renfort à la journée', 'Je ne sais pas encore'],
  budgets: ['Moins de 3 k€', '3 à 6 k€', '6 à 12 k€', '12 k€ et plus'],
  timings: ['Dès que possible', 'Dans 1 à 2 mois', 'Dans 3 mois ou plus', 'Pas de date fixe'],
  done: { title: 'Brief envoyé.', text: 'Je vous réponds sous 24 h.' },
  seo: { title: 'Contact · Thomas Sanouiller', description: 'Envoyez un brief court pour votre site, une landing page ou des jours de renfort. Réponse sous 24 heures.' },
};

const pricing: Pricing = {
  label: 'Tarifs', heading: h('Les prix,', 'affichés'),
  lede: 'Cinq points de départ, puis un simulateur pour estimer votre projet. Les montants sont hors taxes ; le devis final suit un appel.',
  points: [
    { _key: key(), label: 'Landing page', title: 'Une page, vite en ligne', from: 1200, items: ['Sur votre design ou sur le mien', 'Webflow ou Astro', 'Formulaire et SEO de base'], sim: { type: 0 } },
    { _key: key(), label: 'Développement', title: 'Développé et mis en ligne', from: 2400, items: ['Next.js, Astro ou Webflow', 'CMS et SEO configurés', 'Une séance de formation'], sim: { type: 1 } },
    { _key: key(), label: 'Renfort', title: 'À la journée', from: 350, per: ' / jour', exact: true, items: ['Intégration Webflow ou front Next.js', 'Pour une agence ou une équipe en place', 'Facturé aux jours travaillés'] },
    { _key: key(), label: 'Design', title: 'Maquettes et direction', from: 1800, items: ['Identité et maquettes de pages', 'Deux allers-retours de corrections', 'Fichier Figma remis'], sim: { opt: 0 } },
    { _key: key(), label: 'Maintenance', title: 'Suivi mensuel', from: 90, per: ' / mois', items: ['Mises à jour et sauvegardes', 'Surveillance de disponibilité', 'Petites modifications'], sim: { care: 1 } },
  ],
  start: 1,
  simLabel: 'Simulateur', simHeading: h('Votre projet,', 'chiffré', 'en direct'), faqLabel: 'Questions',
  types: [
    { label: 'Landing page', note: 'Une seule page', base: 1200, pages: 1, weeks: 1.5 },
    { label: 'Site vitrine', note: "Jusqu'à 5 pages", base: 2400, pages: 5, weeks: 3 },
    { label: 'Site et CMS', note: "Jusqu'à 8 pages, CMS Sanity ou Webflow", base: 4800, pages: 8, weeks: 5 },
    { label: 'Application web', note: 'Comptes et tableau de bord', base: 9000, pages: 10, weeks: 8 },
  ],
  pagePrice: 250, pageWeeks: 0.25, maxPages: 24,
  options: [
    { label: 'Design inclus', note: 'Maquettes et direction', price: 1800, weeks: 1.5, on: true },
    { label: 'Deuxième langue', note: 'FR et EN', pct: 20, weeks: 0.5 },
    { label: 'Animation et 3D', note: 'Apparitions GSAP, une scène three.js', price: 1200, weeks: 1 },
    { label: 'SEO', note: 'Audit, données structurées, redirections', price: 600, weeks: 0.5 },
    { label: 'Aide à la rédaction', note: 'Structure et relecture', price: 800, weeks: 1 },
  ],
  delivery: [{ label: 'Standard', pct: 0, factor: 1 }, { label: 'Express', note: '30 % plus tôt', pct: 25, factor: 0.7 }],
  care: [{ label: 'Aucun', month: 0 }, { label: 'Essentiel', note: 'Mises à jour, sauvegardes', month: 90 }, { label: 'Complet', note: 'Plus 2 h de modifications', month: 190 }],
  deposit: 30,
  faq: [
    { question: "Qu'est-ce qui est compris dans le prix ?", answer: "Le design s'il est choisi, le développement, la configuration du CMS, la mise en ligne et une séance de formation. L'hébergement et le nom de domaine vous sont facturés directement, au prix coûtant." },
    { question: 'Comment fonctionne le renfort à la journée ?', answer: "Je rejoins votre projet pour un nombre de jours fixé ensemble : intégration Webflow, front-end React ou Next.js, animations GSAP. 350 € HT la journée, facturée aux jours travaillés." },
    { question: 'Comment se passe le paiement ?', answer: '30 % pour réserver les dates, 40 % à la validation des maquettes, 30 % à la mise en ligne. Factures en euros, hors taxes.' },
    { question: 'Est-ce que je pourrai modifier le site moi-même ?', answer: 'Oui. Chaque site est livré avec un CMS, Webflow ou Sanity, et un court guide vidéo pour votre équipe.' },
    { question: 'Et si le périmètre change en cours de route ?', answer: "L'estimation est mise à jour avant tout travail supplémentaire. Rien n'est facturé sans votre accord écrit." },
  ],
  seo: { title: 'Tarifs · Thomas Sanouiller', description: 'Prix affichés : landing page, site, renfort à 350 € HT la journée, design et suivi, avec un simulateur en direct.' },
};

const notFound: NotFoundPage = {
  label: 'Erreur 404', heading: h('Cette page est', 'sortie de la grille'), found: h('De retour', 'sur la grille'),
  lede: "Le lien est peut-être ancien, ou la page a changé d'adresse. Le pixel est parti la chercher : ramenez-le dans son coin.",
  links: [{ label: 'Accueil', href: '/' }, { label: 'Projets', href: '/#work' }, { label: 'Tarifs', href: '/pricing' }, { label: 'Contact', href: '/contact' }],
  seo: { title: 'Page introuvable · Thomas Sanouiller', description: "Cette page n'existe pas ou a changé d'adresse.", noindex: true },
};

export const fr: Content = { site, pages, cases, about, contact, pricing, notFound };
