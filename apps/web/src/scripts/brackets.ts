// Cursor brackets (DA motion "Cursor brackets"): inside a [data-brackets] grid the cursor becomes two 2px
// corner brackets that ease onto the hovered cell and hold it across the hairline gaps; a 4px accent dot
// marks the pointer. Keyboard focus inside a cell moves the brackets there too. Fine pointers only (touch
// keeps its own behaviour); reduced motion → the brackets jump instead of easing.
// [data-brackets="<selector>"] picks the cells; default: the grid's children.
import { reduceMotion } from './gsap';

type Box = { x: number; y: number; w: number; h: number };
const INSET = 6; // brackets sit just inside the cell: shared hairlines stay clean

export function initBrackets() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const rm = reduceMotion();
  for (const grid of document.querySelectorAll<HTMLElement>('[data-brackets]')) {
    const cells = [...grid.querySelectorAll<HTMLElement>(grid.dataset.brackets || ':scope > *')];
    if (!cells.length) continue;
    const ring = Object.assign(document.createElement('span'), { className: 'brk' });
    const dot = Object.assign(document.createElement('span'), { className: 'brk-dot' });
    ring.setAttribute('aria-hidden', 'true');
    dot.setAttribute('aria-hidden', 'true');
    // In <body>, page coordinates: inside a <ul>/<dl> they would break the list for assistive tech.
    document.body.append(ring, dot);
    grid.classList.add('has-brk');
    const show = (on: boolean) => { grid.classList.toggle('is-brk', on); ring.classList.toggle('is-on', on); dot.classList.toggle('is-on', on); };

    let cur: Box | null = null, tgt: Box | null = null, raf = 0;
    const draw = () => { if (!cur) return; ring.style.transform = `translate(${cur.x}px, ${cur.y}px)`; ring.style.width = `${cur.w}px`; ring.style.height = `${cur.h}px`; };
    const frame = () => {
      if (!cur || !tgt) return;
      let moving = false;
      for (const k of ['x', 'y', 'w', 'h'] as const) {
        const d = tgt[k] - cur[k];
        cur[k] += rm ? d : d * 0.18;
        if (Math.abs(d) > 0.2) moving = true;
      }
      draw();
      raf = moving ? requestAnimationFrame(frame) : 0;
    };
    const boxOf = (el: HTMLElement): Box => {
      const q = el.getBoundingClientRect();
      return { x: q.left + scrollX + INSET, y: q.top + scrollY + INSET, w: q.width - INSET * 2, h: q.height - INSET * 2 };
    };
    const aim = (b: Box) => { tgt = b; cur ??= { ...b }; show(true); if (!raf) raf = requestAnimationFrame(frame); };

    grid.addEventListener('pointermove', (e) => {
      dot.style.transform = `translate(${e.clientX + scrollX - 2}px, ${e.clientY + scrollY - 2}px)`;
      let best: HTMLElement | null = null, bd = 14;
      for (const c of cells) {
        const q = c.getBoundingClientRect();
        const d = Math.hypot(Math.max(q.left - e.clientX, 0, e.clientX - q.right), Math.max(q.top - e.clientY, 0, e.clientY - q.bottom));
        if (d < bd) { bd = d; best = c; }
      }
      if (best) aim(boxOf(best));
    });
    grid.addEventListener('pointerleave', () => show(false));
    grid.addEventListener('focusin', (e) => { const c = cells.find((x) => x.contains(e.target as Node)); if (c) aim(boxOf(c)); });
    grid.addEventListener('focusout', (e) => { if (!grid.contains(e.relatedTarget as Node)) show(false); });
  }
}
