// Canvas 2D dot fields (About portrait, 404). One loop helper: DPR-sized canvas (≤ 2), redraw on resize,
// paused off screen and in hidden tabs, a single static frame under reduced motion.
import { reduceMotion } from './gsap';

export type Ctx = { ctx: CanvasRenderingContext2D; w: number; h: number; t: number; css: (v: string) => string };

export function canvasLoop(cv: HTMLCanvasElement, draw: (c: Ctx) => void, onResize?: (w: number, h: number) => void) {
  const ctx = cv.getContext('2d')!;
  const style = getComputedStyle(cv);
  const css = (v: string) => style.getPropertyValue(v).trim();
  const rm = reduceMotion();
  let w = 0, h = 0, on = false, raf = 0;
  const frame = (t: number) => { draw({ ctx, w, h, t, css }); if (on && !rm) raf = requestAnimationFrame(frame); };
  const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };
  const size = () => {
    const d = Math.min(2, devicePixelRatio || 1);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = Math.round(w * d); cv.height = Math.round(h * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    onResize?.(w, h);
    start();
  };
  new ResizeObserver(size).observe(cv);
  new IntersectionObserver(([e]) => { on = e.isIntersecting && !document.hidden; if (on) start(); }).observe(cv);
  document.addEventListener('visibilitychange', () => { on = !document.hidden; if (on) start(); });
  return { redraw: start };
}

/** Pointer position relative to the canvas, from events on a larger host (so content above it doesn't block). */
export function trackPointer(cv: HTMLElement, host: HTMLElement) {
  const p = { x: -999, y: -999 };
  host.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); p.x = e.clientX - r.left; p.y = e.clientY - r.top; }, { passive: true });
  host.addEventListener('pointerleave', () => { p.x = p.y = -999; });
  return p;
}

/** About portrait placeholder: a dot grid with every 6th column as a line; the pointer warps it sideways
 * and lights a few dots in the accent. */
export function dotWarp(cv: HTMLCanvasElement, host: HTMLElement) {
  const p = trackPointer(cv, host);
  let sx = -999, sy = -999;
  canvasLoop(cv, ({ ctx, w, h, css }) => {
    sx += (p.x - sx) * 0.12; sy += (p.y - sy) * 0.12;
    if (p.x < -900) sx = sy = -999;
    ctx.clearRect(0, 0, w, h);
    const fg = css('--muted'), ac = css('--accent'), step = 14, cols = Math.ceil(w / step) + 1;
    const off = (x: number, y: number) => { const dx = x - sx, k = Math.max(0, 1 - Math.hypot(dx, y - sy) / 130); return [Math.sign(dx) * k * k * 26, k]; };
    for (let c = 0; c < cols; c++) {
      const x = c * step;
      if (c % 6 === 0) {
        ctx.strokeStyle = fg; ctx.globalAlpha = 0.28; ctx.lineWidth = 1; ctx.beginPath();
        for (let y = 0; y <= h; y += 8) { const [o] = off(x, y); if (y) ctx.lineTo(x + o + 0.5, y); else ctx.moveTo(x + o + 0.5, y); }
        ctx.stroke();
      }
      for (let y = step / 2; y < h; y += step) {
        const [o, k] = off(x, y), hot = k > 0.35 && (c * 7 + y) % 5 < 1, s = hot ? 3 : 1.4;
        ctx.fillStyle = hot ? ac : fg; ctx.globalAlpha = hot ? 1 : 0.35 + k * 0.4;
        ctx.fillRect(x + o - s / 2, y - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
  });
}
