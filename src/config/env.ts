/**
 * Client-side environment config loader.
 * Vite exposes VITE_* env vars on import.meta.env.
 */

export const env = {
  apiUrl: (import.meta.env['VITE_API_URL'] as string | undefined) ?? '/api',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
