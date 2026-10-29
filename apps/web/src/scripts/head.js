// Inlined in <head> (Base.astro), plain JS: runs before the first paint, unlike the deferred bundle.
// 1. .js flag. 2. window.__vt: resolves when the page transition is over and the document is parsed
// (main.ts waits for it before entry motion; CSS pauses animations under .vt meanwhile). Every navigation,
// language switch included, gets the same transition.
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  let done;
  let parsed;
  window.__vt = Promise.all([new Promise((r) => (done = r)), new Promise((r) => (parsed = r))]).then(() => {});
  addEventListener('DOMContentLoaded', parsed, { once: true });
  if (!('onpagereveal' in window)) done();
  addEventListener('pagereveal', (e) => {
    const vt = e.viewTransition;
    if (!vt) return done();
    vt.ready.catch(() => {}); // rejects when skipped
    root.classList.add('vt');
    vt.finished.finally(() => { root.classList.remove('vt'); done(); });
  }, { once: true });
})();
