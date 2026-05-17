import { Button } from '../ui/Button'
import { IconWallet, IconChart, IconTrendDown } from '../icons'
import { cn } from '../../utils/cn'

const steps = [
  {
    icon: IconTrendDown,
    title: 'Registra gastos',
    description: 'Añade cada gasto con categoría y fecha.',
  },
  {
    icon: IconChart,
    title: 'Visualiza tu resumen',
    description: 'Tu resumen financiero aparecerá aquí.',
  },
  {
    icon: IconWallet,
    title: 'Controla tu dinero',
    description: 'Revisa balance, categorías y movimientos.',
  },
]

export function OnboardingBanner({ onGetStarted, onDismiss }) {
  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-accent/20 bg-linear-to-br from-accent-muted/60 via-surface-card to-surface-card p-6 sm:p-8"
      aria-label="Primeros pasos"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-accent/15 blur-2xl" aria-hidden />

      <div className="relative space-y-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Bienvenido</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Empieza agregando tu primer gasto
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Tu panel se llenará con datos reales a medida que registres movimientos.
          </p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <li
                key={step.title}
                className={cn(
                  'flex gap-3 rounded-2xl border border-border-subtle bg-white/3 p-4',
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-sm font-semibold text-accent">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="mb-2 text-accent">
                    <Icon className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">{step.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          <Button type="button" variant="secondary" onClick={onDismiss} className="sm:mr-auto">
            Omitir
          </Button>
          <Button type="button" size="lg" onClick={onGetStarted}>
            Agregar primer gasto
          </Button>
        </div>
      </div>
    </section>
  )
}
