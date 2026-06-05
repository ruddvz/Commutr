/**
 * COMMUTR v5 — Application entry point.
 */

import './styles/main.css'

import { registerServiceWorker } from './utils/pwa'
import { go, getInitialScreen, updateNavState } from './utils/router'
import { bindGlobalDelegation } from './app/delegation'
import { initOnboarding } from './screens/onboardingScreen'
import { registerAllScreens } from './app/registerScreens'
import { initAppShell } from './components/AppShell'
import { authService } from './services/authService'
import { appStore } from './app/store'
import { bindMessageButtons } from './components/chat'
import { mountOfflineBanner } from './components/uiStates'

function init(): void {
  document.documentElement.setAttribute('data-theme', 'system')

  initAppShell()
  registerAllScreens()
  bindGlobalDelegation()
  mountOfflineBanner()
  initOnboarding()

  const initial = getInitialScreen()
  updateNavState(initial)
  go(initial)

  if (authService.isAuthenticated()) {
    void authService
      .fetchMe()
      .then((user) => {
        appStore.setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          verified: user.verified,
          ratingAvg: (user as { ratingAvg?: number }).ratingAvg,
          ratingCount: (user as { ratingCount?: number }).ratingCount,
          role: (user as { role?: string }).role,
        })
      })
      .catch(() => {
        void authService.logout()
      })
  }

  bindMessageButtons()
}

document.addEventListener('DOMContentLoaded', init)
registerServiceWorker()
