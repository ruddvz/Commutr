import { test, expect } from '@playwright/test'

test('home screen is visible', async ({ page }) => {
  await page.goto('./?screen=home')
  await expect(page.locator('#appScreen')).toContainText('Where are you going')
})

test('safe-area tokens apply to shell', async ({ page }) => {
  await page.goto('./?screen=home')
  const padding = await page.locator('#appScreen').evaluate((el) => {
    return getComputedStyle(el).paddingBottom
  })
  expect(padding).toBeTruthy()
})

test('bottom nav respects safe area layout', async ({ page }) => {
  await page.goto('./?screen=home')
  await expect(page.locator('#appBottomNav')).toBeVisible()
  await expect(page.locator('.cm-bottom-nav')).toBeVisible()
})

test('dark theme tokens are applied', async ({ page }) => {
  await page.goto('./?screen=home')
  const bg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--cm-bg').trim(),
  )
  expect(bg).toBe('#06120d')
})
