import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Money } from '../currency/Money'
import { ProgressBar } from '../ui/ProgressBar'
import { IconPiggyBank } from '../icons'
import { cn } from '../../utils/cn'

export function GoalProjectionList({ goals }) {
  const active = goals?.filter((g) => !g.isComplete) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metas estimadas</CardTitle>
        <span className="text-xs text-slate-500">ETA al ritmo actual</span>
      </CardHeader>

      {active.length === 0 ? (
        <EmptyState
          icon={<IconPiggyBank className="size-6" />}
          title="Sin metas activas"
          description="Crea metas en la pestaña Metas para ver cuándo podrías completarlas."
        />
      ) : (
        <ul className="space-y-4">
          {active.map((goal) => (
            <li key={goal.id} className="rounded-xl border border-border-subtle bg-white/3 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-200">{goal.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Faltan <Money value={goal.remaining} />
                  </p>
                </div>
                {goal.monthsToComplete != null ? (
                  <span
                    className={cn(
                      'rounded-md px-2 py-0.5 text-xs font-medium',
                      goal.targetDateStatus === 'behind'
                        ? 'bg-rose-500/15 text-rose-300'
                        : 'bg-emerald-500/15 text-emerald-300',
                    )}
                  >
                    ~{goal.monthsToComplete} meses
                    {goal.etaLabel ? ` · ${goal.etaLabel}` : ''}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Sin ritmo de ahorro</span>
                )}
              </div>
              <ProgressBar value={goal.percent} className="mt-3" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
