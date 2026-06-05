import { API_BASE_URL } from '@/config/constants'

export type ApiSuccess<T> = { data: T; meta?: Record<string, unknown> }

export type ApiErrorBody = {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string = 'INTERNAL_ERROR',
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const REQUEST_TIMEOUT_MS = 15_000

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('commutr_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init?.headers,
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    })

    if (res.status === 401) {
      localStorage.removeItem('commutr_token')
    }

    const body = (await res.json().catch(() => null)) as ApiSuccess<T> | ApiErrorBody | null

    if (!res.ok) {
      const errBody = body as ApiErrorBody | null
      const message = errBody?.error?.message ?? res.statusText
      const code = errBody?.error?.code ?? 'INTERNAL_ERROR'
      throw new ApiError(res.status, message, code)
    }

    if (body && typeof body === 'object' && 'data' in body) {
      return (body as ApiSuccess<T>).data
    }

    return body as T
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(408, 'Request timed out', 'INTERNAL_ERROR')
    }
    if (!navigator.onLine) {
      throw new ApiError(0, 'You appear to be offline', 'INTERNAL_ERROR')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
