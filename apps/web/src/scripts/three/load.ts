// Loads a 3D scene off the critical path: on idle, or when the host is within 200px of the viewport (lazy;
// a wider margin loads Three.js during the first load of short pages and costs TBT).
// Scenes share one Three.js chunk; each scene module is its own small chunk.
import type { TerrainOptions } from './terrain';
import type { ReliefOptions } from './relief';

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

export const mountRelief = (host: HTMLElement, opts: ReliefOptions & When = {}) =>
  mountScene(host, () => import('./relief').then((m) => m.relief(host, opts)), opts);
