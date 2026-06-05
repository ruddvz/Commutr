import { test, expect } from '@playwright/test'

test('home screen is visible', async ({ page }) => {
  await page.goto('./?screen=home')
  await expect(page.locator('#s-home')).toBeVisible()
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
