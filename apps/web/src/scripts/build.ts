// Hero build (home): the hero starts as its own skeleton. Once the window has opened, skeleton bars grow where
// each line of the hero sits (the main button in the accent), then each block's bars pull back behind an accent
// caret and leave the real text. Bars only: no outlines, no guides. The text is painted from the first frame,
// masked away (Hero.astro), so the LCP is the first paint; this script drives the mask (--rv on each block) and
// draws the skeleton on a canvas above. Without JS the mask opens on its own (CSS); under reduced motion there is
// no mask and no build. Resolves when the hero is built.

const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const ease = (k: number) => 1 - (1 - k) ** 3;
type Rect = { x: number; y: number; w: number; h: number };
type Item = { r: Rect; kind: 'text' | 'title' | 'accent' | 'button'; block: number };

export async function build(hero: HTMLElement): Promise<void> {
  const blocks = [...hero.querySelectorAll<HTMLElement>('.hero__content > .rise')];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !blocks.length) return;
  // Too late (the script came after the CSS fallback started lifting the covers): leave it to CSS.
  const fallback = hero.getAnimations({ subtree: true }).find((a) => (a as CSSAnimation).animationName === 'unveil');
  if (fallback && Number(fallback.currentTime) > Number(fallback.effect?.getTiming().delay ?? 0)) return;
  hero.classList.add('is-building'); // the CSS fallback stands down, --rv is ours
  blocks.forEach((b) => b.style.setProperty('--rv', '0'));
  // Start when the window has opened (its keyframes pause during a page transition, so this follows them).
  const open = hero.querySelector('.win__frame')?.getAnimations().find((a) => (a as CSSAnimation).animationName === 'win-open');
  await Promise.all([open?.finished.catch(() => {}), document.fonts.ready]);

  const hb = hero.getBoundingClientRect();
  const rel = (r: DOMRect): Rect => ({ x: r.left - hb.left, y: r.top - hb.top, w: r.width, h: r.height });
  // One rect per line of text (Ranges: the text's own extent, not its box).
  const linesOf = (el: Element) => {
    const rg = document.createRange(); rg.selectNodeContents(el);
    const out: Rect[] = [];
    for (const r of [...rg.getClientRects()].filter((r) => r.width).map(rel)) {
      const o = out.find((q) => Math.abs(q.y - r.y) < 4);
      if (o) { const x2 = Math.max(o.x + o.w, r.x + r.w); o.x = Math.min(o.x, r.x); o.w = x2 - o.x; } else out.push(r);
    }
    return out;
  };
  const items: Item[] = [];
  const boxes = blocks.map((b, i) => {
    const el = b.firstElementChild!;
    const ctas = el.querySelectorAll('.cta');
    if (ctas.length) ctas.forEach((c) => items.push({ r: rel(c.getBoundingClientRect()), kind: c.matches('.cta--accent') ? 'accent' : 'button', block: i }));
    else linesOf(el).forEach((r) => items.push({ r, kind: /^H\d$/.test(el.tagName) ? 'title' : 'text', block: i }));
    return rel(el.getBoundingClientRect()); // the text's box (the block less its 12px padding)
  });

  const css = getComputedStyle(hero);
  const C = { text: css.getPropertyValue('--text').trim(), accent: css.getPropertyValue('--accent').trim() };
  const cv = document.createElement('canvas');
  cv.className = 'hero__build';
  cv.setAttribute('aria-hidden', 'true');
  hero.append(cv);
  const dpr = Math.min(devicePixelRatio, 2), W = hb.width, H = hb.height;
  cv.width = W * dpr; cv.height = H * dpr;
  const x = cv.getContext('2d')!;
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const at = (j: number) => 0.55 + j * 0.14; // when block j starts to reveal
  const end = at(blocks.length - 1) + 0.4;

  const frame = (t: number) => {
    x.clearRect(0, 0, W, H);
    const rv = blocks.map((_, j) => ease(seg(t, at(j), at(j) + 0.4)));
    blocks.forEach((b, j) => b.style.setProperty('--rv', rv[j].toFixed(4)));
    items.forEach((o, i) => {
      const s = i * 0.05, f = ease(seg(t, s, s + 0.35)), r = o.r, v = rv[o.block];
      const X = boxes[o.block].x - 12 + v * (boxes[o.block].w + 24); // the mask's edge (it spans the block, 12px padding included)
      const x1 = Math.max(X, r.x), x2 = r.x + r.w * f;
      if (o.kind === 'accent') { if (x2 > x1) { x.fillStyle = C.accent; x.fillRect(x1, r.y, x2 - x1, r.h); } }
      else if (o.kind === 'button') { const bx = Math.max(x1, r.x + 18), bw = r.x + 18 + (r.w - 36) * f - bx; if (bw > 0) { x.globalAlpha = 0.4; x.fillStyle = C.text; x.fillRect(bx, r.y + r.h / 2 - 3, bw, 6); x.globalAlpha = 1; } }
      else {
        const bh = r.h * (o.kind === 'title' ? 0.62 : 0.5);
        if (x2 > x1) { x.globalAlpha = o.kind === 'title' ? 0.75 : 0.3; x.fillStyle = C.text; x.fillRect(x1, r.y + (r.h - bh) / 2, x2 - x1, bh); x.globalAlpha = 1; }
        if (v > 0 && v < 1 && X >= r.x && X <= r.x + r.w) { x.fillStyle = C.accent; x.fillRect(X, r.y + r.h * 0.12, 2, r.h * 0.76); }
      }
    });
  };

  await new Promise<void>((done) => {
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      frame(t);
      if (t < end) requestAnimationFrame(loop);
      else { cv.remove(); blocks.forEach((b) => b.style.setProperty('--rv', '1')); done(); }
    };
    requestAnimationFrame(loop);
  });
}
