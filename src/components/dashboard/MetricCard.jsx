import { memo } from 'react'
import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

const accentMap = {
  income: 'text-income',
  expense: 'text-expense',
  savings: 'text-savings',
  balance: 'text-white',
}

function MetricCardInner({ label, value, icon, variant, subtitle, isEmpty, emptyHint }) {
  const isNegative = !isEmpty && value < 0
  const valueClass = isNegative
    ? 'text-expense'
    : accentMap[variant] ?? 'text-white'

  return (
    <Card className="flex min-h-[140px] flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-400">{label}</p>
          {isEmpty ? (
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-600">—</p>
          ) : (
            <p className={cn('mt-2 text-2xl font-semibold tracking-tight', valueClass)}>
              <Money value={value} />
            </p>
          )}
        </div>
        <IconBadge variant={variant === 'balance' ? 'accent' : variant}>{icon}</IconBadge>
      </div>
      <p className="text-xs text-slate-500">{isEmpty ? emptyHint : subtitle}</p>
    </Card>
  )
}

export const MetricCard = memo(MetricCardInner)
