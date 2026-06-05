export type RuntimeMode = 'local-api' | 'production-api' | 'static-demo'

const isGithubPages = typeof location !== 'undefined' && location.hostname.endsWith('github.io')

const apiBase = import.meta.env['VITE_API_BASE_URL'] as string | undefined

export const runtimeMode: RuntimeMode = apiBase
  ? 'production-api'
  : isGithubPages
    ? 'static-demo'
    : 'local-api'

export const isStaticDemo = runtimeMode === 'static-demo'

export function apiBaseUrl(): string {
  if (apiBase) return apiBase.replace(/\/$/, '')
  return import.meta.env['VITE_API_URL'] ?? '/api'
}
