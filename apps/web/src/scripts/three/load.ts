// Loads the terrain chunk off the critical path: on idle, or when the host is within 200px of the viewport (lazy;
// a wider margin loads Three.js during the first load of short pages and costs TBT).
// One Three.js chunk serves every terrain on the page.
import type { TerrainOptions } from './terrain';

export function mountTerrain(host: HTMLElement, opts: TerrainOptions & { lazy?: boolean; delay?: number }) {
  host.style.setProperty('--delay', `${(opts.delay ?? 0) / 1000}s`);
  const load = () => import('./terrain').then((m) => m.terrain(host, opts)).catch(() => {});
  if (opts.lazy) {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '200px 0px' });
    io.observe(host);
  } else if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 2000 });
  else setTimeout(load, 200);
}
