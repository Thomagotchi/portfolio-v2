// Odometer with a changing value (pricing total, timeline year). Rebuilds the reels when the shape changes
// (digit count, separators), then rolls each digit to its place. Same markup as ui/Odometer.astro.
export function setOdometer(el: HTMLElement, value: string) {
  const sr = el.querySelector('.sr-only');
  if (sr) sr.textContent = value;
  const reels = [...el.querySelectorAll<HTMLElement>('.reel')];
  const shape = [...value].map((c) => (/\d/.test(c) ? 'd' : c)).join('');
  if (el.dataset.shape !== shape || reels.length !== value.length) {
    el.dataset.shape = shape;
    reels.forEach((r) => r.remove());
    [...value].forEach((ch, i) => {
      const r = document.createElement('span');
      r.className = 'reel';
      r.setAttribute('aria-hidden', 'true');
      r.style.setProperty('--i', String(i));
      r.innerHTML = /\d/.test(ch) ? Array.from({ length: 10 }, (_, d) => `<b>${d}</b>`).join('') : `<b>${ch === ' ' ? '&nbsp;' : ch}</b>`; // a bare space collapses to nothing
      el.append(r);
    });
    void el.offsetWidth; // new reels start at 0, then roll
  }
  [...el.querySelectorAll<HTMLElement>('.reel')].forEach((r, i) => { if (/\d/.test(value[i])) r.style.setProperty('--v', value[i]); });
}
