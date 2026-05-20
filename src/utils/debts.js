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

/** Avalancha: mayor tasa de interés primero; empate por menor saldo. */
export function sortDebtsAvalanche(debts) {
  return [...debts]
    .filter((d) => d.balance > 0)
    .sort((a, b) => {
      const rateA = a.interestRate ?? 0
      const rateB = b.interestRate ?? 0
      if (rateB !== rateA) return rateB - rateA
      return a.balance - b.balance
    })
}

export function getTotalMinimumPayments(debts) {
  return debts.reduce((sum, d) => sum + d.minPayment, 0)
}

/**
 * Simulación mensual de pago de deudas.
 * @param {Array} debts
 * @param {number} extraMonthlyPayment
 * @param {(debts: Array) => Array} sortFn
 */
export function simulateDebtPayoff(debts, extraMonthlyPayment = 0, sortFn = sortDebtsSnowball) {
  const ordered = sortFn(debts)
  if (ordered.length === 0) {
    return {
      months: 0,
      steps: [],
      totalPaid: 0,
      totalInterest: 0,
      timeline: [],
      orderedIds: [],
    }
  }

  const working = ordered.map((d) => ({
    id: d.id,
    name: d.name,
    balance: d.balance,
    minPayment: d.minPayment,
    interestRate: d.interestRate,
  }))

  const steps = []
  const timeline = []
  let months = 0
  let totalPaid = 0
  let totalInterest = 0
  const maxMonths = 600

  const initialBalance = working.reduce((sum, d) => sum + d.balance, 0)
  timeline.push({ month: 0, totalBalance: initialBalance, label: 'Hoy' })

  while (working.some((d) => d.balance > 0.01) && months < maxMonths) {
    months += 1
    let snowballExtra = Math.max(0, Number(extraMonthlyPayment) || 0)
    let monthInterest = 0

    for (let i = 0; i < working.length; i += 1) {
      const debt = working[i]
      if (debt.balance <= 0) continue

      const interest =
        debt.interestRate != null
          ? (debt.balance * (debt.interestRate / 100)) / 12
          : 0

      debt.balance += interest
      monthInterest += interest
      totalInterest += interest

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
            interestPaid: monthInterest,
          })
        }
      }
    }

    const totalBalance = working.reduce((sum, d) => sum + Math.max(0, d.balance), 0)
    timeline.push({
      month: months,
      totalBalance,
      label: `Mes ${months}`,
      interestThisMonth: monthInterest,
    })
  }

  return {
    months,
    steps,
    totalPaid,
    totalInterest,
    timeline,
    orderedIds: ordered.map((d) => d.id),
  }
}

/** @deprecated Usar simulateDebtPayoff */
export function simulateSnowballPayoff(debts, extraMonthlyPayment = 0) {
  return simulateDebtPayoff(debts, extraMonthlyPayment, sortDebtsSnowball)
}

export function buildSnowballRecommendation(debts, extraMonthlyPayment = 0) {
  const ordered = sortDebtsSnowball(debts)
  const priority = ordered[0] ?? null
  const simulation = simulateDebtPayoff(debts, extraMonthlyPayment, sortDebtsSnowball)
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

/** Análisis completo: bola de nieve, avalancha, impacto de pagos extra. */
export function buildSnowballAnalysis(debts, extraMonthlyPayment = 0) {
  const extra = Math.max(0, Number(extraMonthlyPayment) || 0)
  const plan = buildSnowballRecommendation(debts, extra)
  const baseline = simulateDebtPayoff(debts, 0, sortDebtsSnowball)
  const withExtra = plan.simulation
  const avalanche = simulateDebtPayoff(debts, extra, sortDebtsAvalanche)

  const monthsSaved = Math.max(0, baseline.months - withExtra.months)
  const interestSaved = Math.max(0, baseline.totalInterest - withExtra.totalInterest)
  const paidDifference = withExtra.totalPaid - baseline.totalPaid

  const payoffDate = withExtra.months > 0 ? addMonths(new Date(), withExtra.months) : null

  const extraSuggestions = [25, 50, 100, 200].map((amount) => {
    const sim = simulateDebtPayoff(debts, amount, sortDebtsSnowball)
    return {
      amount,
      months: sim.months,
      monthsSaved: Math.max(0, baseline.months - sim.months),
      interestSaved: Math.max(0, baseline.totalInterest - sim.totalInterest),
    }
  }).filter((s) => s.monthsSaved > 0)

  return {
    ...plan,
    baseline,
    withExtra,
    avalanche,
    impact: {
      monthsSaved,
      interestSaved,
      paidDifference,
      baselineMonths: baseline.months,
      extraMonths: withExtra.months,
      baselineInterest: baseline.totalInterest,
      withExtraInterest: withExtra.totalInterest,
    },
    comparison: {
      snowballMonths: withExtra.months,
      avalancheMonths: avalanche.months,
      fasterStrategy:
        avalanche.months < withExtra.months
          ? 'avalanche'
          : withExtra.months < avalanche.months
            ? 'snowball'
            : 'tie',
    },
    payoffDate,
    extraSuggestions: extraSuggestions.slice(0, 4),
  }
}

function addMonths(date, count) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + count)
  return d.toISOString().slice(0, 10)
}
