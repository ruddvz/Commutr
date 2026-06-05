#!/usr/bin/env node
/**
 * Capture viewport screenshots for visual QA.
 * Usage: node scripts/capture-screenshots.mjs
 */
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const BASE = process.env['SCREENSHOT_BASE'] ?? 'http://127.0.0.1:4173/Commutr/'
const OUT = join(process.cwd(), 'docs/ui/screenshots')

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'iphone-pro-max', width: 430, height: 932 },
  { name: 'ipad-portrait', width: 768, height: 1024 },
  { name: 'ipad-landscape', width: 1024, height: 768 },
  { name: 'desktop-wide', width: 1440, height: 900 },
]

const SCREENS = [
  { path: '?screen=home', file: 'home' },
  { path: '?screen=search', file: 'search' },
  { path: '?screen=post', file: 'post' },
  { path: '?screen=inbox', file: 'messages' },
  { path: '?screen=profile', file: 'profile' },
  { path: '?screen=notifs', file: 'notifications' },
  { path: '?screen=settings', file: 'settings' },
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
  for (const screen of SCREENS) {
    await page.goto(`${BASE}${screen.path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    const filename = `${vp.name}-${screen.file}.png`
    await page.screenshot({ path: join(OUT, filename), fullPage: true })
    console.log('saved', filename)
  }
  await page.close()
}

await browser.close()
console.log('Screenshots saved to', OUT)
