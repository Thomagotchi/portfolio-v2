// pnpm hero:check — hero frames in Chromium, WebKit and Firefox (0.4 s, 1 s, 4.5 s) into .shots/,
// plus whether the frame's clip-path is valid and the terrain canvas is ready.
import { chromium, webkit, firefox } from '@playwright/test';

const url = process.env.SHOT_URL ?? 'http://localhost:4321/';
for (const [name, type] of [['chromium', chromium], ['webkit', webkit], ['firefox', firefox]]) {
  const browser = await type.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'commit' });
  const t0 = Date.now();
  for (const t of [400, 1000, 4500]) {
    await page.waitForTimeout(Math.max(0, t - (Date.now() - t0)));
    await page.screenshot({ path: `.shots/hero-${name}-${t}.png`, animations: 'allow' });
  }
  const info = await page.evaluate(() => ({
    clip: getComputedStyle(document.querySelector('[data-hero] .win__frame')).clipPath.slice(0, 40),
    terrain: !!document.querySelector('[data-terrain].is-ready canvas'),
  }));
  console.log(name, info);
  await browser.close();
}
