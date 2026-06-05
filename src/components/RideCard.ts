import { escapeHtml } from '@/utils/dom'
import { formatCAD } from '@/utils/format'
import type { Ride } from '@/contracts/types/Ride'
import { renderAvatar } from './Avatar'
import { renderBadge } from './Badge'
import { renderRouteTimeline } from './RouteTimeline'
import { renderButton } from './Button'

export type RideCardContext = 'home' | 'search' | 'profile' | 'driver-dashboard'
export type RideCardAction = 'details' | 'message' | 'request-seat' | 'manage'

export type RideCardProps = {
  ride: Ride
  compact?: boolean
  context?: RideCardContext
  primaryAction?: RideCardAction
}

function seatsLabel(available: number): string {
  if (available === 1) return '1 seat left'
  return `${available} seats left`
}

function actionLabel(action: RideCardAction): string {
  switch (action) {
    case 'message':
      return 'Message driver'
    case 'request-seat':
      return 'Request seat'
    case 'manage':
      return 'Manage ride'
    default:
      return 'View details'
  }
}

export function renderRideCard(props: RideCardProps): string {
  const { ride, primaryAction = 'details', compact, context = 'search' } = props
  const isCompact = compact ?? context === 'home'
  const rating = ride.driverRating > 0 ? `${ride.driverRating.toFixed(1)} · Verified` : 'New driver'

  if (isCompact) {
    const time = new Date(ride.departureAt).toLocaleTimeString('en-CA', {
      hour: 'numeric',
      minute: '2-digit',
    })
    const pickup = ride.stops[0] ?? ride.origin
    const dropoff = ride.stops[1] ?? ride.destination
    return `
    <article class="cm-card cm-ride-card cm-ride-card--compact" data-ride-id="${escapeHtml(ride.id)}" data-action="open-ride" tabindex="0">
      <div class="cm-ride-card__compact-top">
        <span class="cm-caption">${escapeHtml(time)}</span>
        <span class="cm-ride-card__route">${escapeHtml(ride.origin.split(',')[0] ?? ride.origin)} → ${escapeHtml(ride.destination.split(',')[0] ?? ride.destination)}</span>
        <span class="cm-ride-card__price">${escapeHtml(formatCAD(ride.pricePerSeat))}</span>
      </div>
      <div class="cm-ride-card__driver cm-mt-2">
        ${renderAvatar(ride.driverName)}
        <div>
          <div class="cm-body" style="font-weight:750">${escapeHtml(ride.driverName)} · ${escapeHtml(rating)}</div>
          <div class="cm-caption cm-muted">${escapeHtml(pickup)} → ${escapeHtml(dropoff)}</div>
          <div class="cm-caption cm-muted">${escapeHtml(seatsLabel(ride.seatsAvailable))}${ride.notes ? ` · ${escapeHtml(ride.notes.split('·')[0]?.trim() ?? '')}` : ''}</div>
        </div>
      </div>
      <div class="cm-ride-card__actions">
        ${renderButton('Request seat', { variant: 'primary', action: 'open-ride' })}
        ${renderButton('Details', { variant: 'secondary', action: 'open-ride' })}
      </div>
    </article>`
  }

  const badges = [
    renderBadge(seatsLabel(ride.seatsAvailable), 'brand'),
    ride.driverVerified ? renderBadge('ID verified', 'success') : '',
    ride.amenities.includes('eco') ? renderBadge('Lower CO₂', 'default') : '',
    ride.amenities.some((a) => a.toLowerCase().includes('women'))
      ? renderBadge('Women-preferred', 'warning')
      : '',
  ]
    .filter(Boolean)
    .join('')

  const timeline = renderRouteTimeline({
    origin: ride.origin,
    destination: ride.destination,
    departureAt: ride.departureAt,
  })

  return `
    <article class="cm-card cm-ride-card" data-ride-id="${escapeHtml(ride.id)}" data-action="open-ride" tabindex="0">
      <div class="cm-ride-card__header">
        <div class="cm-ride-card__driver">
          ${renderAvatar(ride.driverName)}
          <div>
            <div class="cm-body" style="font-weight:750">${escapeHtml(ride.driverName)}</div>
            <div class="cm-caption cm-muted">${escapeHtml(rating)}</div>
          </div>
        </div>
        <div class="cm-ride-card__price">
          ${escapeHtml(formatCAD(ride.pricePerSeat))}
          <span class="cm-ride-card__price-unit"> / seat</span>
        </div>
      </div>
      ${timeline}
      <div class="cm-chip-row cm-mt-4">${badges}</div>
      <div class="cm-ride-card__actions">
        ${renderButton(actionLabel(primaryAction), { variant: 'primary', action: 'open-ride' })}
        ${renderButton('View details', { variant: 'outline', action: 'open-ride' })}
      </div>
    </article>`
}

export function mountRideCards(
  container: HTMLElement,
  rides: Ride[],
  context: RideCardContext = 'search',
): void {
  container.innerHTML = rides
    .map((ride) =>
      renderRideCard({ ride, context, primaryAction: context === 'home' ? 'details' : 'message' }),
    )
    .join('')
}

export function bindRideCardClicks(
  container: HTMLElement,
  onSelect: (rideId: string) => void,
): void {
  container.querySelectorAll<HTMLElement>('[data-ride-id]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.cm-button')) {
        e.stopPropagation()
      }
      const id = el.dataset['rideId']
      if (id) onSelect(id)
    })
  })
}

export function renderRideCardSkeleton(): string {
  return `<div class="cm-card cm-skeleton cm-skeleton-card" aria-hidden="true"></div>`
}
