import { normalizeStoredTransactions } from '../utils/movements'
import { normalizeCreditCards } from '../utils/creditCards'
import { normalizeGoals } from '../utils/goals'
import { normalizeDebts } from '../utils/debts'
import { assertCanWrite } from '../utils/auth/permissions'
import { getFinancialData, patchFinancialData } from './firestore/financialDataRepository'
import { buildBudgetSnapshot, normalizeIncomeConfig } from '../utils/incomeBudget'

export async function saveUserIncome(actor, userId, income) {
  assertCanWrite(actor, userId)
  const normalized = normalizeIncomeConfig(income)
  const data = await getFinancialData(userId)
  const budget = buildBudgetSnapshot(data.transactions, normalized)
  await patchFinancialData(userId, { income: normalized, budget })
}

export async function saveUserTransactions(actor, userId, transactions) {
  assertCanWrite(actor, userId)
  await patchFinancialData(userId, {
    transactions: normalizeStoredTransactions(transactions),
  })
}

export async function saveUserCreditCards(actor, userId, cards) {
  assertCanWrite(actor, userId)
  await patchFinancialData(userId, { creditCards: normalizeCreditCards(cards) })
}

export async function saveUserGoals(actor, userId, goals) {
  assertCanWrite(actor, userId)
  await patchFinancialData(userId, { goals: normalizeGoals(goals) })
}

export async function saveUserDebts(actor, userId, debts) {
  assertCanWrite(actor, userId)
  await patchFinancialData(userId, { debts: normalizeDebts(debts) })
}

/** @deprecated Usar saveUser* — alias para migración gradual de hooks */
export const saveClientIncome = saveUserIncome
export const saveClientTransactions = saveUserTransactions
export const saveClientCreditCards = saveUserCreditCards
export const saveClientGoals = saveUserGoals
export const saveClientDebts = saveUserDebts
