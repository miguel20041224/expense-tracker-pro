import { useTranslation } from 'react-i18next'
import { useCurrency } from '../../hooks/useCurrency'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

/**
 * Progreso del presupuesto del mes (datos reales: asignado vs gastado).
 */
export function SavingsProgress({ income, expenses, remaining, isOverBudget }) {
  const { t } = useTranslation('forms')
  const { formatCurrency } = useCurrency()
  const spentPercent = income > 0 ? Math.min((expenses / income) * 100, 100) : 0
  const remainingPercent = income > 0 ? Math.max(100 - spentPercent, 0) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('savings.progress.title')}</CardTitle>
        <span className="text-sm font-medium text-slate-400">
          {t('savings.progress.spentPercent', { percent: spentPercent.toFixed(0) })}
        </span>
      </CardHeader>

      <p className="text-2xl font-semibold tracking-tight text-white">
        <Money value={remaining} className={cn(isOverBudget && 'text-expense')} />
        <span className="text-base font-normal text-slate-500">
          {t('savings.progress.availableOf', { amount: formatCurrency(income) })}
        </span>
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isOverBudget ? 'bg-expense' : 'bg-linear-to-r from-income to-savings',
          )}
          style={{ width: `${spentPercent}%` }}
          role="progressbar"
          aria-valuenow={spentPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('savings.progress.progressAriaLabel')}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {isOverBudget ? (
          t('savings.progress.overBudget', { amount: formatCurrency(Math.abs(remaining)) })
        ) : (
          t('savings.progress.remainingPercent', { percent: remainingPercent.toFixed(0) })
        )}
      </p>
    </Card>
  )
}
