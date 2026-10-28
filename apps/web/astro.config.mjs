import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import deferScripts from './integrations/defer-scripts.mjs';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/config.ts';
import { families } from './src/lib/fonts.ts';

// Fonts come from the DA tokens: one Fontsource family → --font-<first role> (shared roles alias it, see lib/fonts.ts).
// A weight range pulls the variable file: one request per family instead of one per weight.
const fonts = families.map((f) => ({
  provider: fontProviders.fontsource(),
  name: f.family,
  cssVariable: `--font-${f.role}`,
  weights: [new Set(f.weights).size > 1 ? `${Math.min(...f.weights)} ${Math.max(...f.weights)}` : f.weights[0]],
  styles: ['normal'],
  subsets: ['latin'],
  formats: ['woff2'],
  fallbacks: [f.role === 'mono' ? 'monospace' : f.role === 'tag' ? 'serif' : 'sans-serif'],
}));

// Static pages; only the contact action runs on the server. On Vercel (VERCEL=1 at build) the Vercel adapter
// turns it into a function; everywhere else the node standalone server (local preview, CI gates on dist/client).
export default defineConfig({
  site: SITE.url,
  output: 'static',
  adapter: process.env.VERCEL ? vercel() : node({ mode: 'standalone' }),
  // Contact action (src/actions). All optional: without the key the action logs the brief (dry run).
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap(), deferScripts()],
  fonts,
  image: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] },
  vite: {
    // The terrain chunk is Three.js core (~130 KB gz, budget 150): loaded on idle, never on the critical path.
    build: { chunkSizeWarningLimit: 600 },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [fileURLToPath(new URL('./src/styles', import.meta.url))],
          additionalData: '@use "tools" as *;\n',
        },
      },
    },
  },
});
