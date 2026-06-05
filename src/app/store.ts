import { storageGet, storageSet } from '@/utils/storage'
export interface AppUser {
  id: string
  name: string
  email: string
  verified?: boolean
  verifiedId?: boolean
  ratingAvg?: number
  ratingCount?: number
  role?: string
}

interface AppState {
  user: AppUser | null
  recentSearches: Array<{ origin: string; destination: string; date?: string }>
  selectedRideId: string | null
  useFixtures: boolean
}

const STATE_KEY = 'commutr_app_state_v1'

const defaultState: AppState = {
  user: null,
  recentSearches: [],
  selectedRideId: null,
  useFixtures: import.meta.env.VITE_USE_FIXTURES === 'true',
}

let state: AppState = { ...defaultState, ...(storageGet<AppState>(STATE_KEY) ?? {}) }

function persist(): void {
  storageSet(STATE_KEY, {
    recentSearches: state.recentSearches,
    selectedRideId: state.selectedRideId,
  })
}

export const appStore = {
  getState(): AppState {
    return state
  },

  setUser(user: AppUser | null): void {
    state = { ...state, user }
    persist()
  },

  addRecentSearch(entry: { origin: string; destination: string; date?: string }): void {
    const filtered = state.recentSearches.filter(
      (s) => s.origin !== entry.origin || s.destination !== entry.destination,
    )
    state = { ...state, recentSearches: [entry, ...filtered].slice(0, 8) }
    persist()
  },

  setSelectedRideId(id: string | null): void {
    state = { ...state, selectedRideId: id }
    persist()
  },

  getSelectedRideId(): string | null {
    return state.selectedRideId
  },
}
