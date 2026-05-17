import { useEffect, useMemo, useState } from 'react'
import { loadClientFinancialSnapshot } from '../../services/financialDataService'
import {
  computeAdvisorMetrics,
  generateFinancialInsights,
  buildMonthlyExpenseTrend,
} from '../../utils/advisorAnalytics'
import { BalanceHero } from '../dashboard/BalanceHero'
import { CategoryBreakdown } from '../dashboard/CategoryBreakdown'
import { TransactionList } from '../dashboard/TransactionList'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { Money } from '../currency/Money'
import { AdvisorMetricsRow } from './AdvisorMetricsRow'
import { AdvisorInsights } from './AdvisorInsights'
import {
  CategoryPieChart,
  IncomeExpenseLineChart,
  DebtRiskBarChart,
  CreditUsageBarChart,
} from './AdvisorCharts'

const EMPTY_SNAPSHOT = {
  transactions: [],
  creditCards: [],
  goals: [],
  debts: [],
}

export function AdvisorClientDetail({ advisor, client }) {
  const clientId = client.uid ?? client.id
  const [snapshot, setSnapshot] = useState(EMPTY_SNAPSHOT)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    loadClientFinancialSnapshot(advisor, clientId)
      .then((data) => {
        if (!cancelled) setSnapshot(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? 'No se pudieron cargar los datos del cliente.')
          setSnapshot(EMPTY_SNAPSHOT)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [advisor, clientId])

  const metrics = useMemo(
    () =>
      computeAdvisorMetrics({
        transactions: snapshot.transactions,
        creditCards: snapshot.creditCards,
        goals: snapshot.goals,
        debts: snapshot.debts,
      }),
    [snapshot],
  )

  const insights = useMemo(
    () => generateFinancialInsights(metrics, { creditCards: snapshot.creditCards }),
    [metrics, snapshot.creditCards],
  )

  const trend = useMemo(
    () => buildMonthlyExpenseTrend(snapshot.transactions),
    [snapshot.transactions],
  )

  const cardNameById = useMemo(() => {
    const map = new Map()
    for (const card of snapshot.creditCards) map.set(card.id, card.name)
    return map
  }, [snapshot.creditCards])

  const riskLabels = { bajo: 'Bajo', medio: 'Medio', alto: 'Alto' }

  if (loading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-400">Cargando análisis del cliente…</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <p className="text-sm text-rose-300" role="alert">
          {error}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Cliente</p>
          <h2 className="text-xl font-semibold text-white">{client.name}</h2>
          <p className="text-sm text-slate-400">{client.email}</p>
        </div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
          Solo lectura
        </span>
      </div>

      <BalanceHero summary={metrics.summary} />
      <AdvisorMetricsRow metrics={metrics} />
      <AdvisorInsights insights={insights} />

      <section className="grid gap-4 lg:grid-cols-2">
        <CategoryPieChart categories={metrics.categories} />
        <IncomeExpenseLineChart trend={trend} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <DebtRiskBarChart
          debtToIncome={metrics.debtToIncome}
          creditUsagePercent={metrics.creditUsagePercent}
          riskScore={metrics.riskScore}
        />
        <CreditUsageBarChart cardStats={metrics.cardStats} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <CategoryBreakdown categories={metrics.categories} />
        <Card>
          <CardHeader>
            <CardTitle>Metas financieras</CardTitle>
          </CardHeader>
          {metrics.goalsProgress.length === 0 ? (
            <p className="text-sm text-slate-500">Sin metas registradas.</p>
          ) : (
            <ul className="space-y-4">
              {metrics.goalsProgress.map((goal) => (
                <li key={goal.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-200">{goal.name}</span>
                    <span className="text-slate-400">
                      <Money value={goal.currentAmount} /> / <Money value={goal.targetAmount} />
                    </span>
                  </div>
                  <ProgressBar value={goal.percent} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deudas</CardTitle>
            <span className="text-xs text-slate-500">
              Riesgo: {riskLabels[metrics.riskLevel] ?? metrics.riskLevel}
            </span>
          </CardHeader>
          {snapshot.debts.length === 0 ? (
            <p className="text-sm text-slate-500">Sin deudas registradas.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {snapshot.debts.map((debt) => (
                <li
                  key={debt.id}
                  className="flex justify-between rounded-lg bg-white/5 px-3 py-2"
                >
                  <span className="text-slate-200">{debt.name}</span>
                  <Money value={debt.balance} className="text-expense" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <TransactionList
          transactions={snapshot.transactions}
          isEmpty={snapshot.transactions.length === 0}
          limit={8}
          creditCardNames={cardNameById}
        />
      </section>
    </div>
  )
}
