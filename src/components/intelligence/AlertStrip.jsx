import { cn } from '../../utils/cn'

const styles = {
  danger: 'border-rose-500/40 bg-rose-500/10 text-rose-200',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
}

export function AlertStrip({ alerts, onViewAll }) {
  const critical = (alerts ?? []).filter((a) => a.type === 'danger' || a.type === 'warning')
  if (critical.length === 0) return null

  const top = critical.slice(0, 2)

  return (
    <section className="space-y-2" aria-label="Alertas financieras">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-medium tracking-widest text-slate-500 uppercase">
          Alertas activas
        </h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-medium text-rose-300">
            {critical.length}
          </span>
          {onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-medium text-accent hover:text-accent/80"
            >
              Ver todas
            </button>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {top.map((alert) => (
          <li
            key={alert.key}
            className={cn(
              'rounded-xl border px-3 py-2.5 text-sm leading-relaxed',
              styles[alert.type] ?? styles.warning,
            )}
          >
            {alert.text}
          </li>
        ))}
      </ul>
    </section>
  )
}
