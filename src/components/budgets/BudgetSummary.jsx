import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { ProgressBar } from '../ui/ProgressBar'
import { useCurrency } from '../../hooks/useCurrency'
import { computeSummary, filterCurrentMonth } from '../../utils/finance'
import { isBudgetTransaction } from '../../utils/budget'

export function BudgetSummary({ transactions, income, overview }) {
  const { t } = useTranslation('forms')
  const { formatCurrency } = useCurrency()
  const summary = computeSummary(transactions, income)
  const monthBudgets = filterCurrentMonth(transactions).filter(isBudgetTransaction)

  if (overview?.hasConfiguredIncome) {
    return (
      <Card className="motion-safe:animate-fade-in-up">
        <CardHeader>
          <CardTitle>{t('budget.summary.title')}</CardTitle>
          <span className="text-xs text-slate-500">{t('budget.summary.basedOnIncome')}</span>
        </CardHeader>
        <p className="text-3xl font-semibold tracking-tight text-income">
          <Money value={overview.remaining} />
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {t('budget.summary.availableThisMonth', {
            spent: formatCurrency(overview.spent),
            limit: formatCurrency(overview.limit),
          })}
        </p>
        <div className="mt-4">
          <ProgressBar
            value={Math.min(overview.usagePercent, 100)}
            variant={overview.isOverBudget ? 'expense' : 'default'}
          />
          <p className="mt-2 text-xs text-slate-500">
            {t('budget.summary.usagePercent', { percent: Math.round(overview.usagePercent) })}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="motion-safe:animate-fade-in-up">
      <CardHeader>
        <CardTitle>{t('budget.summary.monthTitle')}</CardTitle>
        <span className="text-xs text-slate-500">
          {t('budget.summary.allocations', { count: monthBudgets.length })}
        </span>
      </CardHeader>
      {summary.hasBudgets ? (
        <>
          <p className="text-3xl font-semibold tracking-tight text-income">
            <Money value={summary.budgets} />
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t('budget.summary.totalAssigned', { balance: formatCurrency(summary.balance) })}
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-500">{t('budget.summary.emptyHint')}</p>
      )}
    </Card>
  )
}
