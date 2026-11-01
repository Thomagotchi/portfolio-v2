// Code field (home hero): the hero's own source (Hero.astro, read at build, comments stripped), straight and
// still (placed so the lines of the hero's parts sit level with the text), fading to black towards the top. "side": a column beside the text; "full": the whole hero,
// fainter, dimmed behind the text. Hovering (or focusing) a part of the hero lights the lines that render it.
// Canvas 2D: the faint text is drawn once into a sheet and blitted each frame; only lit lines are drawn live.
// Paused off screen and in hidden tabs; under reduced motion the code stands still.
import source from '@/components/sections/Hero.astro?raw';

/** A part of the hero and the source lines that render it: the first line containing `from`, through `to`. */
export type CodeTarget = { el: HTMLElement; from: string; to?: string };

export type CodeOptions = {
  /** Parts of the hero that light their lines of code on hover and focus. */
  targets?: CodeTarget[];
  /** The hero's text block: the field dims behind it. */
  text?: HTMLElement | null;
  /** A column beside the text (default), or the whole hero at a lower opacity. */
  fill?: 'side' | 'full';
};

const KW = /^(import|from|const|interface|if|await|return|new|export|type|let|of|for|as)$/;
const TOKEN = /\s+|[A-Za-z_$][\w$-]*|'[^']*'|"[^"]*"|\d+|./g;

