/**
 * COMMUTR v5 — Application entry point.
 */

import './styles/main.css'

import { registerServiceWorker, initPwaUpdateToast } from './utils/pwa'
import { go, getInitialScreen, updateNavState, markOnboardingComplete } from './utils/router'
import { bindGlobalDelegation } from './app/delegation'
import { initOnboarding } from './screens/onboardingScreen'
import { registerAllScreens } from './app/registerScreens'
import { initAppShell } from './components/AppShell'
import { initErrorBoundary } from './components/ErrorBoundary'
import { authService } from './services/authService'
import { appStore } from './app/store'
import { bindMessageButtons } from './components/chat'
import { mountOfflineBanner } from './components/uiStates'
import { runtimeMode } from './config/runtime'

function init(): void {
  document.documentElement.setAttribute('data-theme', 'dark')
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console -- dev runtime mode indicator
    console.info('[Commutr] runtime mode:', runtimeMode)
  }

  initErrorBoundary()
  initAppShell()
  registerAllScreens()
  bindGlobalDelegation()
  mountOfflineBanner()
  initOnboarding()

  const initial = getInitialScreen()
  updateNavState(initial)

  if (!authService.isAuthenticated()) {
    const guest = authService.continueAsGuest()
    appStore.setUser({
      id: guest.id,
      name: guest.name,
      email: guest.email,
      verified: guest.verified,
    })
    markOnboardingComplete()
  }

  go(initial)

  if (authService.isAuthenticated() && !authService.isDemoGuest()) {
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
initPwaUpdateToast()
