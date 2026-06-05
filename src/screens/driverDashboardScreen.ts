import { getPostedDemoRides } from '@/config/demoData'
import { seatRequestService } from '@/services/seatRequestService'
import { appStore } from '@/app/store'
import { go } from '@/utils/router'
import { renderButton } from '@/components/Button'
import { renderBadge } from '@/components/Badge'
import { renderAvatar } from '@/components/Avatar'
import { mountTopBar } from '@/components/TopBar'
import { mountRideCards, bindRideCardClicks } from '@/components/RideCard'
import { showEmpty } from '@/components/uiStates'
import { showToast } from '@/components/toast'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'
import type { SeatRequest } from '@/contracts/types/SeatRequest'

export function renderDriverDashboardScreen({ container }: ScreenRenderContext): void {
  mountTopBar({ title: 'Driver dashboard', subtitle: 'Your posted rides' })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-stack cm-stack--lg">
      <section class="cm-dashboard-stat-row">
        <div class="cm-card cm-card--pad"><p class="cm-caption cm-muted">This month</p><p class="cm-title-md" id="dash-ride-count">—</p></div>
        <div class="cm-card cm-card--pad"><p class="cm-caption cm-muted">Rating</p><p class="cm-title-md">4.9</p></div>
      </section>

      <section>
        <h3 class="cm-section-title">Pending requests</h3>
        <div id="pending-requests" class="cm-card-list"></div>
      </section>

      <section>
        <h3 class="cm-section-title">Posted rides</h3>
        <div id="posted-rides" class="cm-card-list"></div>
      </section>

      ${renderButton('Post a ride', { variant: 'primary', block: true, go: 'post' })}
    </div>`

  void loadDashboard(container)
}

async function loadDashboard(container: HTMLElement): Promise<void> {
  const pendingEl = container.querySelector('#pending-requests') as HTMLElement
  const postedEl = container.querySelector('#posted-rides') as HTMLElement
  const countEl = container.querySelector('#dash-ride-count')

  const posted = getPostedDemoRides()
  if (countEl) countEl.textContent = `${posted.length} ride${posted.length === 1 ? '' : 's'}`

  let requests: SeatRequest[] = []
  try {
    requests = await seatRequestService.listMine()
  } catch {
    requests = []
  }

  const pending = requests.filter((r) => r.status === 'requested')

  if (pending.length === 0) {
    showEmpty(pendingEl, {
      title: 'No pending requests',
      body: 'New seat requests will appear here when passengers request a seat.',
      actionLabel: 'Post a ride',
      actionGo: 'post',
    })
  } else {
    pendingEl.innerHTML = pending
      .map(
        (r) => `
      <article class="cm-card cm-card--pad">
        <div class="cm-row">
          ${renderAvatar('Passenger')}
          <div style="flex:1">
            <p class="cm-body" style="font-weight:750">Seat request</p>
            <p class="cm-caption cm-muted">${r.requestedSeats} seat · Ride ${escapeHtml(r.rideId)}</p>
          </div>
          ${renderBadge('Pending', 'warning')}
        </div>
        <div class="cm-row cm-mt-4 cm-gap-2">
          ${renderButton('Decline', { variant: 'outline', action: 'decline-request', id: `decline-${r.id}` })}
          ${renderButton('Accept', { variant: 'primary', action: 'accept-request', id: `accept-${r.id}` })}
        </div>
      </article>`,
      )
      .join('')

    pendingEl.querySelectorAll('[data-action="accept-request"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).id.replace('accept-', '')
        void seatRequestService.accept(id).then(() => {
          showToast('Request accepted')
          void loadDashboard(container)
        })
      })
    })
    pendingEl.querySelectorAll('[data-action="decline-request"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).id.replace('decline-', '')
        void seatRequestService.reject(id).then(() => {
          showToast('Request declined')
          void loadDashboard(container)
        })
      })
    })
  }

  if (posted.length === 0) {
    showEmpty(postedEl, {
      title: 'No posted rides',
      body: 'Post your first route and start receiving seat requests.',
      actionLabel: 'Post a ride',
      actionGo: 'post',
    })
  } else {
    mountRideCards(postedEl, posted, 'driver-dashboard')
    bindRideCardClicks(postedEl, (id) => {
      appStore.setSelectedRideId(id)
      go('detail')
    })
  }
}
