import { escapeHtml } from '@/utils/dom'
import { formatTime } from '@/utils/format'

export function renderRouteTimeline(opts: {
  origin: string
  destination: string
  originDetail?: string
  destinationDetail?: string
  departureAt: string
  arrivalAt?: string
}): string {
  const depTime = formatTime(opts.departureAt)
  const arrTime = opts.arrivalAt ? formatTime(opts.arrivalAt) : ''
  return `
    <div class="cm-route-timeline" role="list">
      <div class="cm-route-timeline__dot" aria-hidden="true"></div>
      <div role="listitem">
        <div class="cm-route-timeline__time">${escapeHtml(depTime)}</div>
        <div class="cm-route-timeline__place">${escapeHtml(opts.origin)}</div>
        ${opts.originDetail ? `<div class="cm-route-timeline__detail">${escapeHtml(opts.originDetail)}</div>` : ''}
      </div>
      <div class="cm-route-timeline__line" aria-hidden="true"></div>
      <div aria-hidden="true"></div>
      <div class="cm-route-timeline__dot cm-route-timeline__dot--end" aria-hidden="true"></div>
      <div role="listitem">
        <div class="cm-route-timeline__time">${arrTime ? escapeHtml(arrTime) : '—'}</div>
        <div class="cm-route-timeline__place">${escapeHtml(opts.destination)}</div>
        ${opts.destinationDetail ? `<div class="cm-route-timeline__detail">${escapeHtml(opts.destinationDetail)}</div>` : ''}
      </div>
    </div>`
}
