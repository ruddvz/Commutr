#!/usr/bin/env node
/**
 * Converts inline onclick="go('screen')" to data-go="screen" for event delegation.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const path = new URL('../index.html', import.meta.url)
let html = readFileSync(path, 'utf8')

html = html.replace(/onclick="go\('([^']+)'\)"/g, 'data-go="$1"')
html = html.replace(/onclick="go\("([^"]+)"\)"/g, 'data-go="$1"')
html = html.replace(/onclick="finishOnboarding\(\)"/g, 'data-action="ob-finish"')
html = html.replace(/onclick="obNext\(\)"/g, 'data-action="ob-next"')
html = html.replace(/onclick="showOTP\(\)"/g, 'data-action="show-otp"')

writeFileSync(path, html)
console.warn('Migrated index.html onclick handlers to data-* attributes')
