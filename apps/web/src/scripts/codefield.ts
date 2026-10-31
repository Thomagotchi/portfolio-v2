// Code field (home hero): the hero's own source (Hero.astro, read at build), straight, scrolling down, fading to
// black towards the top. "side": a column beside the text; "full": the whole hero, fainter, dimmed behind the text. The pointer is a reading light: tokens near it sharpen,
// keywords under it turn accent, its line highlights, a caret blinks, and a known token shows its type like an
// editor tooltip (fine pointers only). Without a pointer, a ghost wanders so the field is never still.
// Canvas 2D: the faint text is drawn once into a sheet and blitted each frame; only tokens near the pointer are
// drawn live. Paused off screen and in hidden tabs, one still frame under reduced motion.
import source from '@/components/sections/Hero.astro?raw';

export type CodeOptions = {
  /** Element that receives pointer moves (defaults to the host). */
  pointer?: HTMLElement;
  /** The hero's text block: the field dims behind it. */
  text?: HTMLElement | null;
  /** A column beside the text (default), or the whole hero at a lower opacity. */
  fill?: 'side' | 'full';
};

const KW = /^(import|from|const|interface|if|await|return|new|export|type|let|of|for|as)$/;
const TOKEN = /\s+|[A-Za-z_$][\w$-]*|'[^']*'|"[^"]*"|\d+|./g;
const TYPES: Record<string, string> = {
  Button: 'AstroComponent<ButtonProps>',
  Headline: 'AstroComponent<{ heading: Headline; as?: "h1" | "h2" }>',
  Window: 'AstroComponent<{ mode: "load" | "view" }>',
  HeroBlock: 'type HeroBlock = { heading; text?; ctas?: Cta[]; scene? }',
  Props: 'interface Props { block: HeroBlock; first?: boolean }',
  block: 'const block: HeroBlock',
  first: 'const first: boolean | undefined',
  Astro: 'AstroGlobal<Props>',
  mountCode: '(host: HTMLElement, opts: CodeOptions) => void',
  host: 'const host: HTMLElement | null',
  querySelector: '<E extends Element>(selectors: string) => E | null',
  closest: '<E extends Element>(selectors: string) => E | null',
  section: 'HTMLElement',
  hero: '.hero { min-height: calc(100svh - var(--header-h)) }',
  clamp: 'clamp(min, preferred, max)',
};

