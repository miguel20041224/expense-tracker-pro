import { readStorage, writeStorage } from './storage'
import { FINANCE_KEY_PREFIX } from './auth/constants'

export function financeStorageKey(kind, userId) {
  if (!userId) return null
  return `${FINANCE_KEY_PREFIX[kind]}-${userId}`
}

export function readClientFinance(kind, userId, fallback) {
  const key = financeStorageKey(kind, userId)
  if (!key) return fallback
  return readStorage(key, fallback)
}

export function writeClientFinance(kind, userId, value) {
  const key = financeStorageKey(kind, userId)
  if (!key) return
  writeStorage(key, value)
}
