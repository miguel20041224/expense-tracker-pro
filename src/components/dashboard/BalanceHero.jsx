import { Badge } from '../ui/Badge'
import { formatCurrency } from '../../utils/format'

export function BalanceHero({ balance, change }) {
  const isPositive = change >= 0

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-slate-900 via-surface-card to-accent-muted/40 p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-2xl" aria-hidden />

      <div className="relative">
        <p className="text-sm font-medium text-slate-400">Balance total</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {formatCurrency(balance)}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge variant={isPositive ? 'positive' : 'negative'}>
            {isPositive ? '+' : ''}
            {change}% este mes
          </Badge>
          <span className="text-sm text-slate-500">Actualizado hoy</span>
        </div>
      </div>
    </article>
  )
}
