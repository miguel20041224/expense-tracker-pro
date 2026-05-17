import { readStorage } from '../../utils/storage'
import {
  FINANCE_KEY_PREFIX,
  LEGACY_FINANCE_KEYS,
} from '../../utils/auth/constants'
import { getFinancialData, setFinancialData } from './financialDataRepository'

const MIGRATION_FLAG_PREFIX = 'fintrack-migrated-'

function migrationFlagKey(uid) {
  return `${MIGRATION_FLAG_PREFIX}${uid}`
}

function hasMigrated(uid) {
  try {
    return localStorage.getItem(migrationFlagKey(uid)) === 'true'
  } catch {
    return false
  }
}

function setMigrated(uid) {
  try {
    localStorage.setItem(migrationFlagKey(uid), 'true')
  } catch {
    /* ignore */
  }
}

function readLegacyFinanceForUser(uid) {
  const result = {
    transactions: [],
    creditCards: [],
    goals: [],
    debts: [],
  }

  const sources = [
    { key: 'transactions', legacy: LEGACY_FINANCE_KEYS.transactions, scoped: `${FINANCE_KEY_PREFIX.transactions}-${uid}` },
    { key: 'creditCards', legacy: LEGACY_FINANCE_KEYS.creditCards, scoped: `${FINANCE_KEY_PREFIX.creditCards}-${uid}` },
    { key: 'goals', legacy: LEGACY_FINANCE_KEYS.goals, scoped: `${FINANCE_KEY_PREFIX.goals}-${uid}` },
    { key: 'debts', legacy: LEGACY_FINANCE_KEYS.debts, scoped: `${FINANCE_KEY_PREFIX.debts}-${uid}` },
  ]

  for (const { key, legacy, scoped } of sources) {
    const scopedData = readStorage(scoped, null)
    if (Array.isArray(scopedData) && scopedData.length > 0) {
      result[key] = scopedData
      continue
    }
    const legacyData = readStorage(legacy, null)
    if (Array.isArray(legacyData) && legacyData.length > 0) {
      result[key] = legacyData
    }
  }

  return result
}

function hasAnyData(data) {
  return (
    data.transactions.length > 0
    || data.creditCards.length > 0
    || data.goals.length > 0
    || data.debts.length > 0
  )
}

/** Migra localStorage → Firestore (proyecto fintrack) una sola vez por usuario. */
export async function migrateLocalDataToFirestore(uid) {
  if (!uid || hasMigrated(uid)) return false

  const existing = await getFinancialData(uid)
  const alreadyInCloud = hasAnyData(existing)
  const local = readLegacyFinanceForUser(uid)

  if (!hasAnyData(local)) {
    setMigrated(uid)
    return false
  }

  if (alreadyInCloud) {
    setMigrated(uid)
    return false
  }

  await setFinancialData(uid, {
    transactions: local.transactions,
    creditCards: local.creditCards,
    goals: local.goals,
    debts: local.debts,
  })

  setMigrated(uid)
  return true
}
