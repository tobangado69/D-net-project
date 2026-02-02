export const API_BASE_URL = 'http://localhost:3001'

export const PACKAGE_CATEGORIES = [
  { value: 'all', label: 'Semua Paket' },
  { value: 'starter', label: 'Starter' },
  { value: 'regular', label: 'Regular' },
  { value: 'premium', label: 'Premium' },
  { value: 'unlimited', label: 'Unlimited' },
  { value: 'special', label: 'Special' }
]

export const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Harga: Terendah' },
  { value: 'price-desc', label: 'Harga: Tertinggi' },
  { value: 'quota-desc', label: 'Data: Terbanyak' },
  { value: 'quota-asc', label: 'Data: Tersedikit' },
  { value: 'validity-desc', label: 'Durasi: Terpanjang' },
  { value: 'validity-asc', label: 'Durasi: Terpendek' }
]

export const TRANSACTION_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

export const PHONE_LINE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
}

export const DEFAULT_ERROR_MESSAGE = 'Terjadi kesalahan. Silakan coba lagi.'

export const DEMO_CREDENTIALS = {
  username: 'demo',
  password: 'demo'
}

export default {
  API_BASE_URL,
  PACKAGE_CATEGORIES,
  SORT_OPTIONS,
  TRANSACTION_STATUS,
  PHONE_LINE_STATUS,
  DEFAULT_ERROR_MESSAGE,
  DEMO_CREDENTIALS
}
