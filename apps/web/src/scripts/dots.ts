// Canvas 2D dot fields (404). One loop helper: DPR-sized canvas (≤ 2), redraw on resize,
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
