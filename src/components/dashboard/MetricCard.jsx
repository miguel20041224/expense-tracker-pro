import { Card } from '../ui/Card'
import { IconBadge } from '../ui/IconBadge'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

const accentMap = {
  income: 'text-income',
  expense: 'text-expense',
  savings: 'text-savings',
}

export function MetricCard({ label, value, icon, variant, subtitle, isEmpty, emptyHint }) {
  return (
    <Card className="flex min-h-[140px] flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-400">{label}</p>
          {isEmpty ? (
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-600">—</p>
          ) : (
            <p className={cn('mt-2 text-2xl font-semibold tracking-tight', accentMap[variant])}>
              <Money value={value} />
            </p>
          )}
        </div>
        <IconBadge variant={variant}>{icon}</IconBadge>
      </div>
      <p className="text-xs text-slate-500">{isEmpty ? emptyHint : subtitle}</p>
    </Card>
  )
}
