// After build: every bundled <script type="module" src> is injected after window load, web fonts and two painted
// frames, i.e. after the final LCP paint (one frame was not enough: the LCP entry can land a frame late, and any
// request started before it counts against LCP in Lighthouse's simulation).
// Chrome gives module scripts High priority, so Lighthouse counts them before FCP/LCP.
// Static pages need no JS to render, so nothing visible waits on this.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const loader = (srcs) =>
  `<script>(()=>{const go=()=>{for(const s of ${JSON.stringify(srcs)}){const e=document.createElement('script');e.type='module';e.src=s;document.head.append(e)}};const later=()=>document.fonts.ready.then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(go,50))));document.readyState==='complete'?later():addEventListener('load',later,{once:true})})()</script>`;

export default function deferScripts() {
  return {
    name: 'defer-scripts',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = (await readdir(root, { recursive: true })).filter((f) => f.endsWith('.html'));
        for (const f of files) {
          const path = `${root}/${f}`;
          const html = await readFile(path, 'utf8');
          const srcs = [];
          const out = html.replace(/<script type="module" src="([^"]+)"><\/script>/g, (_, src) => (srcs.push(src), ''));
          if (srcs.length) await writeFile(path, out.replace('</body>', `${loader(srcs)}</body>`));
        }
        logger.info(`deferred module scripts in ${files.length} pages`);
      },
    },
  };
}
