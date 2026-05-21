import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

export function ProjectionSummaryCards({ outlook }) {
  const { savings, debt, health, monthEnd, budgetRunway } = outlook

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Ahorro 6 meses"
        value={savings?.sixMonths?.total}
        variant="savings"
        subtitle="Acumulado proyectado"
      />
      <SummaryCard
        label="Ahorro 12 meses"
        value={savings?.twelveMonths?.total}
        variant="savings"
        subtitle="Si mantienes el ritmo"
      />
      <SummaryCard
        label="Libertad de deuda"
        value={debt?.hasDebt ? debt.monthsToFree : null}
        variant="debt"
        isMonths
        subtitle={debt?.payoffLabel ?? 'Sin deudas activas'}
        empty={!debt?.hasDebt}
      />
      <SummaryCard
        label="Salud futura"
        value={health?.projectedScore}
        variant="health"
        isScore
        subtitle={health?.projectedLevelLabel}
        direction={health?.direction}
      />
      {monthEnd?.projected != null ? (
        <SummaryCard
          label="Fin de mes"
          value={monthEnd.projected}
          variant="accent"
          subtitle={`${monthEnd.daysRemaining} días restantes`}
          className="sm:col-span-2"
        />
      ) : null}
      {budgetRunway && !budgetRunway.exhausted ? (
        <SummaryCard
          label="Margen del mes"
          value={budgetRunway.daysRemaining}
          variant="neutral"
          isDays
          subtitle="Días estimados al ritmo actual"
          className="sm:col-span-2"
        />
      ) : null}
    </section>
  )
}

function SummaryCard({
  label,
  value,
  variant,
  subtitle,
  isMonths,
  isScore,
  isDays,
  empty,
  direction,
  className,
}) {
  const variantStyles = {
    savings: 'border-emerald-500/20 bg-emerald-500/5',
    debt: 'border-amber-500/20 bg-amber-500/5',
    health: 'border-sky-500/20 bg-sky-500/5',
    accent: 'border-violet-500/20 bg-violet-500/5',
    neutral: 'border-border-subtle bg-surface-card/80',
  }

  return (
    <Card className={cn(variantStyles[variant] ?? variantStyles.neutral, className)}>
      <CardHeader>
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      {empty ? (
        <p className="text-sm text-slate-500">—</p>
      ) : (
        <>
          <p className="text-2xl font-semibold text-white tabular-nums">
            {isMonths ? (
              <>
                {value}
                <span className="ml-1 text-base font-normal text-slate-400">meses</span>
              </>
            ) : isScore ? (
              <>
                {value}
                <span className="text-base font-normal text-slate-400">/100</span>
              </>
            ) : isDays ? (
              <>
                {value}
                <span className="ml-1 text-base font-normal text-slate-400">días</span>
              </>
            ) : (
              <Money value={value ?? 0} />
            )}
          </p>
          {subtitle ? (
            <p
              className={cn(
                'mt-1 text-xs',
                direction === 'improving'
                  ? 'text-emerald-400/90'
                  : direction === 'declining'
                    ? 'text-rose-400/90'
                    : 'text-slate-500',
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </>
      )}
    </Card>
  )
}
