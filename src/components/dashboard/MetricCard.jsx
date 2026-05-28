import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

const accentMap = {
  income: 'text-income',
  expense: 'text-expense',
  savings: 'text-savings',
  balance: 'text-slate-50',
}

const surfaceMap = {
  income: 'border-income/15 bg-income/[0.06]',
  expense: 'border-expense/15 bg-expense/[0.06]',
  savings: 'border-savings/15 bg-savings/[0.06]',
  balance: 'border-accent/15 bg-accent/[0.06]',
}

export function MetricCard({ label, value, icon, variant, subtitle, isEmpty, emptyHint }) {
  const isNegative = !isEmpty && value < 0
  const valueClass = isNegative
    ? 'text-expense'
    : accentMap[variant] ?? 'text-slate-50'

  return (
    <Card
      className={cn(
        'flex min-h-[148px] flex-col gap-4 transition-shadow duration-200 hover:shadow-[0_4px_24px_rgb(0_0_0/0.2)]',
        surfaceMap[variant] ?? surfaceMap.balance,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          {isEmpty ? (
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-600">—</p>
          ) : (
            <p className={cn('mt-2 text-2xl font-semibold tracking-tight tabular-nums', valueClass)}>
              <Money value={value} />
            </p>
          )}
        </div>
        <IconBadge variant={variant === 'balance' ? 'accent' : variant}>{icon}</IconBadge>
      </div>
      <p className="text-xs leading-relaxed text-slate-500">
        {isEmpty ? emptyHint : subtitle}
      </p>
    </Card>
  )
}
