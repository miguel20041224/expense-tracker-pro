import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { computeGoalProgress, getGoalStatus } from '../../utils/goals'
import { useCurrency } from '../../hooks/useCurrency'
import { cn } from '../../utils/cn'

const badgeVariants = {
  positive: 'positive',
  negative: 'negative',
  neutral: 'neutral',
}

const statusTranslationKeys = {
  completed: 'goals.status.completed',
  overdue: 'goals.status.overdue',
  in_progress: 'goals.status.inProgress',
}

export function GoalCard({ goal, onContribute, onDelete }) {
  const { t } = useTranslation('forms')
  const { parseAmount, formatCurrency } = useCurrency()
  const [amount, setAmount] = useState('')
  const progress = computeGoalProgress(goal)
  const status = getGoalStatus(goal)

  function handleContribute(event) {
    event.preventDefault()
    const value = parseAmount(amount)
    if (!value || value <= 0) return
    onContribute?.(goal.id, value)
    setAmount('')
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{goal.name}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {t('goals.card.progressOf', {
              current: formatCurrency(goal.currentAmount),
              target: formatCurrency(goal.targetAmount),
            })}
          </p>
        </div>
        <Badge variant={badgeVariants[status.variant]}>
          {t(statusTranslationKeys[status.id] ?? statusTranslationKeys.in_progress)}
        </Badge>
      </div>

      <ProgressBar
        className="mt-4"
        value={progress.percent}
        max={100}
        variant={progress.isComplete ? 'default' : 'accent'}
      />

      <p className="mt-2 text-xs text-slate-500">
        {progress.isComplete
          ? t('goals.card.completed')
          : t('goals.card.remaining', {
              amount: formatCurrency(progress.remaining),
              percent: progress.percent.toFixed(0),
            })}
        {goal.targetDate ? t('goals.card.targetDate', { date: goal.targetDate }) : ''}
        {goal.autoContributionPercent > 0
          ? t('goals.card.autoContribution', { percent: goal.autoContributionPercent })
          : ''}
      </p>

      {!progress.isComplete ? (
        <form onSubmit={handleContribute} className="mt-4 flex gap-2">
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('goals.card.manualPlaceholder')}
            inputMode="decimal"
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            {t('goals.card.contribute')}
          </Button>
        </form>
      ) : null}

      {onDelete ? (
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          className={cn('mt-3 text-xs text-slate-500 hover:text-expense')}
        >
          {t('goals.card.delete')}
        </button>
      ) : null}
    </Card>
  )
}
