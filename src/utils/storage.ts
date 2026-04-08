/**
 * Type-safe localStorage wrapper.
 */

export function storageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn(`localStorage.setItem failed for key: ${key}`)
  }
}

export function storageRemove(key: string): void {
  localStorage.removeItem(key)
}

export function storageClear(): void {
  localStorage.clear()
}
