import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:4173/Commutr/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'iphone-se',
      use: { browserName: 'chromium', viewport: { width: 375, height: 667 } },
    },
    {
      name: 'iphone-14',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: 'pnpm exec vite preview --port 4173 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4173/Commutr/',
    timeout: 180_000,
    reuseExistingServer: !process.env['CI'],
  },
})
