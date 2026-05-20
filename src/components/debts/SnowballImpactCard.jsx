import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

export function SnowballImpactCard({ analysis, extraAmount }) {
  const { impact, comparison, payoffDate } = analysis
  const hasExtra = extraAmount > 0

  if (!hasExtra && impact.baselineMonths === 0) return null

  return (
    <Card className="border-emerald-500/20 bg-linear-to-br from-emerald-500/8 to-transparent">
      <CardHeader>
        <CardTitle>Impacto del pago extra</CardTitle>
        {hasExtra ? (
          <span className="text-xs text-emerald-400">
            +<Money value={extraAmount} />/mes
          </span>
        ) : (
          <span className="text-xs text-slate-500">Sin pago extra simulado</span>
        )}
      </CardHeader>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ImpactStat
          label="Sin extra"
          value={`${impact.baselineMonths} meses`}
          sub="solo mínimos"
        />
        <ImpactStat
          label="Con tu extra"
          value={`${impact.extraMonths} meses`}
          sub={payoffDate ? `libre ~${formatDate(payoffDate)}` : undefined}
          highlight
        />
        <ImpactStat
          label="Meses ahorrados"
          value={impact.monthsSaved > 0 ? `${impact.monthsSaved}` : '—'}
          sub={impact.monthsSaved > 0 ? 'vs solo mínimos' : 'prueba un monto mayor'}
          positive={impact.monthsSaved > 0}
        />
        <ImpactStat
          label="Interés estimado"
          value={
            impact.interestSaved > 0 ? (
              <Money value={impact.interestSaved} />
            ) : (
              '—'
            )
          }
          sub="menos intereses pagados"
          positive={impact.interestSaved > 0}
        />
      </dl>

      {comparison.fasterStrategy !== 'tie' ? (
        <p className="mt-4 rounded-xl border border-white/6 bg-white/3 px-3 py-2 text-xs text-slate-400">
          Con el mismo pago extra, el método{' '}
          <span className="font-medium text-slate-200">
            {comparison.fasterStrategy === 'avalanche' ? 'avalancha' : 'bola de nieve'}
          </span>{' '}
          liquidaría tus deudas en {comparison.fasterStrategy === 'avalanche'
            ? comparison.avalancheMonths
            : comparison.snowballMonths}{' '}
          meses (el otro en{' '}
          {comparison.fasterStrategy === 'avalanche'
            ? comparison.snowballMonths
            : comparison.avalancheMonths}
          ).
        </p>
      ) : null}
    </Card>
  )
}

function ImpactStat({ label, value, sub, highlight, positive }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd
        className={cn(
          'mt-0.5 text-lg font-semibold tabular-nums',
          highlight ? 'text-income' : positive ? 'text-emerald-400' : 'text-white',
        )}
      >
        {value}
      </dd>
      {sub ? <p className="mt-0.5 text-xs text-slate-500">{sub}</p> : null}
    </div>
  )
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es', { month: 'short', year: 'numeric' })
}
