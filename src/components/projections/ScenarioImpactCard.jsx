import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { useCurrency } from '../../hooks/useCurrency'

export function ScenarioImpactCard({ scenarios }) {
  const { t } = useTranslation(['projections', 'forms'])

  if (!scenarios) return null

  const { current, scenario, delta } = scenarios
  const hasSimulation =
    delta.monthlySavings !== 0 || delta.sixMonthTotal !== 0 || delta.debtMonths !== 0

  if (!hasSimulation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('simulation.title')}</CardTitle>
        </CardHeader>
        <p className="text-sm text-slate-500">{t('simulation.emptyHint')}</p>
      </Card>
    )
  }

  return (
    <Card className="border-violet-500/15">
      <CardHeader>
        <CardTitle>{t('simulation.impactTitle')}</CardTitle>
      </CardHeader>
      <dl className="grid gap-3 sm:grid-cols-3">
        <ImpactItem
          label={t('simulation.monthlyMargin')}
          after={scenario.monthlySavings}
          delta={delta.monthlySavings}
        />
        <ImpactItem
          label={t('simulation.sixMonthSavings')}
          after={scenario.sixMonthTotal}
          delta={delta.sixMonthTotal}
        />
        <ImpactItem
          label={t('simulation.monthsToDebtFree')}
          after={scenario.debtMonths}
          delta={delta.debtMonths}
          isMonths
          invertDelta
        />
      </dl>
    </Card>
  )
}

function ImpactItem({ label, after, delta, isMonths, invertDelta }) {
  const { t } = useTranslation(['projections', 'forms'])
  const { formatCurrency } = useCurrency()
  const positive = invertDelta ? delta > 0 : delta > 0
  const negative = invertDelta ? delta < 0 : delta < 0

  return (
    <div className="rounded-xl border border-border-subtle bg-white/3 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-white tabular-nums">
        {isMonths ? (
          <>
            {after}
            <span className="text-sm font-normal text-slate-500"> {t('units.months')}</span>
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
          {isMonths
            ? t('projections.impact.monthsDelta', {
                ns: 'forms',
                sign: delta > 0 ? '+' : '',
                count: delta,
              })
            : t('projections.impact.amountDelta', {
                ns: 'forms',
                sign: delta > 0 ? '+' : '−',
                amount: formatCurrency(Math.abs(delta)),
              })}
        </p>
      ) : null}
    </div>
  )
}
