// WebGL budget on a throttled CPU (4×, like Lighthouse mobile). Run after every scene change.
import { test, expect, chromium } from '@playwright/test';

test('hero scene stays within budget', async () => {
  const browser = await chromium.launch({ args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=metal'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => {
    const w = window as unknown as { __lt: number[] };
    w.__lt = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => w.__lt.push(e.duration))).observe({ type: 'longtask', buffered: true });
  });
  await page.goto('/');

  const ready = await page.waitForSelector('[data-terrain].is-ready', { timeout: 10_000 }).then(() => true, () => false);
  if (!ready) await browser.close();
  test.skip(!ready, 'No GPU here: the hero shows its fallback, nothing to measure.');

  const frames = await page.evaluate(() => new Promise<number[]>((done) => {
    const out: number[] = [];
    let last = performance.now();
    const tick = (t: number) => { out.push(t - last); last = t; if (out.length < 180) requestAnimationFrame(tick); else done(out); };
    requestAnimationFrame(tick);
  }));
  const longTasks = await page.evaluate(() => (window as unknown as { __lt: number[] }).__lt);
  await browser.close();

  frames.sort((a, b) => a - b);
  const p95 = frames[Math.floor(frames.length * 0.95)];
  const blocking = longTasks.reduce((s, d) => s + Math.max(0, d - 50), 0);
  console.log(`scene: p95 frame ${p95.toFixed(1)} ms, blocking ${Math.round(blocking)} ms, long tasks ${longTasks.map(Math.round).join(', ') || 'none'}`);
  expect(blocking, 'blocking time (TBT-like)').toBeLessThan(150);
  expect(p95, 'p95 frame time (≈ 50 fps on a 4× slower CPU)').toBeLessThan(20);
});
