// pnpm shot [route]: screenshots at the DA frames (390 / 768 / 1440) into .shots/.
// <route>-full-*.png: whole page, reduced motion (final states). <route>-top-*.png: first viewport with motion, after 5.5 s.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const route = process.argv[2] ?? '/';
const name = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
const base = process.env.SHOT_URL ?? 'http://localhost:4321';
mkdirSync('.shots', { recursive: true });
const browser = await chromium.launch({ args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=metal'] });
for (const width of [390, 768, 1440]) {
  const height = width === 390 ? 844 : width === 768 ? 1024 : 900;
  for (const reducedMotion of ['reduce', 'no-preference']) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    if (reducedMotion === 'reduce') await page.screenshot({ path: `.shots/${name}-full-${width}.png`, fullPage: true });
    else { await page.waitForTimeout(5500); await page.screenshot({ path: `.shots/${name}-top-${width}.png` }); }
    await page.close();
  }
}
await browser.close();
console.log('shots in .shots/');
