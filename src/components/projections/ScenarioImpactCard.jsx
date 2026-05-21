import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'

export function ScenarioImpactCard({ scenarios }) {
  if (!scenarios) return null

  const { current, scenario, delta } = scenarios
  const hasSimulation =
    delta.monthlySavings !== 0 || delta.sixMonthTotal !== 0 || delta.debtMonths !== 0

  if (!hasSimulation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulación</CardTitle>
        </CardHeader>
        <p className="text-sm text-slate-500">
          Ajusta los controles para comparar tu ritmo actual con un escenario simulado.
        </p>
      </Card>
    )
  }

  return (
    <Card className="border-violet-500/15">
      <CardHeader>
        <CardTitle>Impacto de la simulación</CardTitle>
      </CardHeader>
      <dl className="grid gap-3 sm:grid-cols-3">
        <ImpactItem
          label="Margen mensual"
          before={current.monthlySavings}
          after={scenario.monthlySavings}
          delta={delta.monthlySavings}
        />
        <ImpactItem
          label="Ahorro 6 meses"
          before={current.sixMonthTotal}
          after={scenario.sixMonthTotal}
          delta={delta.sixMonthTotal}
        />
        <ImpactItem
          label="Meses hasta libre de deuda"
          before={current.debtMonths}
          after={scenario.debtMonths}
          delta={delta.debtMonths}
          isMonths
          invertDelta
        />
      </dl>
    </Card>
  )
}

function ImpactItem({ label, before, after, delta, isMonths, invertDelta }) {
  const positive = invertDelta ? delta > 0 : delta > 0
  const negative = invertDelta ? delta < 0 : delta < 0

  return (
    <div className="rounded-xl border border-border-subtle bg-white/3 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-white tabular-nums">
        {isMonths ? (
          <>
            {after}
            <span className="text-sm font-normal text-slate-500"> meses</span>
          </>
        ) : (
          <Money value={after} />
        )}
      </dd>
      {delta !== 0 ? (
        <p
          className={`mt-1 text-xs font-medium ${
            positive ? 'text-emerald-400' : negative ? 'text-rose-400' : 'text-slate-500'
          }`}
        >
          {isMonths ? (
            <>
              {positive ? '+' : ''}
              {delta} meses vs actual
            </>
          ) : (
            <>
              {positive ? '+' : '−'}
              <Money value={Math.abs(delta)} /> vs actual
            </>
          )}
        </p>
      ) : null}
    </div>
  )
}
