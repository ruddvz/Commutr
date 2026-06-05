/**
 * COMMUTR v5 — Application entry point.
 *
 * Responsibilities:
 *   1. Import global styles
 *   2. Bind scroll-aware UI behaviours
 *   3. Expose navigation functions to HTML onclick attributes (during migration)
 *   4. Register the service worker
 */

import './styles/main.css'

import { registerServiceWorker } from './utils/pwa'
import { go, updateNavState } from './utils/router'
import { bindScrollMorph, bindScrollAwareTabbars } from './components/navigation'
import { showToast } from './components/toast'
import { setStar, submitRating } from './components/starRating'
import { showOTP, otpMove } from './components/otpInput'
import { chipSel, segSel, stepChg } from './components/chipSelector'
import { addEmoji, sendMsg, bindMessageButtons } from './components/chat'

// ─── Onboarding ────────────────────────────────────────────────────────────
let obIndex = 0
const OB_COUNT = 3

function updateOnboarding(): void {
  const slider = document.getElementById('ob-slider') as HTMLElement | null
  const dots = Array.from(document.querySelectorAll<HTMLElement>('.obdot'))
  if (slider) slider.style.transform = `translateX(-${(obIndex / OB_COUNT) * 100}%)`
  dots.forEach((d, i) => d.classList.toggle('on', i === obIndex))
}

function obNext(): void {
  if (obIndex < OB_COUNT - 1) {
    obIndex++
    updateOnboarding()
  } else {
    go('home')
  }
}

// ─── Global function surface (for onclick= attributes in index.html) ────────
// These will be replaced by event-listener wiring in a future refactor.
declare global {
  interface Window {
    go: typeof go
    obNext: typeof obNext
    showOTP: typeof showOTP
    otpMove: typeof otpMove
    chipSel: typeof chipSel
    stepChg: typeof stepChg
    showToast: typeof showToast
    setStar: typeof setStar
    submitRating: typeof submitRating
    addEmoji: typeof addEmoji
    sendMsg: typeof sendMsg
    segSel: typeof segSel
  }
}

window.go = go
window.obNext = obNext
window.showOTP = showOTP
window.otpMove = otpMove
window.chipSel = chipSel
window.stepChg = stepChg
window.showToast = showToast
window.setStar = setStar
window.submitRating = submitRating
window.addEmoji = addEmoji
window.sendMsg = sendMsg
window.segSel = segSel

// ─── Initialization ─────────────────────────────────────────────────────────
function init(): void {
  updateOnboarding()
  updateNavState('ob')
  go('ob')
  bindScrollMorph()
  bindScrollAwareTabbars()
  bindMessageButtons()
}

document.addEventListener('DOMContentLoaded', init)

registerServiceWorker()
