import page from './documents/page';
import site from './documents/site';
import caseStudy from './pages/caseStudy';
import aboutPage from './pages/aboutPage';
import contactPage from './pages/contactPage';
import pricing from './pages/pricing';
import notFound from './pages/notFound';
import seo from './objects/seo';
import link from './objects/link';
import cta from './objects/cta';
import headline from './objects/headline';
import figure from './objects/figure';
import { blocks } from './blocks';

import { defineField } from 'sanity';

/** fr | en. Set by the Studio structure (one folder per language), never typed by hand. */
export const LANGUAGES = [{ id: 'fr', title: 'Français' }, { id: 'en', title: 'English' }] as const;
const language = defineField({ name: 'language', type: 'string', readOnly: true, hidden: ({ value }) => !!value, options: { list: LANGUAGES.map((l) => ({ value: l.id, title: l.title })) } });

// Every document carries its language (document-level translation: one document per language).
const documents = [page, site, caseStudy, aboutPage, contactPage, pricing, notFound].map((t) => ({ ...t, fields: [language, ...t.fields] }));

export const schemaTypes = [...documents, seo, link, cta, headline, figure, ...blocks];
