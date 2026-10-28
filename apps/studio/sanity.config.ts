import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { LANGUAGES, schemaTypes } from './schemas';

// One folder per language. Singletons: one document per language, id `<type>-<lang>` (what the site
// fetches). Pages and case studies: the lists show and create documents of that language only.
const SINGLETONS = new Map([['site', 'Site settings'], ['aboutPage', 'About'], ['contactPage', 'Contact'], ['pricing', 'Pricing'], ['notFound', '404']]);
const LISTS = [['page', 'Pages'], ['caseStudy', 'Case studies']] as const;

export default defineConfig({
  name: 'default',
  title: 'Thomas Sanouiller',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'replace-me',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title('Content').items(LANGUAGES.map((l) =>
          S.listItem().title(l.title).id(l.id).child(S.list().title(l.title).items([
            ...[...SINGLETONS].map(([type, title]) => S.listItem().title(title).id(`${type}-${l.id}`)
              .child(S.document().schemaType(type).documentId(`${type}-${l.id}`).initialValueTemplate(`${type}-${l.id}`))),
            S.divider(),
            ...LISTS.map(([type, title]) => S.listItem().title(title).id(`${type}-${l.id}`)
              .child(S.documentList().title(`${title} · ${l.title}`).schemaType(type).filter('_type == $type && language == $lang').params({ type, lang: l.id })
                .initialValueTemplates([S.initialValueTemplateItem(`${type}-${l.id}`)]))),
          ])),
        )),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Only language templates: a new document always knows its language.
    templates: () => [...SINGLETONS.keys(), ...LISTS.map(([t]) => t)].flatMap((type) => LANGUAGES.map((l) => ({
      id: `${type}-${l.id}`, title: `${type} (${l.title})`, schemaType: type, value: { language: l.id },
    }))),
  },
});
