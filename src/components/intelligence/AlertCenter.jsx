import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { IconBell } from '../icons'
import { cn } from '../../utils/cn'
import { getDismissedHistory } from '../../intelligence/alerts'

const severityStyles = {
  danger: 'border-rose-500/35 bg-rose-500/10',
  warning: 'border-amber-500/35 bg-amber-500/10',
  info: 'border-sky-500/35 bg-sky-500/10',
  success: 'border-emerald-500/35 bg-emerald-500/10',
}

const severityText = {
  danger: 'text-rose-200',
  warning: 'text-amber-200',
  info: 'text-sky-200',
  success: 'text-emerald-200',
}

const categoryLabels = {
  balance: 'Saldo',
  debt: 'Deudas',
  credit: 'Crédito',
  habits: 'Hábitos',
  daily: 'Hoy',
  weekly: 'Semana',
  monthly: 'Mes',
}

function AlertRow({ alert, onDismiss, dismissLabel = 'Descartar' }) {
  return (
    <li
      className={cn(
        'flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between',
        severityStyles[alert.type] ?? severityStyles.info,
      )}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'text-[10px] font-semibold tracking-wide uppercase',
              severityText[alert.type] ?? severityText.info,
            )}
          >
            {alert.type === 'danger' ? 'Crítica' : alert.type === 'warning' ? 'Aviso' : 'Info'}
          </span>
          {alert.category ? (
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">
              {categoryLabels[alert.category] ?? alert.category}
            </span>
          ) : null}
        </div>
        <p className={cn('text-sm leading-relaxed', severityText[alert.type] ?? 'text-slate-200')}>
          {alert.text}
        </p>
      </div>
      {onDismiss ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 self-start"
          onClick={() => onDismiss(alert.key)}
        >
          {dismissLabel}
        </Button>
      ) : null}
    </li>
  )
}

export function AlertCenter({
  activeAlerts,
  allAlerts,
  dismissedAlerts,
  onDismiss,
  onRestore,
  onDismissAll,
}) {
  const history = getDismissedHistory(allAlerts, dismissedAlerts, 5)
  const dangerCount = activeAlerts.filter((a) => a.type === 'danger').length
  const warningCount = activeAlerts.filter((a) => a.type === 'warning').length

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-border-subtle bg-surface-card/60 p-5">
        <p className="text-xs font-medium tracking-widest text-accent/90 uppercase">
          Centro de alertas
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Alertas generadas automáticamente según tus movimientos, deudas y hábitos. Puedes
          descartarlas; se renovarán en el próximo período si el riesgo continúa.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-lg bg-rose-500/15 px-3 py-1 text-rose-300">
            {dangerCount} críticas
          </span>
          <span className="rounded-lg bg-amber-500/15 px-3 py-1 text-amber-300">
            {warningCount} avisos
          </span>
          <span className="rounded-lg bg-white/5 px-3 py-1 text-slate-400">
            {activeAlerts.length} activas
          </span>
        </div>
        {activeAlerts.length > 1 ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => onDismissAll(activeAlerts.map((a) => a.key))}
          >
            Descartar todas las activas
          </Button>
        ) : null}
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Alertas activas</CardTitle>
        </CardHeader>

        {activeAlerts.length > 0 ? (
          <ul className="space-y-3">
            {activeAlerts.map((alert) => (
              <AlertRow key={alert.key} alert={alert} onDismiss={onDismiss} />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<IconBell className="size-6" />}
            title="Sin alertas activas"
            description="Cuando detectemos riesgos financieros, aparecerán aquí."
          />
        )}
      </Card>

      {history.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Descartadas recientemente</CardTitle>
          </CardHeader>
          <ul className="space-y-3 opacity-80">
            {history.map((alert) => (
              <AlertRow
                key={alert.key}
                alert={alert}
                onDismiss={onRestore ? () => onRestore(alert.key) : null}
                dismissLabel="Restaurar"
              />
            ))}
          </ul>
        </Card>
      ) : null}
    </section>
  )
}
