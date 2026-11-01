// Smooth scroll. The only file that touches Lenis: others use scrollTo / lockScroll.
import type Lenis from 'lenis';
import { SMOOTH_SCROLL } from '@/config';
import { gsap, ScrollTrigger, reduceMotion } from './gsap';

let lenis: Lenis | null = null;

export async function initScroll() {
  if (!SMOOTH_SCROLL || reduceMotion()) return;
  const { default: L } = await import('lenis');
  lenis = new L({ autoRaf: false, anchors: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Scrolls to an element, a selector or a position; resolves once there (Lenis' duration, or a moment natively). */
export function scrollTo(target: string | number | HTMLElement, opts: { duration?: number } = {}): Promise<void> {
  return new Promise((done) => {
    const t = setTimeout(done, ((opts.duration ?? 1.2) + 0.3) * 1000); // Lenis skips onComplete when already there
    const end = () => { clearTimeout(t); done(); };
    if (lenis) { lenis.scrollTo(target, { ...opts, onComplete: end }); return; }
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (typeof el === 'number') window.scrollTo({ top: el, behavior: reduceMotion() ? 'auto' : 'smooth' });
    else el?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' });
    clearTimeout(t); setTimeout(done, reduceMotion() ? 0 : 600);
  });
}

/** Modals, menus: lock and unlock page scroll. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
