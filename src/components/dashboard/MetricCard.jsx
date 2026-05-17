import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/cn'

const accentMap = {
  income: 'text-income',
  expense: 'text-expense',
  savings: 'text-savings',
}

export function MetricCard({ label, value, icon, variant, subtitle }) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className={cn('mt-2 text-2xl font-semibold tracking-tight', accentMap[variant])}>
            {formatCurrency(value)}
          </p>
        </div>
        <IconBadge variant={variant}>{icon}</IconBadge>
      </div>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </Card>
  )
}
