import { readStorage, writeStorage } from '../storage'
import { LEGACY_FINANCE_KEYS, FINANCE_KEY_PREFIX } from './constants'

function hasLegacyData() {
  return Object.values(LEGACY_FINANCE_KEYS).some((key) => {
    try {
      return localStorage.getItem(key) != null
    } catch {
      return false
    }
  })
}

function scopedKey(kind, userId) {
  return `${FINANCE_KEY_PREFIX[kind]}-${userId}`
}

/** Migra datos anónimos previos al primer inicio de sesión del cliente. */
export function migrateLegacyFinanceDataToUser(userId) {
  if (!userId || !hasLegacyData()) return false

  const kinds = Object.keys(LEGACY_FINANCE_KEYS)
  let migrated = false

  for (const kind of kinds) {
    const legacyKey = LEGACY_FINANCE_KEYS[kind]
    const targetKey = scopedKey(kind, userId)
    const existing = readStorage(targetKey, null)
    if (existing != null) continue

    try {
      const raw = localStorage.getItem(legacyKey)
      if (raw == null) continue
      const parsed = JSON.parse(raw)
      writeStorage(targetKey, parsed)
      migrated = true
    } catch {
      /* omitir clave corrupta */
    }
  }

  return migrated
}
