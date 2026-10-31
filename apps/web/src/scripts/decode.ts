// Decode (DA motion 17): text resolves left to right out of binary. The box is locked to the final
// text's size first, so nothing around it moves. The binary shows at once; it starts resolving after delay.
import { ScrollTrigger, reduceMotion } from './gsap';

export function decode(el: HTMLElement, text = el.dataset.text ?? el.textContent ?? '', dur = 1100, delay = 0) {
  el.dataset.text ??= el.textContent ?? '';
  if (reduceMotion()) { el.textContent = text; return; }
  el.textContent = text;
  if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
  const b = el.getBoundingClientRect();
  // clip-path, not overflow: overflow ≠ visible moves an inline-block's baseline to its bottom edge (the text jumps).
  Object.assign(el.style, { width: `${b.width}px`, height: `${b.height}px`, clipPath: 'inset(0 -2px)' });
  const t0 = performance.now() + delay;
  const step = (now: number) => {
    const k = Math.min(1, Math.max(0, (now - t0) / dur));
    const n = Math.floor(k * text.length);
    el.textContent = text.slice(0, n) + [...text.slice(n)].map((c) => (/\s|·/.test(c) ? c : Math.random() < 0.5 ? '0' : '1')).join('');
    if (k < 1) requestAnimationFrame(step);
    else { el.textContent = text; Object.assign(el.style, { width: '', height: '', clipPath: '' }); }
  };
  step(performance.now()); // the first frame now: binary from the start
}

export function initDecode() {
  if (reduceMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-decode]').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 95%', once: true,
      onEnter: () => { decode(el, undefined, 1100, 250 + (i % 3) * 120); el.closest('[data-tag]')?.classList.add('is-in'); },
    });
  });
}
