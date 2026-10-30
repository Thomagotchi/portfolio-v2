// Per-language 404 on Vercel. The adapter ends its routes with one catch-all (/.* → /404.html, status 404),
// so /en/anything would get the French page. Runs after the adapter (adapters' hooks run first) and puts
// a catch-all per prefixed locale (^/en(/.*)?$ → its 404 page) just before it. Other hosts: the static
// file is there (dist/client/en/404.html); point the host's 404 rule for /en at it.
import { access, readFile, writeFile } from 'node:fs/promises';

export default function locale404(locales) {
  return {
    name: 'locale-404',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (!process.env.VERCEL) return; // the Vercel adapter only runs there (astro.config)
        const file = new URL('../.vercel/output/config.json', import.meta.url);
        const config = JSON.parse(await readFile(file, 'utf8').catch(() => 'null'));
        if (!config) return; // not a Vercel build
        const at = config.routes.findIndex((r) => ['/.*', '^/.*$'].includes(r.src) && r.dest === '/404.html');
        if (at === -1) return logger.warn('no 404 catch-all in the Vercel routes, left as is');
        // The build output (copied to .vercel/output/static) has en/404.html or en/404/index.html depending on
        // build.format; take whichever exists.
        const page = async (l) => {
          for (const f of [`/${l}/404.html`, `/${l}/404/index.html`]) {
            if (await access(new URL(`.${f}`, dir)).then(() => true, () => false)) return f;
          }
        };
        const add = [];
        for (const l of locales) {
          const dest = await page(l);
          if (!dest) logger.warn(`no 404 page for /${l}`);
          else if (!config.routes.some((x) => x.src === `^/${l}(?:/.*)?$`)) add.push({ src: `^/${l}(?:/.*)?$`, dest, status: 404 });
        }
        config.routes.splice(at, 0, ...add);
        await writeFile(file, JSON.stringify(config, null, 2));
        logger.info(`404 per language: ${locales.map((l) => `/${l}`).join(', ')}`);
      },
    },
  };
}
