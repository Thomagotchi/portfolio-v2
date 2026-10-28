export const SITE = {
  name: 'Thomas Sanouiller',
  url: 'https://thomassanouiller.fr', // placeholder domain
  /** Fallback meta descriptions; pages set their own (Sanity seo). Locales: src/i18n. */
  description: {
    fr: 'Développeur web freelance en France. Je conçois, développe et maintiens des sites rapides, sous Next.js, Astro ou Webflow.',
    en: 'Freelance web developer in France. Design, development and maintenance of fast websites on Next.js, Astro and Webflow.',
  },
  /** 'dark' | 'light' | 'auto' (follows the OS). Themes come from the DA tokens. */
  theme: 'dark',
};

/** Lenis smooth scroll. false → Lenis is never loaded, native scroll. */
export const SMOOTH_SCROLL = true;

/** robots.txt: allow AI crawlers (GEO). Set false if the client opts out. */
export const ALLOW_AI_CRAWLERS = true;
