import { GoalForm } from './GoalForm'
import { GoalCard } from './GoalCard'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { IconTarget } from '../icons'

export function GoalsPanel({ goals, onAddGoal, onContribute, onDeleteGoal }) {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-border-subtle bg-surface-card/60 p-5">
        <p className="text-xs font-medium tracking-widest text-slate-500 uppercase">
          Metas financieras
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Define objetivos, sigue el progreso y activa aportes automáticos al registrar ingresos.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <GoalForm onSubmit={onAddGoal} />
        </div>

        <div className="space-y-4 lg:col-span-3">
          {goals.length === 0 ? (
            <Card>
              <EmptyState
                icon={<IconTarget className="size-6" />}
                title="Sin metas definidas"
                description="Crea tu primera meta de ahorro o inversión."
              />
            </Card>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onContribute={onContribute}
                onDelete={onDeleteGoal}
              />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
