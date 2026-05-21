import { simulateDebtPayoff, sortDebtsSnowball, buildSnowballAnalysis } from '../../utils/debts'
import { futureMonthLabel } from './helpers'

/**
 * Proyección de deuda integrada al motor de inteligencia (reutiliza simulateDebtPayoff).
 */
export function projectDebtOutlook(debts, extraMonthlyPayment = 0) {
  const normalized = debts?.filter((d) => d.balance > 0) ?? []
  if (normalized.length === 0) {
    return {
      hasDebt: false,
      totalBalance: 0,
      monthsToFree: 0,
      payoffLabel: null,
      baseline: null,
      withExtra: null,
      timeline: [],
    }
  }

  const extra = Math.max(0, Number(extraMonthlyPayment) || 0)
  const analysis = buildSnowballAnalysis(normalized, extra)
  const baseline = analysis.baseline
  const withExtra = analysis.withExtra

  return {
    hasDebt: true,
    totalBalance: analysis.totalBalance,
    totalMinimum: analysis.totalMinimum,
    monthsToFree: withExtra.months,
    monthsBaseline: baseline.months,
    monthsSaved: analysis.impact.monthsSaved,
    payoffLabel: analysis.payoffDate
      ? formatPayoffDate(analysis.payoffDate)
      : withExtra.months > 0
        ? futureMonthLabel(withExtra.months)
        : null,
    payoffDate: analysis.payoffDate,
    baseline,
    withExtra,
    timeline: withExtra.timeline,
    comparison: analysis.comparison,
    priority: analysis.priority,
  }
}

/** Serie para gráfico de saldo de deuda (mínimos vs con extra). */
export function buildDebtProjectionSeries(baselineTimeline, withExtraTimeline) {
  const maxLen = Math.max(baselineTimeline?.length ?? 0, withExtraTimeline?.length ?? 0)
  const rows = []

  for (let i = 0; i < maxLen; i += 1) {
    const b = baselineTimeline?.[i]
    const e = withExtraTimeline?.[i]
    rows.push({
      label: b?.label ?? e?.label ?? `Mes ${i}`,
      baseline: b?.totalBalance ?? 0,
      withExtra: e?.totalBalance ?? 0,
    })
  }

  return downsample(rows, 24)
}

function formatPayoffDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es', {
    month: 'long',
    year: 'numeric',
  })
}

function downsample(rows, maxPoints) {
  if (rows.length <= maxPoints) return rows
  const step = Math.ceil(rows.length / maxPoints)
  return rows.filter((_, i) => i === 0 || i === rows.length - 1 || i % step === 0)
}

export { simulateDebtPayoff, sortDebtsSnowball }
