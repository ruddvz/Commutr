/**
 * Date / time / currency formatters for Canadian locale.
 */

const DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

const TIME_FORMAT = new Intl.DateTimeFormat('en-CA', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

const CAD_FORMAT = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatDate(date: Date | string): string {
  return DATE_FORMAT.format(new Date(date))
}

export function formatTime(date: Date | string): string {
  return TIME_FORMAT.format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} · ${formatTime(date)}`
}

export function formatCAD(amount: number): string {
  return CAD_FORMAT.format(amount)
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}
