import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:4321' },
  webServer: { command: 'pnpm --filter web preview --ignore-lock', url: 'http://localhost:4321', reuseExistingServer: true },
});
