import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

export function SnowballTimeline({ ordered, steps, totalMonths }) {
  if (!ordered?.length) return null

  const maxMonth = Math.max(totalMonths, 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronograma de libertad</CardTitle>
        <span className="text-xs text-slate-500">Cuándo se liquida cada deuda</span>
      </CardHeader>

      <div className="relative space-y-4 pl-2">
        <div
          className="absolute top-2 bottom-2 left-[15px] w-px bg-white/10"
          aria-hidden
        />

        {ordered.map((debt, index) => {
          const payoff = steps.find((s) => s.debtId === debt.id)
          const month = payoff?.paidOffMonth ?? null
          const progress = month ? Math.min((month / maxMonth) * 100, 100) : 8

          return (
            <div key={debt.id} className="relative flex gap-4">
              <span
                className={cn(
                  'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  month ? 'bg-income text-surface' : 'bg-white/10 text-slate-500',
                )}
              >
                {index + 1}
              </span>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-white">{debt.name}</p>
                  {month ? (
                    <p className="text-xs font-medium text-income">
                      Mes {month}
                      {month === maxMonth ? ' · ¡Libre de deudas!' : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">En espera</p>
                  )}
                </div>

                <p className="mt-0.5 text-xs text-slate-500">
                  Saldo <Money value={debt.balance} />
                </p>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <span
                    className={cn(
                      'block h-full rounded-full transition-all duration-700',
                      month ? 'bg-income' : 'bg-slate-600',
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
