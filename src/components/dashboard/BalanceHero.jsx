import { Money } from '../currency/Money'
import { EmptyState } from '../ui/EmptyState'
import { IconWallet } from '../icons'

export function BalanceHero({ balance, isEmpty }) {
  if (isEmpty) {
    return (
      <article className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-slate-900 via-surface-card to-accent-muted/30 p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
          aria-hidden
        />
        <EmptyState
          className="relative py-6 sm:py-8"
          icon={<IconWallet className="size-6" />}
          title="Tu resumen financiero aparecerá aquí"
          description="Registra ingresos y gastos para ver tu balance total actualizado."
        />
      </article>
    )
  }

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-slate-900 via-surface-card to-accent-muted/40 p-6 sm:p-8">
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-2xl"
        aria-hidden
      />

      <div className="relative">
        <p className="text-sm font-medium text-slate-400">Balance del mes</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          <Money value={balance} />
        </p>
        <p className="mt-4 text-sm text-slate-500">Calculado a partir de tus movimientos</p>
      </div>
    </article>
  )
}
