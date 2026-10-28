// Live clocks: every <time data-clock data-tz="Europe/Paris"> ticks each second (footer, contact readout).
export function initClocks() {
  const clocks = [...document.querySelectorAll<HTMLElement>('[data-clock]')];
  if (!clocks.length) return;
  const fmts = clocks.map((c) => new Intl.DateTimeFormat('fr-FR', { timeZone: c.dataset.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const tick = () => clocks.forEach((c, i) => { c.textContent = fmts[i].format(new Date()); });
  tick();
  setInterval(tick, 1000);
}
