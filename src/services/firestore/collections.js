export const COLLECTIONS = {
  users: 'users',
  financialData: 'financialData',
}

export const EMPTY_FINANCIAL_DATA = {
  transactions: [],
  creditCards: [],
  goals: [],
  debts: [],
  income: { type: 'monthly', amount: 0 },
  budget: { limit: 0, remaining: 0 },
  intelligenceCache: {
    dismissedAlerts: {},
    lastSeenAt: null,
  },
}
