import { Money } from '../currency/Money'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { computeGoalProgress, getGoalStatus } from '../../utils/goals'
import { useState } from 'react'
import { useCurrency } from '../../hooks/useCurrency'
import { cn } from '../../utils/cn'

const badgeVariants = {
  positive: 'positive',
  negative: 'negative',
  neutral: 'neutral',
}

export function GoalCard({ goal, onContribute, onDelete }) {
  const { parseAmount } = useCurrency()
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
            <Money value={goal.currentAmount} /> de <Money value={goal.targetAmount} />
          </p>
        </div>
        <Badge variant={badgeVariants[status.variant]}>{status.label}</Badge>
      </div>

      <ProgressBar
        className="mt-4"
        value={progress.percent}
        max={100}
        variant={progress.isComplete ? 'default' : 'accent'}
      />

      <p className="mt-2 text-xs text-slate-500">
        {progress.isComplete
          ? 'Meta alcanzada'
          : (
              <>
                Faltan <Money value={progress.remaining} /> · {progress.percent.toFixed(0)}%
              </>
            )}
        {goal.targetDate ? ` · Objetivo ${goal.targetDate}` : ''}
        {goal.autoContributionPercent > 0
          ? ` · Auto ${goal.autoContributionPercent}% de ingresos`
          : ''}
      </p>

      {!progress.isComplete ? (
        <form onSubmit={handleContribute} className="mt-4 flex gap-2">
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Aporte manual"
            inputMode="decimal"
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Aportar
          </Button>
        </form>
      ) : null}

      {onDelete ? (
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          className={cn('mt-3 text-xs text-slate-500 hover:text-expense')}
        >
          Eliminar meta
        </button>
      ) : null}
    </Card>
  )
}
