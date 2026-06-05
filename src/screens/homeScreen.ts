import { rideService } from '@/services/rideService'
import { appStore } from '@/app/store'
import { go } from '@/utils/router'
import { renderButton } from '@/components/Button'
import { renderInputField } from '@/components/InputField'
import { renderChip, renderChipRow } from '@/components/Chip'
import { mountTopBar } from '@/components/TopBar'
import { bindRideCardClicks, mountRideCards, renderRideCardSkeleton } from '@/components/RideCard'
import { showEmpty, showError } from '@/components/uiStates'
import type { ScreenRenderContext } from '@/app/screenRegistry'

const POPULAR_ROUTES = [
  { origin: 'London, ON', destination: 'Toronto, ON' },
  { origin: 'Toronto, ON', destination: 'Montréal, QC' },
  { origin: 'Ottawa, ON', destination: 'Montréal, QC' },
]

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function userName(): string {
  return appStore.getState().user?.name?.split(' ')[0] ?? 'there'
}

export function renderHomeScreen({ container }: ScreenRenderContext): void {
  mountTopBar({
    title: `${greeting()}, ${userName()}`,
    subtitle: 'London, ON',
    actions: `<button type="button" class="cm-icon-button" data-go="notifs" aria-label="Notifications">🔔</button>`,
  })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-stack cm-stack--lg">
      <section class="cm-card cm-search-card">
        <h2 class="cm-search-card__title">Where are you going?</h2>
        <div class="cm-grid-2">
          ${renderInputField({ id: 'home-origin', label: 'From', placeholder: 'London, ON', value: 'London, ON' })}
          ${renderInputField({ id: 'home-destination', label: 'To', placeholder: 'Toronto, ON', value: 'Toronto, ON' })}
        </div>
        ${renderChipRow(
          [
            renderChip('Today', { active: true }),
            renderChip('1 seat', { active: true }),
            renderChip('Verified only', {}),
          ].join(''),
        )}
        ${renderButton('Search rides', { variant: 'primary', block: true, action: 'home-search' })}
      </section>

      <section>
        <h3 class="cm-section-title">Popular routes</h3>
        <div class="cm-route-strip">
          ${POPULAR_ROUTES.map((r) =>
            renderChip(`${r.origin.split(',')[0]} → ${r.destination.split(',')[0]}`, {
              action: 'home-route',
              value: `${r.origin}|${r.destination}`,
            }),
          ).join('')}
        </div>
      </section>

      <section>
        <div class="cm-row cm-row--between cm-mb-4">
          <h3 class="cm-section-title" style="margin:0">Today's rides</h3>
          ${renderChip('Verified', {})}
        </div>
        <div id="home-rides" class="cm-card-list">${renderRideCardSkeleton()}${renderRideCardSkeleton()}</div>
      </section>

      <section class="cm-trust-panel">
        <p class="cm-body" style="font-weight:750">ID verified rides available</p>
        <p class="cm-caption cm-muted cm-mt-2">Share trip and SOS tools after your seat is confirmed.</p>
      </section>
    </div>`

  bindHomeEvents(container)
  void loadHomeRides()
}

function bindHomeEvents(container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>('[data-action="home-route"]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const [origin, destination] = (chip.dataset['chipValue'] ?? '').split('|')
      const o = container.querySelector<HTMLInputElement>('#home-origin')
      const d = container.querySelector<HTMLInputElement>('#home-destination')
      if (o && origin) o.value = origin
      if (d && destination) d.value = destination
      go('search')
    })
  })

  container.querySelector('[data-action="home-search"]')?.addEventListener('click', () => {
    go('search')
  })
}

async function loadHomeRides(): Promise<void> {
  const list = document.getElementById('home-rides')
  if (!list) return
  try {
    const rides = await rideService.search({})
    if (rides.length === 0) {
      showEmpty(list, {
        title: 'No rides yet',
        body: 'Create a route alert or post this route.',
        actionLabel: 'Post this route',
        actionGo: 'post',
      })
      return
    }
    mountRideCards(list, rides.slice(0, 5), 'home')
    bindRideCardClicks(list, (id) => {
      appStore.setSelectedRideId(id)
      go('detail')
    })
  } catch {
    showError(list, 'Could not load rides')
  }
}

export function initHomeScreen(): void {
  const container = document.getElementById('appScreen')
  if (container) renderHomeScreen({ container })
}
