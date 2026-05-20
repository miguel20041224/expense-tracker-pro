import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, isFirebaseReady } from '../../firebase'
import { COLLECTIONS, EMPTY_FINANCIAL_DATA } from './collections'
import { normalizeIncomeConfig, buildBudgetSnapshot } from '../../utils/incomeBudget'
import { normalizeStoredTransactions } from '../../utils/movements'

function financialRef(uid) {
  if (!isFirebaseReady() || !db) {
    throw new Error('Firestore no está disponible. Revisa src/config/firebase.config.js.')
  }
  return doc(db, COLLECTIONS.financialData, uid)
}

export function normalizeFinancialDoc(data) {
  const transactions = normalizeStoredTransactions(data?.transactions ?? [])
  const income = normalizeIncomeConfig(data?.income)
  const budgetSnapshot = buildBudgetSnapshot(transactions, income)

  return {
    uid: data?.uid,
    transactions,
    creditCards: data?.creditCards ?? [],
    goals: data?.goals ?? [],
    debts: data?.debts ?? [],
    income,
    budget: {
      limit: data?.budget?.limit ?? budgetSnapshot.limit,
      remaining: budgetSnapshot.remaining,
    },
    intelligenceCache: {
      dismissedAlerts: data?.intelligenceCache?.dismissedAlerts ?? {},
      lastSeenAt: data?.intelligenceCache?.lastSeenAt ?? null,
    },
  }
}

export async function getFinancialData(uid) {
  const snap = await getDoc(financialRef(uid))
  if (!snap.exists()) return { uid, ...EMPTY_FINANCIAL_DATA }
  return normalizeFinancialDoc(snap.data())
}

export async function ensureFinancialDataDoc(uid) {
  const ref = financialRef(uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { uid, ...EMPTY_FINANCIAL_DATA })
    return { uid, ...EMPTY_FINANCIAL_DATA }
  }
  return normalizeFinancialDoc(snap.data())
}

export function subscribeFinancialData(uid, callback) {
  if (!uid) return () => {}

  return onSnapshot(
    financialRef(uid),
    (snap) => {
      if (!snap.exists()) {
        callback({ uid, ...EMPTY_FINANCIAL_DATA })
        return
      }
      callback(normalizeFinancialDoc(snap.data()))
    },
    (error) => {
      console.error('Error en suscripción financialData:', error)
      callback({ uid, ...EMPTY_FINANCIAL_DATA })
    },
  )
}

export async function patchFinancialData(uid, partial) {
  await setDoc(financialRef(uid), { uid, ...partial }, { merge: true })
}

export async function setFinancialData(uid, data) {
  await setDoc(financialRef(uid), { uid, ...EMPTY_FINANCIAL_DATA, ...data })
}
