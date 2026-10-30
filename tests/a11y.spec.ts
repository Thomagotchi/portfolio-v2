import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

// Every route in the sitemap (+ 404) gets an axe run, in every DA theme.
const sitemap = readFileSync('apps/web/dist/client/sitemap-0.xml', 'utf8');
const routes = [...[...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/'), '/404', '/en/404'];
const { themes } = JSON.parse(readFileSync('packages/tokens/dist/tokens.json', 'utf8')) as { themes: string[] };

for (const route of routes) {
  for (const theme of themes) {
    test(`a11y ${route} (${theme})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
      await page.waitForTimeout(700); // colour transitions settle: axe must not read a mid-transition colour
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
    });
  }
}
