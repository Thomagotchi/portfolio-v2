// Inlined in <head> (Base.astro), plain JS: runs before the first paint, unlike the deferred bundle.
// 1. .js flag.
// 2. Page curtain (styles: .pt in global.scss). An internal link wipes the curtain up over the page (under the
//    header), then navigates; the next page paints under the raised curtain (a sessionStorage flag) and, once its
//    document is parsed, the curtain lifts away as its entry motion starts. Plain JS in any browser (no View
//    Transitions API), so it behaves the same everywhere. A first visit (Lighthouse, a shared link) has no flag,
//    so no curtain. Reduced motion: plain navigations.
// 3. window.__vt resolves when the curtain starts lifting (at once without one); main.ts waits for it before
//    entry motion, and CSS pauses animations under .vt until then.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let covered = false;
  try { covered = !rm && sessionStorage.getItem('pt') === '1'; sessionStorage.removeItem('pt'); } catch { /* storage blocked */ }
  let go;
  window.__vt = new Promise((r) => (go = r));
  if (covered) root.classList.add('pt-in', 'vt');
  const lift = () => {
    if (!covered) return go();
    requestAnimationFrame(() => {
      root.classList.remove('vt');
      root.classList.add('pt-lift');
      setTimeout(() => root.classList.remove('pt-in', 'pt-lift'), 550);
      go();
    });
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', lift, { once: true });
  else lift();
  // Back/forward cache: a page left under the raised curtain comes back uncovered.
  addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('pt-out', 'pt-in', 'pt-lift', 'vt'); });
  if (rm) return;
  addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return; // other sites, anchors
    e.preventDefault();
    root.classList.add('pt-out');
    setTimeout(() => {
      try { sessionStorage.setItem('pt', '1'); } catch { /* storage blocked: the next page simply has no curtain */ }
      location.href = url.href;
    }, 360);
  });
})();
