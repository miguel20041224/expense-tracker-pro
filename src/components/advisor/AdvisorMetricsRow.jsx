import { MetricCard } from '../dashboard/MetricCard'
import {
  IconTrendUp,
  IconTrendDown,
  IconPiggyBank,
  IconChart,
} from '../icons'

export function AdvisorMetricsRow({ metrics }) {
  const {
    summary,
    monthlySavings,
    avgExpense,
    totalDebt,
    creditUsagePercent,
    riskLevel,
    riskScore,
    debtToIncome,
  } = metrics

  const riskLabels = { bajo: 'Bajo', medio: 'Medio', alto: 'Alto' }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Métricas del cliente">
      <MetricCard
        label="Ahorro mensual"
        value={monthlySavings}
        variant="savings"
        icon={<IconPiggyBank />}
        isEmpty={!summary.hasActivity}
        emptyHint="Sin movimientos este mes"
        subtitle={summary.income > 0 ? 'Ingresos − gastos' : undefined}
      />
      <MetricCard
        label="Gasto promedio"
        value={avgExpense}
        variant="expense"
        icon={<IconTrendDown />}
        isEmpty={metrics.expenseCount === 0}
        emptyHint="Sin gastos registrados"
        subtitle="Por transacción (mes actual)"
      />
      <MetricCard
        label="Deuda total"
        value={totalDebt}
        variant="expense"
        icon={<IconTrendDown />}
        isEmpty={totalDebt === 0}
        emptyHint="Sin deudas activas"
        subtitle={totalDebt > 0 ? `${Math.round(debtToIncome)}% vs ingresos` : undefined}
      />
      <MetricCard
        label="Riesgo financiero"
        value={riskScore}
        variant="balance"
        icon={<IconChart />}
        isEmpty={false}
        subtitle={`Nivel ${riskLabels[riskLevel] ?? riskLevel} · Crédito ${Math.round(creditUsagePercent)}%`}
      />
      <MetricCard
        label="Ingresos del mes"
        value={summary.income}
        variant="income"
        icon={<IconTrendUp />}
        isEmpty={!summary.hasBudgets}
        emptyHint="Sin presupuestos"
      />
    </section>
  )
}
