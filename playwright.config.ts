import { defineConfig } from '@playwright/test';

// Own port: the tests run against the built site, never a dev server left open on 4321.
const url = 'http://localhost:4329';

export default defineConfig({
  testDir: 'tests',
  use: { baseURL: url },
  webServer: { command: 'pnpm --filter web preview --ignore-lock --port 4329', url, reuseExistingServer: true },
});
