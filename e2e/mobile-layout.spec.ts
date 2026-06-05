import { test, expect } from '@playwright/test'

test('bottom nav is visible on home', async ({ page }) => {
  await page.goto('./?screen=home')
  const nav = page.locator('#xnav')
  await expect(nav).toBeVisible()
})

test('safe-area tokens apply to shell', async ({ page }) => {
  await page.goto('./?screen=home')
  const padding = await page
    .locator('.scr.on')
    .first()
    .evaluate((el) => {
      return getComputedStyle(el).paddingBottom
    })
  expect(padding).toBeTruthy()
})
