import { normalizeStoredTransactions } from '../utils/movements'
import { normalizeCreditCards } from '../utils/creditCards'
import { normalizeGoals } from '../utils/goals'
import { normalizeDebts } from '../utils/debts'
import { assertCanRead, assertCanWrite } from '../utils/auth/permissions'
import { getAdvisorClients } from './firestore/advisorRepository'
import {
  getFinancialData,
  patchFinancialData,
} from './firestore/financialDataRepository'

async function advisorClientIds(actor) {
  if (actor?.role !== 'advisor') return []
  const clients = await getAdvisorClients(actor.uid ?? actor.id)
  return clients.map((c) => c.uid ?? c.id)
}

export async function loadClientFinancialSnapshot(actor, clientId) {
  const clientIds = await advisorClientIds(actor)
  assertCanRead(actor, clientId, clientIds)

  const data = await getFinancialData(clientId)
  return {
    transactions: normalizeStoredTransactions(data.transactions),
    creditCards: normalizeCreditCards(data.creditCards),
    goals: normalizeGoals(data.goals),
    debts: normalizeDebts(data.debts),
  }
}

export async function saveClientTransactions(actor, clientId, transactions) {
  assertCanWrite(actor, clientId)
  await patchFinancialData(clientId, {
    transactions: normalizeStoredTransactions(transactions),
  })
}

export async function saveClientCreditCards(actor, clientId, cards) {
  assertCanWrite(actor, clientId)
  await patchFinancialData(clientId, { creditCards: normalizeCreditCards(cards) })
}

export async function saveClientGoals(actor, clientId, goals) {
  assertCanWrite(actor, clientId)
  await patchFinancialData(clientId, { goals: normalizeGoals(goals) })
}

export async function saveClientDebts(actor, clientId, debts) {
  assertCanWrite(actor, clientId)
  await patchFinancialData(clientId, { debts: normalizeDebts(debts) })
}
