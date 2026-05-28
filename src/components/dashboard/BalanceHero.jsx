import { Money } from '../currency/Money'
import { EmptyState } from '../ui/EmptyState'
import { IconWallet } from '../icons'
import { cn } from '../../utils/cn'

const heroShell =
  'relative overflow-hidden rounded-3xl border border-border-subtle p-6 sm:p-8 shadow-[0_8px_32px_rgb(0_0_0/0.25)]'

const heroGradient =
  'bg-linear-to-br from-surface-raised via-surface-card to-accent-muted/25'

export function BalanceHero({ summary }) {
  const { balance, budgets, expenses, hasActivity, isOverBudget } = summary

  if (!hasActivity) {
    return (
      <article className={cn(heroShell, heroGradient)}>
        <span
          className="pointer-events-none absolute -top-12 -right-8 block h-44 w-44 rounded-full bg-accent/12 blur-3xl"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -bottom-8 -left-8 block h-32 w-32 rounded-full bg-income/8 blur-3xl"
          aria-hidden
        />
        <EmptyState
          className="relative py-6 sm:py-8"
          icon={<IconWallet className="size-6 text-accent" />}
          title="Tu resumen financiero aparecerá aquí"
          description="Agrega un presupuesto o registra un gasto para calcular tu balance en tiempo real."
        />
      </article>
    )
  }

  return (
    <article className={cn(heroShell, heroGradient)}>
      <span
        className="pointer-events-none absolute -top-12 -right-8 block h-44 w-44 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute bottom-0 left-1/4 block h-28 w-56 rounded-full bg-income/10 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <p className="text-sm font-medium tracking-wide text-slate-400">Balance disponible</p>
        <p
          className={cn(
            'mt-2 text-4xl font-semibold tracking-tight sm:text-5xl',
            isOverBudget ? 'text-expense' : 'text-slate-50',
          )}
        >
          <Money value={balance} />
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-income/20 bg-income/10 px-3 py-1 text-income">
            <span className="size-1.5 rounded-full bg-income" aria-hidden />
            <Money value={budgets} />
            <span className="text-income/80">presupuestos</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-expense/20 bg-expense/10 px-3 py-1 text-expense">
            <span className="size-1.5 rounded-full bg-expense" aria-hidden />
            <Money value={expenses} />
            <span className="text-expense/80">gastos</span>
          </span>
        </div>
      </div>
    </article>
  )
}
