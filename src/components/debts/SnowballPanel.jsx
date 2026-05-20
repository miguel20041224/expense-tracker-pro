import { useMemo, useState } from 'react'
import { DebtForm } from './DebtForm'
import { DebtPayoffChart } from './DebtPayoffChart'
import { ExtraPaymentSuggestions } from './ExtraPaymentSuggestions'
import { SnowballImpactCard } from './SnowballImpactCard'
import { SnowballTimeline } from './SnowballTimeline'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Input } from '../ui/Input'
import { FormField } from '../ui/FormField'
import { Money } from '../currency/Money'
import { IconSnowball } from '../icons'
import { buildSnowballAnalysis } from '../../utils/debts'
import { useCurrency } from '../../hooks/useCurrency'
import { cn } from '../../utils/cn'

export function SnowballPanel({ debts, onAddDebt, onDeleteDebt }) {
  const { parseAmount } = useCurrency()
  const [extraPayment, setExtraPayment] = useState('')

  const extraAmount = useMemo(() => {
    const parsed = extraPayment ? parseAmount(extraPayment) : 0
    return Number.isNaN(parsed) ? 0 : parsed
  }, [extraPayment, parseAmount])

  const analysis = useMemo(
    () => buildSnowballAnalysis(debts, extraAmount),
    [debts, extraAmount],
  )

  const { ordered, priority, simulation, totalBalance, totalMinimum } = analysis

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-amber-500/15 bg-linear-to-br from-amber-500/8 via-surface-card/60 to-surface-card/60 p-5">
        <p className="text-xs font-medium tracking-widest text-amber-400/90 uppercase">
          Estrategia de deudas (bola de nieve)
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Ordena de menor a mayor saldo, simula pagos extra y visualiza cuándo quedarás libre de
          deudas. Compara el impacto frente a pagar solo los mínimos.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <DebtForm onSubmit={onAddDebt} />

          <Card>
            <CardHeader>
              <CardTitle>Pago extra mensual</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <FormField
                label="Monto adicional"
                htmlFor="snowball-extra"
                hint="Se suma a la deuda prioritaria cada mes"
              >
                <Input
                  id="snowball-extra"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                />
              </FormField>
              <ExtraPaymentSuggestions
                suggestions={analysis.extraSuggestions}
                selectedExtra={extraAmount}
                onSelect={setExtraPayment}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-3">
          {debts.length === 0 ? (
            <Card>
              <EmptyState
                icon={<IconSnowball className="size-6" />}
                title="Sin deudas registradas"
                description="Agrega tus deudas para ver el orden recomendado, proyección y cronograma."
              />
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen</CardTitle>
                </CardHeader>
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-xs text-slate-500">Saldo total</dt>
                    <dd className="text-lg font-semibold text-white">
                      <Money value={totalBalance} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Mínimos mensuales</dt>
                    <dd className="text-lg font-semibold text-white">
                      <Money value={totalMinimum} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Libre en</dt>
                    <dd className="text-lg font-semibold text-income">
                      {simulation.months > 0 ? `${simulation.months} meses` : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Total pagado (est.)</dt>
                    <dd className="text-lg font-semibold text-slate-200">
                      <Money value={simulation.totalPaid} />
                    </dd>
                  </div>
                </dl>

                {priority ? (
                  <p className="mt-4 rounded-xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-slate-200">
                    Prioridad: pagar primero{' '}
                    <span className="font-semibold text-white">{priority.name}</span> (
                    <Money value={priority.balance} />)
                  </p>
                ) : null}
              </Card>

              <SnowballImpactCard analysis={analysis} extraAmount={extraAmount} />

              <DebtPayoffChart
                baselineTimeline={analysis.baseline.timeline}
                withExtraTimeline={analysis.withExtra.timeline}
              />

              <SnowballTimeline
                ordered={ordered}
                steps={simulation.steps}
                totalMonths={simulation.months}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Orden de pago recomendado</CardTitle>
                </CardHeader>
                <ol className="space-y-3">
                  {ordered.map((debt, index) => {
                    const payoff = simulation.steps.find((s) => s.debtId === debt.id)
                    const isPriority = priority?.id === debt.id

                    return (
                      <li
                        key={debt.id}
                        className={cn(
                          'flex items-center justify-between gap-3 rounded-xl border px-4 py-3',
                          isPriority
                            ? 'border-accent/40 bg-accent/10'
                            : 'border-border-subtle bg-white/2',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'flex size-8 items-center justify-center rounded-full text-sm font-semibold',
                              isPriority ? 'bg-accent text-white' : 'bg-white/10 text-slate-400',
                            )}
                          >
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-white">{debt.name}</p>
                            <p className="text-xs text-slate-500">
                              Mín. <Money value={debt.minPayment} />
                              {debt.interestRate != null ? ` · ${debt.interestRate}% anual` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-expense">
                            <Money value={debt.balance} />
                          </p>
                          {payoff ? (
                            <p className="text-xs text-income">Libre en mes {payoff.paidOffMonth}</p>
                          ) : null}
                        </div>
                        {onDeleteDebt ? (
                          <button
                            type="button"
                            onClick={() => onDeleteDebt(debt.id)}
                            className="text-xs text-slate-500 hover:text-expense"
                          >
                            Quitar
                          </button>
                        ) : null}
                      </li>
                    )
                  })}
                </ol>
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
