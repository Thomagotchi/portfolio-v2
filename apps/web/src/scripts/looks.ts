// Section entries (lib/looks sets data-entry from the looks of two neighbouring sections). All scrubbed by the
// scroll, so they play backwards too. Reduced motion: none of them, the sections keep their looks.
// pixels: the previous section's colour carries on over the section, then clears in cells, in a wave from the top
//   that keeps pace with the scroll (it plays on screen, not ahead of it); the cells on its front flash the red.
// curtain: the section rises over the previous one from its bottom edge (clip-path).
// bascule: light → dark. The light section(s) before it and the section itself stay light until its top passes
//   the middle of the screen, then the whole view crossfades to dark (and back when scrolling up).
import { ScrollTrigger, reduceMotion } from './gsap';

const css = (el: Element, name: string) => getComputedStyle(el).getPropertyValue(name).trim();
const hash = (r: number, c: number) => { const n = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453; return n - Math.floor(n); };

function pixels(sec: HTMLElement) {
  let prev: Element | null = sec.previousElementSibling;
  while (prev && prev.tagName !== 'SECTION') prev = prev.previousElementSibling; // skip scripts and styles between sections
  prev ??= document.documentElement;
  const bg = getComputedStyle(prev).backgroundColor;
  const cover = bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : css(document.documentElement, '--bg');
  const flash = css(document.documentElement, prev.getAttribute('data-look') === 'signal' ? '--color-signal-500' : '--color-signal-300');
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  Object.assign(cv.style, { position: 'absolute', left: '0', top: '0', width: '100%', zIndex: '3', pointerEvents: 'none' });
  sec.prepend(cv);
  const ctx = cv.getContext('2d')!;
  let W = 0, H = 0, S = 48, q = 0;
  const size = () => { W = sec.clientWidth; H = Math.min(sec.clientHeight, innerHeight * 1.2); S = W < 768 ? 32 : 48; cv.width = W; cv.height = H; cv.style.height = `${H}px`; draw(); };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const k = q * 1.05, cols = Math.ceil(W / S), rows = Math.ceil(H / S);
    cv.style.display = k >= 1.05 ? 'none' : '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const thr = 0.15 + (r / rows) * 0.5 + (c / cols) * 0.15 + hash(r, c) * 0.2;
      if (k < thr - 0.07) { ctx.fillStyle = cover; ctx.fillRect(c * S, r * S, S, S); }
      else if (k < thr) { ctx.globalAlpha = (thr - k) / 0.07; ctx.fillStyle = flash; ctx.fillRect(c * S + 1, r * S + 1, S - 2, S - 2); ctx.globalAlpha = 1; }
    }
  };
  size();
  new ResizeObserver(size).observe(sec);
  ScrollTrigger.create({ trigger: sec, start: 'top 85%', end: 'top top', onUpdate: (s) => { q = s.progress; draw(); }, onRefresh: (s) => { q = s.progress; draw(); } });
}

function curtain(sec: HTMLElement) {
  const set = (p: number) => { const k = 1 - (1 - p) ** 3; sec.style.clipPath = k >= 1 ? '' : `inset(${(1 - k) * 100}% 0 0 0)`; };
  ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'top 35%', onUpdate: (s) => set(s.progress), onRefresh: (s) => set(s.progress) });
}

function bascule(sec: HTMLElement) {
  const lights: HTMLElement[] = [];
  for (let el = sec.previousElementSibling; el instanceof HTMLElement; el = el.previousElementSibling) {
    if (el.tagName !== 'SECTION') continue;
    if (el.dataset.look !== 'light') break;
    lights.push(el);
  }
  const group = [sec, ...lights];
  let t = 0;
  const flip = (dark: boolean, animate = true) => {
    if (animate) { group.forEach((el) => el.classList.add('is-flipping')); clearTimeout(t); t = window.setTimeout(() => group.forEach((el) => el.classList.remove('is-flipping')), 1000); }
    group.forEach((el) => (el.dataset.theme = dark ? 'dark' : 'light'));
  };
  ScrollTrigger.create({
    trigger: sec, start: 'top 55%',
    onEnter: () => flip(true), onLeaveBack: () => flip(false),
    onRefresh: (s) => flip(s.progress > 0, false),
  });
}

export function initLooks() {
  if (reduceMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-entry="pixels"]').forEach(pixels);
  document.querySelectorAll<HTMLElement>('[data-entry="curtain"]').forEach(curtain);
  document.querySelectorAll<HTMLElement>('[data-entry="bascule"]').forEach(bascule);
}
