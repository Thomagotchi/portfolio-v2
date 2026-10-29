// Hover-or-click disclosure (navbar panels, language switch). A mouse opens on hover; the click that follows
// a hover confirms it and never closes it (the old toggle shut the panel people were trying to open). Click
// on an already confirmed trigger, touch and keyboard toggle. Leaving every zone closes after a short delay;
// Esc closes and returns focus, a click or focus outside closes.
interface Opts {
  triggers: HTMLElement[];
  /** Elements the pointer may travel through without closing (bar, panel). */
  zones: HTMLElement[];
  show: (t: HTMLElement) => void;
  hide: () => void;
}

export function menu({ triggers, zones, show, hide }: Opts) {
  let cur: HTMLElement | null = null;
  let hovered = false;
  let timer = 0;
  const inside = (n: EventTarget | null) => n instanceof Node && zones.some((z) => z.contains(n));

  const open = (t: HTMLElement, byHover: boolean) => {
    clearTimeout(timer);
    hovered = byHover;
    if (cur === t) return;
    cur = t;
    triggers.forEach((b) => b.setAttribute('aria-expanded', String(b === t)));
    show(t);
  };
  const close = () => {
    clearTimeout(timer);
    if (!cur) return;
    cur = null;
    triggers.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    hide();
  };

  for (const t of triggers) {
    t.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') open(t, true); });
    t.addEventListener('click', () => {
      if (cur === t && !hovered) close();
      else open(t, false);
    });
  }
  for (const z of zones) {
    z.addEventListener('pointerenter', () => clearTimeout(timer));
    z.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse' && !inside(e.relatedTarget)) timer = window.setTimeout(close, 250);
    });
    z.addEventListener('focusout', (e) => { if (!inside(e.relatedTarget)) close(); });
  }
  document.addEventListener('click', (e) => { if (cur && !inside(e.target)) close(); });
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !cur) return;
    cur.focus();
    close();
  });
  return { close, current: () => cur };
}
