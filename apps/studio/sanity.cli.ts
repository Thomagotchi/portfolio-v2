import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineCliConfig } from 'sanity/cli';

// One .env at the repo root for the site and the Studio (gitignored): loaded for the CLI, envDir for the Studio bundle.
const root = fileURLToPath(new URL('../..', import.meta.url));
if (existsSync(`${root}.env`)) process.loadEnvFile(`${root}.env`);

export default defineCliConfig({
  api: { projectId: process.env.SANITY_STUDIO_PROJECT_ID, dataset: process.env.SANITY_STUDIO_DATASET || 'production' },
  vite: (config) => ({ ...config, envDir: root }),
  typegen: { path: '../web/src/**/*.{ts,astro}', generates: '../web/src/lib/sanity.types.ts' },
});
