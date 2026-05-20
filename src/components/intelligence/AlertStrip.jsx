import { cn } from '../../utils/cn'

const styles = {
  danger: 'border-rose-500/40 bg-rose-500/10 text-rose-200',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
}

export function AlertStrip({ insights }) {
  const alerts = (insights ?? []).filter((i) => i.type === 'danger' || i.type === 'warning')
  if (alerts.length === 0) return null

  const top = alerts.slice(0, 2)

  return (
    <section
      className="space-y-2"
      aria-label="Alertas financieras"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-medium tracking-widest text-slate-500 uppercase">
          Alertas activas
        </h2>
        <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-medium text-rose-300">
          {alerts.length}
        </span>
      </div>
      <ul className="space-y-2">
        {top.map((alert) => (
          <li
            key={alert.id}
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
