// Loads a scene (3D, or the 2D code field) off the critical path: on idle, or when the host is within 200px of the viewport (lazy;
// a wider margin loads Three.js during the first load of short pages and costs TBT).
// Scenes share one Three.js chunk; each scene module is its own small chunk.
import type { CodeOptions } from '../codefield';
import type { TerrainOptions } from './terrain';

type When = { lazy?: boolean; delay?: number };

function mountScene(host: HTMLElement, load: () => Promise<unknown>, { lazy, delay = 0 }: When) {
  host.style.setProperty('--delay', `${delay / 1000}s`);
  const go = () => load().catch(() => {});
  if (lazy) {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); go(); } }, { rootMargin: '200px 0px' });
    io.observe(host);
  } else if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 2000 });
  else setTimeout(go, 200);
}

export const mountTerrain = (host: HTMLElement, opts: TerrainOptions & When) =>
  mountScene(host, () => import('./terrain').then((m) => m.terrain(host, opts)), opts);

export const mountCode = (host: HTMLElement, opts: CodeOptions & When) =>
  mountScene(host, () => import('../codefield').then((m) => m.codefield(host, opts)), opts);
