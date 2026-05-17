import { createTransactionId } from './movements'

export function createDebtId() {
  return createTransactionId()
}

export function createDebt({ name, balance, interestRate, minPayment }) {
  return {
    id: createDebtId(),
    name: name.trim(),
    balance: Math.abs(Number(balance) || 0),
    interestRate:
      interestRate === '' || interestRate == null
        ? null
        : Math.max(0, Number(interestRate) || 0),
    minPayment: Math.abs(Number(minPayment) || 0),
    createdAt: new Date().toISOString(),
  }
}

export function normalizeDebt(debt) {
  if (!debt || typeof debt !== 'object') return null
  if (!debt.id || !debt.name) return null

  return {
    ...debt,
    name: String(debt.name).trim(),
    balance: Math.max(0, Number(debt.balance) || 0),
    interestRate:
      debt.interestRate == null || debt.interestRate === ''
        ? null
        : Math.max(0, Number(debt.interestRate) || 0),
    minPayment: Math.max(0, Number(debt.minPayment) || 0),
  }
}

export function normalizeDebts(debts) {
  if (!Array.isArray(debts)) return []
  return debts.map(normalizeDebt).filter(Boolean)
}

/** Orden bola de nieve: de menor a mayor saldo pendiente. */
export function sortDebtsSnowball(debts) {
  return [...debts]
    .filter((d) => d.balance > 0)
    .sort((a, b) => a.balance - b.balance)
}

export function getTotalMinimumPayments(debts) {
  return debts.reduce((sum, d) => sum + d.minPayment, 0)
}

/**
 * Simulación educativa del método bola de nieve.
 * No incluye intereses compuestos detallados; solo estimación mensual.
 */
export function simulateSnowballPayoff(debts, extraMonthlyPayment = 0) {
  const ordered = sortDebtsSnowball(debts)
  if (ordered.length === 0) {
    return { months: 0, steps: [], totalPaid: 0 }
  }

  const working = ordered.map((d) => ({
    id: d.id,
    name: d.name,
    balance: d.balance,
    minPayment: d.minPayment,
    interestRate: d.interestRate,
  }))

  const steps = []
  let months = 0
  let totalPaid = 0
  const maxMonths = 600

  while (working.some((d) => d.balance > 0.01) && months < maxMonths) {
    months += 1
    let snowballExtra = Math.max(0, Number(extraMonthlyPayment) || 0)

    for (let i = 0; i < working.length; i += 1) {
      const debt = working[i]
      if (debt.balance <= 0) continue

      const interest =
        debt.interestRate != null
          ? (debt.balance * (debt.interestRate / 100)) / 12
          : 0

      debt.balance += interest

      const isPriority = working.findIndex((d) => d.balance > 0) === i
      const payment = debt.minPayment + (isPriority ? snowballExtra : 0)
      const applied = Math.min(payment, debt.balance)

      debt.balance -= applied
      totalPaid += applied

      if (isPriority) snowballExtra = Math.max(payment - debt.minPayment - applied, 0)

      if (debt.balance <= 0.01) {
        debt.balance = 0
        const existing = steps.find((s) => s.debtId === debt.id)
        if (!existing) {
          steps.push({
            debtId: debt.id,
            name: debt.name,
            paidOffMonth: months,
          })
        }
      }
    }
  }

  return {
    months,
    steps,
    totalPaid,
    orderedIds: ordered.map((d) => d.id),
  }
}

export function buildSnowballRecommendation(debts, extraMonthlyPayment = 0) {
  const ordered = sortDebtsSnowball(debts)
  const priority = ordered[0] ?? null
  const simulation = simulateSnowballPayoff(debts, extraMonthlyPayment)
  const totalMinimum = getTotalMinimumPayments(debts)
  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0)

  return {
    ordered,
    priority,
    simulation,
    totalMinimum,
    totalBalance,
  }
}