type Tok = { t: string; x: number; w: number; kind: 'kw' | 'str' | 'tag' | 'type' | 'id' };
const kindOf = (t: string): Tok['kind'] =>
  KW.test(t) ? 'kw' : /^['"]/.test(t) ? 'str' : /^[<>/{}=();:,.[\]]$/.test(t) ? 'tag' : /^[A-Z]/.test(t) ? 'type' : 'id';

export async function codefield(host: HTMLElement, { targets = [], text, fill = 'side' }: CodeOptions) {
  const full = fill === 'full';
  const base = full ? 0.09 : 0.16, live = full ? 0.6 : 0.82; // faint layer, lit tokens
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(host);
  const col = (n: string) => css.getPropertyValue(n).trim();
  const C = { text: col('--text'), muted: col('--muted'), accent: col('--accent'), raised: col('--raised'), border: col('--border') };
  const family = col('--font-mono') || 'monospace';
  // Frontmatter, markup and script (the styles add length, not interest), without comments (whole-line ones go,
  // trailing ones are cut, runs of blank lines fold into one); each line keeps its number in the file. Long lines
  // cut, so the sheet stays small.
  const src = source.split('<style')[0].replace(/\n+$/, '').split('\n')
    .map((l, i) => ({ l: l.replace(/\s+\/\/\s.*$/, ''), n: i + 1, drop: /^\s*\/\//.test(l) }))
    .filter((o, i, all) => !o.drop && !(o.l.trim() === '' && all.slice(0, i).filter((q) => !q.drop).at(-1)?.l.trim() === ''));
  const lines = src.map(({ l }) => (l.length > 96 ? `${l.slice(0, 95)}…` : l));
  const lineOf = (s: string) => lines.findIndex((l) => l.includes(s));
  const spans = targets.map(({ el, from, to }) => { const a = lineOf(from); return { el, a, b: to ? Math.max(a, lineOf(to)) : a }; }).filter((t) => t.a >= 0);

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
      sx.globalAlpha = 0.6; sx.fillStyle = C.muted; sx.textAlign = 'right'; sx.fillText(String(src[i].n), gutter - cw * 1.5, y); sx.textAlign = 'left';
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

  // Placement: off (px), line i sits at i * lh + off (modulo the source's height); a focused part's lines are lit by hl.
  let off = 0, focus: (typeof spans)[number] | null = null;
  const hl = new Float32Array(lines.length);
  // The code stands still, placed once (and on resize) so the lines of the hero's parts sit level with the text.
  const place = () => {
    if (!spans.length) return;
    const hb = host.getBoundingClientRect(), tb = text?.getBoundingClientRect();
    const a = Math.min(...spans.map((t) => t.a)), b = Math.max(...spans.map((t) => t.b));
    const cy = tb ? tb.top - hb.top + tb.height / 2 : H / 2;
    off = cy - ((a + b) / 2) * lh - fs * 0.65;
  };
  const step = (dt: number) => {
    const f = focus && !full && !mask.mobile ? focus : null;
    const k = reduce ? 1 : 1 - Math.exp(-dt * 8);
    for (let i = 0; i < lines.length; i++) hl[i] += ((f && i >= f.a && i <= f.b ? 1 : 0) - hl[i]) * k;
  };

  const frame = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    // Side by side: a column from just past the text to the right edge; stacked or full: from the frame's left.
    const ox = full || mask.mobile ? W * 0.04 : Math.max(mask.right + W * 0.06, W * 0.52);
    // Full: the source tiled in columns across the hero, each out of step with the next.
    const sw = sheet.width * (total / sheet.height), colW = sw + cw * 4, cols = full ? Math.max(1, Math.ceil((W - ox) / colW)) : 1;
    const offOf = (c: number) => (((-off) + c * total * 0.37) % total + total) % total;
    ctx.translate(ox, 0);
    // Faint layer: the sheet, tiled down each column.
    ctx.globalAlpha = base;
    for (let c = 0; c < cols; c++) { const o = offOf(c); for (let y = -o - total; y < H; y += total) ctx.drawImage(sheet, c * colW, y, sw, total); }
    // Lit lines (first column): a faint band, an accent mark, the line at full strength.
    const o = offOf(0);
    for (let i = 0; i < lines.length; i++) {
      const h = hl[i];
      if (h < 0.02) continue;
      for (let y = i * lh - o + fs - total; y < H + lh; y += total) {
        if (y < -lh) continue;
        ctx.globalAlpha = 0.05 * h; ctx.fillStyle = C.text; ctx.fillRect(-cw, y - lh * 0.68, sw + cw, lh);
        ctx.globalAlpha = h; ctx.fillStyle = C.accent; ctx.fillRect(-cw, y - lh * 0.68, 2, lh);
        ctx.globalAlpha = 0.6 * h; ctx.fillStyle = C.muted; ctx.textAlign = 'right'; ctx.fillText(String(src[i].n), gutter - cw * 1.5, y); ctx.textAlign = 'left';
        for (const k of toks[i]) { ctx.globalAlpha = live * h * alpha[k.kind]; ctx.fillStyle = colour(k.kind); ctx.fillText(k.t, k.x, y); }
      }
    }
    ctx.globalAlpha = 1;
    // The veil: to black towards the top, dimmed behind the text.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(veil, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  };

  await document.fonts.load(`12px ${family}`).catch(() => {});
  layout();
  place();
  const settle = () => { measure(); place(); };
  text?.addEventListener('animationend', settle);
  host.append(canvas);
  frame();
  void getComputedStyle(canvas).opacity; // start the CSS fade from 0
  host.classList.add('is-ready');

  // Hover and keyboard focus on a part of the hero focus its lines.
  const on = (t: (typeof spans)[number]) => () => { focus = t; if (reduce) { step(0); frame(); } };
  const offFocus = (t: (typeof spans)[number]) => () => { if (focus === t) focus = null; if (reduce) { step(0); frame(); } };
  const subs = spans.flatMap((t) => [['pointerenter', on(t)], ['focusin', on(t)], ['pointerleave', offFocus(t)], ['focusout', offFocus(t)]].map(([e, f]) => [t.el, e, f] as const));
  subs.forEach(([el, e, f]) => el.addEventListener(e as string, f as EventListener));

  const ro = new ResizeObserver(() => { layout(); place(); frame(); });
  ro.observe(host);
  let visible = true, raf = 0, last = 0;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(host);
  const loop = (t: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    if (!visible || document.hidden) return;
    step(dt);
    frame();
  };
  if (!reduce) raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); text?.removeEventListener('animationend', settle);
    subs.forEach(([el, e, f]) => el.removeEventListener(e as string, f as EventListener));
    canvas.remove();
  };
}
