import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

// One document each, opened directly from the sidebar (no "create new").
const SINGLETONS = new Map([['site', 'Site settings'], ['aboutPage', 'About'], ['contactPage', 'Contact'], ['pricing', 'Pricing'], ['notFound', '404']]);

export default defineConfig({
  name: 'default',
  title: 'Thomas Sanouiller',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'replace-me',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title('Content').items([
          ...[...SINGLETONS].map(([id, title]) => S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id))),
          S.divider(),
          ...S.documentTypeListItems().filter((i) => !SINGLETONS.has(i.getId() ?? '')),
        ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (t) => t.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
});