type Tok = { t: string; x: number; w: number; kind: 'kw' | 'str' | 'tag' | 'type' | 'id' };
const kindOf = (t: string): Tok['kind'] =>
  KW.test(t) ? 'kw' : /^['"]/.test(t) ? 'str' : /^[<>/{}=();:,.[\]]$/.test(t) ? 'tag' : /^[A-Z]/.test(t) ? 'type' : 'id';

export async function codefield(host: HTMLElement, { pointer = host, text, fill = 'side' }: CodeOptions) {
  const full = fill === 'full';
  const base = full ? 0.09 : 0.16, live = full ? 0.6 : 0.82; // faint layer, lit tokens
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const css = getComputedStyle(host);
  const col = (n: string) => css.getPropertyValue(n).trim();
  const C = { text: col('--text'), muted: col('--muted'), accent: col('--accent'), raised: col('--raised'), border: col('--border') };
  const family = col('--font-mono') || 'monospace';
  // Frontmatter, markup and script (the styles add length, not interest); long lines cut, so the sheet stays small.
  const lines = source.split('<style')[0].replace(/\n+$/, '').split('\n').map((l) => (l.length > 96 ? `${l.slice(0, 95)}…` : l));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const sheet = document.createElement('canvas');
  const sx = sheet.getContext('2d')!;
  let W = 0, H = 0, dpr = 1, fs = 12, lh = 22, cw = 7, gutter = 40, total = 0, toks: Tok[][] = [];
  let mask = { mobile: false, right: 0, top: 0 };
  const veil = document.createElement('canvas'); // to black towards the top, dimmed behind the text (made in measure)
  const vx = veil.getContext('2d')!;
  const alpha = { kw: 1, str: 0.85, tag: 0.6, type: 0.95, id: 0.8 } as const;
  const colour = (k: Tok['kind']) => (k === 'str' || k === 'tag' ? C.muted : C.text);

  const layout = () => {
    W = host.clientWidth; H = host.clientHeight; dpr = Math.min(devicePixelRatio, 2);
    const sd = Math.min(dpr, 1.5);
    canvas.width = W * dpr; canvas.height = H * dpr;
    fs = Math.max(9, Math.min(12, W * 0.008)); lh = fs * 1.8;
    ctx.font = `${fs}px ${family}`; cw = ctx.measureText('0'.repeat(10)).width / 10; gutter = cw * 5;
    toks = lines.map((l) => { let x = gutter; return (l.match(TOKEN) ?? []).flatMap((t) => { const w = t.length * cw, tok = { t, x, w, kind: kindOf(t) }; x += w; return /^\s+$/.test(t) ? [] : [tok]; }); });
    total = lines.length * lh;
    // The faint layer, once: every line at full colour (the blit dims it).
    const sw = gutter + Math.max(...lines.map((l) => l.length)) * cw;
    sheet.width = Math.ceil(sw * sd); sheet.height = Math.ceil(total * sd);
    sx.setTransform(sd, 0, 0, sd, 0, 0); sx.font = ctx.font; sx.textBaseline = 'alphabetic';
    lines.forEach((_, i) => {
      const y = i * lh + fs;
      sx.globalAlpha = 0.6; sx.fillStyle = C.muted; sx.textAlign = 'right'; sx.fillText(String(i + 1), gutter - cw * 1.5, y); sx.textAlign = 'left';
      for (const k of toks[i]) { sx.globalAlpha = alpha[k.kind]; sx.fillStyle = colour(k.kind); sx.fillText(k.t, k.x, y); }
    });
    measure();
  };

  // Where the text is: the column sits beside it, or the field stays above it when it spans the width (stacked).
  // Measured again when the text has risen into place (the rise is a translate).
  const measure = () => {
    const hb = host.getBoundingClientRect();
    const parts = text ? [...text.querySelectorAll<HTMLElement>('.tag, h1, h2, .lede, .hero__ctas > *')] : [];
    // The text's own extent (Ranges), not its boxes: a block heading is as wide as its column. One rect per line.
    const lineRects = parts.flatMap((e) => { const r = document.createRange(); r.selectNodeContents(e); return [...r.getClientRects()]; })
      .filter((r) => r.width).map((r) => ({ x: r.left - hb.left, y: r.top - hb.top, w: r.width, h: r.height }));
    const right = lineRects.length ? Math.max(...lineRects.map((r) => r.x + r.w)) : W * 0.5;
    const top = lineRects.length ? Math.min(...lineRects.map((r) => r.y)) : H;
    mask = { mobile: right > W * 0.72, right, top };
    veil.width = Math.ceil(W); veil.height = Math.ceil(H);
    vx.globalCompositeOperation = 'source-over'; vx.filter = 'none'; vx.clearRect(0, 0, W, H);
    // Stacked (the text spans the width): the field lives above the text and is gone before it.
    const g = mask.mobile ? vx.createLinearGradient(0, 0, 0, top) : vx.createLinearGradient(0, 0, 0, H);
    if (mask.mobile) { g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.35, '#000'); g.addColorStop(0.75, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)'); }
    else { g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.4, '#000'); g.addColorStop(1, '#000'); }
    vx.fillStyle = g; vx.fillRect(0, 0, W, mask.mobile ? top : H);
    // Behind the text the code only dims, softly: the lines drawn once as one shape, then taken out at half
    // strength through a wide blur (solid holes read as a dark shadow around the copy).
    const shape = document.createElement('canvas'); shape.width = veil.width; shape.height = veil.height;
    const sh = shape.getContext('2d')!; sh.fillStyle = '#000';
    const pad = fs * 1.5;
    for (const r of lineRects) sh.fillRect(r.x - pad, r.y - pad, r.w + pad * 2, r.h + pad * 2);
    vx.globalCompositeOperation = 'destination-out'; vx.globalAlpha = 0.5; vx.filter = `blur(${Math.round(fs * 4)}px)`;
    vx.drawImage(shape, 0, 0);
    vx.globalAlpha = 1;
    vx.filter = 'none'; vx.globalCompositeOperation = 'source-over';
  };

  const P = { x: 0, y: 0, tx: 0, ty: 0, inside: false, last: -1e9 };
  const ghost = (t: number) => { P.tx = W * (0.78 + 0.1 * Math.sin(t / 1900)); P.ty = (mask.mobile ? mask.top * 0.55 : H * 0.45) + H * 0.18 * Math.sin(t / 1400 + 1); };

  const frame = (t: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    // Side by side: a column from just past the text to the right edge; stacked or full: from the frame's left.
    const ox = full || mask.mobile ? W * 0.04 : Math.max(mask.right + W * 0.06, W * 0.52);
    // Full: the source tiled in columns across the hero, each scrolling out of step with the next.
    const sw = sheet.width * (total / sheet.height), colW = sw + cw * 4, cols = full ? Math.max(1, Math.ceil((W - ox) / colW)) : 1;
    const offOf = (c: number) => (((reduce ? 0 : -t / 90) + c * total * 0.37) % total + total) % total; // scrolls down
    const R = Math.max(140, W * 0.13);
    ctx.translate(ox, 0);
    // Faint layer: the sheet, tiled down each column.
    ctx.globalAlpha = base;
    for (let c = 0; c < cols; c++) { const o = offOf(c); for (let y = -o - total; y < H; y += total) ctx.drawImage(sheet, c * colW, y, sw, total); }
    // The pointer's column carries the live layer.
    const cp = Math.min(cols - 1, Math.max(0, Math.floor((P.x - ox) / colW))), off = offOf(cp);
    ctx.translate(cp * colW, 0);
    const lx = P.x - ox - cp * colW, ly = P.y; // pointer in that column's frame
    // Live layer: rows within reach of the pointer.
    const n0 = Math.floor((ly - R + off) / lh), n1 = Math.ceil((ly + R + off) / lh);
    let hov: (Tok & { y: number }) | null = null;
    for (let n = n0; n <= n1; n++) {
      const y = n * lh - off + fs, li = ((n % lines.length) + lines.length) % lines.length;
      const on = Math.abs(y - fs * 0.35 - ly) < lh / 2 && lx > 0;
      if (on) { ctx.globalAlpha = 0.04; ctx.fillStyle = C.text; ctx.fillRect(-cw, y - lh * 0.68, gutter + cw * 70, lh); ctx.globalAlpha = 0.6; ctx.fillStyle = C.muted; ctx.textAlign = 'right'; ctx.fillText(String(li + 1), gutter - cw * 1.5, y); ctx.textAlign = 'left'; }
      for (const k of toks[li]) {
        const d = Math.hypot(k.x + k.w / 2 - lx, y - fs * 0.35 - ly), a = Math.exp(-(d * d) / (R * R));
        if (a < 0.04) continue;
        ctx.globalAlpha = live * a * alpha[k.kind];
        ctx.fillStyle = k.kind === 'kw' && a > 0.5 ? C.accent : colour(k.kind);
        ctx.fillText(k.t, k.x, y);
        if (fine && on && lx >= k.x && lx <= k.x + k.w && TYPES[k.t]) hov = { ...k, y };
      }
    }
    ctx.globalAlpha = 1;
    if (!reduce && Math.floor(t / 530) % 2 && lx > gutter) { ctx.fillStyle = C.accent; ctx.fillRect(gutter + Math.round((lx - gutter) / cw) * cw, ly - fs * 0.9, 2, fs * 1.2); }
    if (hov) {
      const tip = TYPES[hov.t], bw = tip.length * cw + 20, by = hov.y + 10;
      ctx.fillStyle = C.text; ctx.fillRect(hov.x, hov.y + 3, hov.w, 1);
      ctx.fillStyle = C.raised; ctx.fillRect(hov.x, by, bw, lh + 8);
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.strokeRect(hov.x + 0.5, by + 0.5, bw - 1, lh + 7);
      ctx.fillStyle = C.text; ctx.fillText(tip, hov.x + 10, by + lh * 0.85);
    }
    // The veil: to black towards the top, dimmed behind the text.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(veil, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  };

  await document.fonts.load(`12px ${family}`).catch(() => {});
  layout();
  const settle = () => measure();
  text?.addEventListener('animationend', settle);
  host.append(canvas);
  ghost(0); P.x = P.tx; P.y = P.ty;
  frame(0);
  void getComputedStyle(canvas).opacity; // start the CSS fade from 0
  host.classList.add('is-ready');

  const ro = new ResizeObserver(() => { layout(); if (reduce) { ghost(0); P.x = P.tx; P.y = P.ty; frame(0); } });
  ro.observe(host);
  if (reduce) return () => { ro.disconnect(); text?.removeEventListener('animationend', settle); canvas.remove(); };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const b = host.getBoundingClientRect();
    P.tx = e.clientX - b.left; P.ty = e.clientY - b.top;
    if (!P.inside) { P.x = P.tx; P.y = P.ty; }
    P.inside = true; P.last = performance.now();
  };
  const onLeave = () => { P.inside = false; };
  pointer.addEventListener('pointermove', onMove, { passive: true });
  pointer.addEventListener('pointerleave', onLeave);
  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(host);

  let raf = 0;
  const loop = (t: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    if (!P.inside && t - P.last > 800) ghost(t);
    P.x += (P.tx - P.x) * 0.16; P.y += (P.ty - P.y) * 0.16;
    frame(t);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); text?.removeEventListener('animationend', settle);
    pointer.removeEventListener('pointermove', onMove); pointer.removeEventListener('pointerleave', onLeave);
    canvas.remove();
  };
}
