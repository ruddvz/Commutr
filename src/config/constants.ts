import type { ScreenId } from '@/utils/router'

export const SCREEN_IDS_LIST: ScreenId[] = [
  'ob',
  'signup',
  'home',
  'search',
  'post',
  'detail',
  'chat',
  'inbox',
  'profile',
  'dashboard',
  'notifs',
  'history',
  'settings',
  'sos',
  'sub',
]

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const CANADIAN_CITIES = [
  'Toronto',
  'Montreal',
  'Vancouver',
  'Calgary',
  'Edmonton',
  'Ottawa',
  'Winnipeg',
  'Quebec City',
  'Hamilton',
  'Kitchener',
  'London',
  'Halifax',
  'Victoria',
  'Saskatoon',
  'Regina',
  'Kelowna',
  'Barrie',
  'Windsor',
  'Kingston',
  'Guelph',
] as const

export const RIDE_AMENITIES = [
  'Music',
  'AC',
  'Pet-friendly',
  'Luggage',
  'No smoking',
  'EV',
  'WiFi',
  'Snacks',
  'Child seat',
] as const

export const MAX_SEATS = 8
export const MAX_PRICE_PER_SEAT = 200
