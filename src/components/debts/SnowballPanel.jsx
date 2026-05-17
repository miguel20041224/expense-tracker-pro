import { useMemo, useState } from 'react'
import { DebtForm } from './DebtForm'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Input } from '../ui/Input'
import { FormField } from '../ui/FormField'
import { Money } from '../currency/Money'
import { IconSnowball } from '../icons'
import { buildSnowballRecommendation } from '../../utils/debts'
import { useCurrency } from '../../hooks/useCurrency'
import { cn } from '../../utils/cn'

export function SnowballPanel({ debts, onAddDebt, onDeleteDebt }) {
  const { parseAmount } = useCurrency()
  const [extraPayment, setExtraPayment] = useState('')

  const plan = useMemo(() => {
    const extra = extraPayment ? parseAmount(extraPayment) : 0
    return buildSnowballRecommendation(debts, Number.isNaN(extra) ? 0 : extra)
  }, [debts, extraPayment, parseAmount])

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-amber-500/15 bg-linear-to-br from-amber-500/8 via-surface-card/60 to-surface-card/60 p-5">
        <p className="text-xs font-medium tracking-widest text-amber-400/90 uppercase">
          Estrategia de deudas (bola de nieve)
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Herramienta de análisis y recomendación: ordena deudas de menor a mayor saldo y
          simula el avance al destinar pagos extra a la deuda prioritaria. No sustituye asesoría
          financiera profesional.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <DebtForm onSubmit={onAddDebt} />

          <Card>
            <CardHeader>
              <CardTitle>Pago extra mensual</CardTitle>
            </CardHeader>
            <FormField label="Monto adicional" htmlFor="snowball-extra" hint="Suma a la deuda prioritaria">
              <Input
                id="snowball-extra"
                value={extraPayment}
                onChange={(e) => setExtraPayment(e.target.value)}
                inputMode="decimal"
                placeholder="0"
              />
            </FormField>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-3">
          {debts.length === 0 ? (
            <Card>
              <EmptyState
                icon={<IconSnowball className="size-6" />}
                title="Sin deudas registradas"
                description="Agrega tus deudas para ver el orden recomendado y una simulación de pago."
              />
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen</CardTitle>
                </CardHeader>
                <dl className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-slate-500">Saldo total</dt>
                    <dd className="text-lg font-semibold text-white">
                      <Money value={plan.totalBalance} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Mínimos mensuales</dt>
                    <dd className="text-lg font-semibold text-white">
                      <Money value={plan.totalMinimum} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Tiempo estimado</dt>
                    <dd className="text-lg font-semibold text-income">
                      {plan.simulation.months > 0
                        ? `${plan.simulation.months} meses`
                        : '—'}
                    </dd>
                  </div>
                </dl>

                {plan.priority ? (
                  <p className="mt-4 rounded-xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-slate-200">
                    Prioridad bola de nieve: pagar primero{' '}
                    <span className="font-semibold text-white">{plan.priority.name}</span> (
                    <Money value={plan.priority.balance} />)
                  </p>
                ) : null}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Orden de pago recomendado</CardTitle>
                </CardHeader>
                <ol className="space-y-3">
                  {plan.ordered.map((debt, index) => {
                    const payoff = plan.simulation.steps.find((s) => s.debtId === debt.id)
                    const isPriority = plan.priority?.id === debt.id

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
                            <p className="text-xs text-income">Libre en ~{payoff.paidOffMonth} meses</p>
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
