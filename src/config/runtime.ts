import { storageGet, storageSet, storageRemove } from '@/utils/storage'

export type RuntimeMode = 'local-api' | 'production-api' | 'static-demo'

const DEMO_MODE_KEY = 'commutr_demo_mode'

const isGithubPages = typeof location !== 'undefined' && location.hostname.endsWith('github.io')

const apiBase = import.meta.env['VITE_API_BASE_URL'] as string | undefined
const forceDemo = import.meta.env['VITE_DEMO_MODE'] === 'true'

export const runtimeMode: RuntimeMode = apiBase
  ? 'production-api'
  : isGithubPages || forceDemo
    ? 'static-demo'
    : 'local-api'

export const isStaticDemo = runtimeMode === 'static-demo'

export function isDemoExperience(): boolean {
  if (isStaticDemo) return true
  return storageGet<boolean>(DEMO_MODE_KEY) === true
}

export function setDemoExperience(enabled: boolean): void {
  if (enabled) storageSet(DEMO_MODE_KEY, true)
  else storageRemove(DEMO_MODE_KEY)
}

export function apiBaseUrl(): string {
  if (apiBase) return apiBase.replace(/\/$/, '')
  return import.meta.env['VITE_API_URL'] ?? '/api'
}

const HEALTH_TIMEOUT_MS = 3000

/** Detect unavailable API and enable demo experience (local preview, offline, GitHub Pages). */
export async function detectDemoMode(): Promise<boolean> {
  if (isStaticDemo || forceDemo) {
    setDemoExperience(true)
    return true
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS)
  try {
    const res = await fetch(`${apiBaseUrl()}/health`, { signal: controller.signal })
    if (!res.ok) {
      setDemoExperience(true)
      return true
    }
    setDemoExperience(false)
    return false
  } catch {
    setDemoExperience(true)
    return true
  } finally {
    clearTimeout(timeout)
  }
}
