import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: { projectId: process.env.SANITY_STUDIO_PROJECT_ID, dataset: process.env.SANITY_STUDIO_DATASET || 'production' },
  typegen: { path: '../web/src/**/*.{ts,astro}', generates: '../web/src/lib/sanity.types.ts' },
});
