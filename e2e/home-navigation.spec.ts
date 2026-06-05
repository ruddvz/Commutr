import { test, expect } from '@playwright/test'

test('home loads without fatal error', async ({ page }) => {
  await page.goto('./?screen=home')
  await expect(page.getByText('Where are you going?')).toBeVisible()
  await expect(page.getByText('Something went wrong')).not.toBeVisible()
})

test('bottom tabs navigate', async ({ page }) => {
  await page.goto('./?screen=home')
  await page.getByRole('tab', { name: /search/i }).click()
  await expect(page.locator('#appTopBar .cm-topbar__title')).toHaveText(/Search rides/i)
  await page.getByRole('tab', { name: /post/i }).click()
  await expect(page.locator('#appTopBar .cm-topbar__title')).toHaveText(/Post a ride/i)
})

test('search flow opens results', async ({ page }) => {
  await page.goto('./?screen=home')
  await page.getByRole('button', { name: /search rides/i }).click()
  await expect(page.getByText(/London.*Toronto/i)).toBeVisible()
})

test('ride cards appear on home', async ({ page }) => {
  await page.goto('./?screen=home')
  await expect(page.locator('.cm-ride-card').first()).toBeVisible({ timeout: 10000 })
})

test('notifications bell navigates', async ({ page }) => {
  await page.goto('./?screen=home')
  await page.getByRole('button', { name: /notifications/i }).click()
  await expect(page.locator('#appScreen')).toBeVisible()
})
