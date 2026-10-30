import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import deferScripts from './integrations/defer-scripts.mjs';
import locale404 from './integrations/locale-404.mjs';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/config.ts';
import { families } from './src/lib/fonts.ts';
import { alternates, canonicalOf, TAG } from './src/i18n/index.ts';

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

// Sitemap alternates from the i18n URL map (the plugin's own i18n option pairs same-slug URLs only).
const hreflang = (item) => {
  const { pathname, origin } = new URL(item.url);
  const alt = alternates(canonicalOf(pathname));
  return { ...item, links: Object.entries(alt).map(([lang, path]) => ({ lang: TAG[lang], url: new URL(path, origin).href })) };
};

// Static pages; only the contact action runs on the server. On Vercel (VERCEL=1 at build) the Vercel adapter
// turns it into a function; everywhere else the node standalone server (local preview, CI gates on dist/client).
export default defineConfig({
  site: SITE.url,
  output: 'static',
  adapter: process.env.VERCEL ? vercel() : node({ mode: 'standalone' }),
  trailingSlash: 'never',
  // French at the root (French slugs: /a-propos, /tarifs, /projets/x), English under /en. Gives
  // Astro.currentLocale to every component; URL mapping and UI strings live in src/i18n.
  i18n: { locales: ['fr', 'en'], defaultLocale: 'fr', routing: { prefixDefaultLocale: false } },
  // preserve: index routes → dir/index.html (so /en and /en/… coexist), every other page → name.html.
  build: { format: 'preserve', inlineStylesheets: 'always' },
  integrations: [sitemap({ serialize: hreflang, filter: (page) => !/\/404\/?$/.test(page) }), deferScripts(), locale404(['en'])],
  fonts,
  image: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] },
  vite: {
    // One .env at the repo root for the site and the Studio (gitignored).
    envDir: fileURLToPath(new URL('../..', import.meta.url)),
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
