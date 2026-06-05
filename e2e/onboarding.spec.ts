import { test, expect } from '@playwright/test'

test('onboarding skip reaches home', async ({ page }) => {
  await page.goto('./?screen=ob')
  await page.getByRole('button', { name: 'Skip' }).click()
  await expect(page.locator('#s-home')).toBeVisible()
})

test('deep link opens search screen', async ({ page }) => {
  await page.goto('./?screen=search')
  await expect(page.locator('#s-search')).toBeVisible()
})
