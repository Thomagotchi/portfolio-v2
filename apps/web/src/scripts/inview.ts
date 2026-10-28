// [data-inview] gets .is-in once it enters (CSS transitions do the rest). [data-reveal] fades up (GSAP).
// Reduced motion: final states at once.
import { gsap, ScrollTrigger, reduceMotion } from './gsap';

export function initInview() {
  const rm = reduceMotion();
  for (const el of document.querySelectorAll<HTMLElement>('[data-inview=""]')) {
    if (rm) el.classList.add('is-in');
    else ScrollTrigger.create({ trigger: el, start: el.dataset.start ?? 'top 75%', once: true, onEnter: () => el.classList.add('is-in') });
  }
  if (rm) return;
  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    gsap.fromTo(el, { opacity: 0, y: 12 }, {
      opacity: 1, y: 0, translate: 'none', duration: 1, ease: 'soft',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  }
}
