// Section transitions: the pixel thread runs down the frame line from the hero with scroll (its tip at 62%
// of the viewport) and each seam draws across as the tip passes it. Transform only. Tablet and desktop only:
// on mobile and on pages without a hero, no thread, each seam draws as it scrolls in.
import { gsap, ScrollTrigger, reduceMotion } from './gsap';

const seamsOnScroll = () => {
  for (const s of document.querySelectorAll<HTMLElement>('[data-seam]')) {
    ScrollTrigger.create({ trigger: s, start: 'top 92%', once: true, onEnter: () => s.classList.add('is-on') });
  }
};

export function initThread() {
  const main = document.querySelector<HTMLElement>('main');
  const thr = document.querySelector<HTMLElement>('[data-thread]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!main || !thr) return;
  if (!hero) return seamsOnScroll();
  const mm = gsap.matchMedia();
  mm.add('(max-width: 767.98px)', seamsOnScroll);
  mm.add('(min-width: 768px)', () => runThread(main, thr, hero));
}

function runThread(main: HTMLElement, thr: HTMLElement, hero: HTMLElement) {
  const line = thr.firstElementChild as HTMLElement;
  const px = thr.lastElementChild as HTMLElement;
  const seams = [...document.querySelectorAll<HTMLElement>('[data-seam]')];
  const rm = reduceMotion();
  let top = 0;
  let len = 1;
  let ys: number[] = [];
  // Top-level sections of the page: the pixel shows from the third one on (over the first sections it crowds
  // the content), and turns ink over a signal-red section (the accent would vanish there).
  const secs = [...main.children].filter((e): e is HTMLElement => e.tagName === 'SECTION');
  let from = 0, spans: { a: number; b: number; ink: boolean }[] = [];

  const docY = (el: HTMLElement) => el.getBoundingClientRect().top + scrollY;
  const measure = () => {
    const frame = parseFloat(getComputedStyle(hero).getPropertyValue('--frame')) || 0;
    top = hero.offsetTop + hero.offsetHeight - frame;
    len = Math.max(1, main.offsetHeight - top - 2);
    thr.style.top = `${top}px`;
    thr.style.height = `${len}px`;
    ys = seams.map(docY);
    from = secs[2] ? docY(secs[2]) : 0;
    spans = secs.map((e) => ({ a: docY(e), b: docY(e) + e.offsetHeight, ink: e.dataset.look === 'signal' }));
    update();
  };
  const update = () => {
    const tip = rm ? docY(main) + top + len : scrollY + innerHeight * 0.62;
    const k = Math.min(1, Math.max(0, (tip - docY(main) - top) / len));
    line.style.transform = `scaleY(${k})`;
    px.style.transform = `translateY(${k * len}px)`;
    const y = docY(main) + top + k * len; // the pixel, in the page
    px.classList.toggle('is-on', y >= from);
    px.classList.toggle('is-ink', spans.some((s) => s.ink && y >= s.a && y < s.b));
    seams.forEach((s, i) => s.classList.toggle('is-on', tip >= ys[i]));
  };

  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: measure });
  measure();
  thr.classList.add('is-set');
  return () => thr.classList.remove('is-set'); // matchMedia reverts the trigger itself
}
