import { defineConfig, devices } from '@playwright/test'

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
    { name: 'iphone-se', use: { ...devices['iPhone SE'] } },
    { name: 'iphone-14', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'pnpm run preview -- --port 3000',
    port: 3000,
    reuseExistingServer: !process.env['CI'],
  },
})
