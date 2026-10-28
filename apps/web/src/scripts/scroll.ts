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

export function scrollTo(target: string | number | HTMLElement) {
  if (lenis) return lenis.scrollTo(target);
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (typeof el === 'number') window.scrollTo({ top: el });
  else el?.scrollIntoView();
}

/** Modals, menus: lock and unlock page scroll. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
