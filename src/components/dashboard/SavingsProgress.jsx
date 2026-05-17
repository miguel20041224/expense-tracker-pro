import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'

export function SavingsProgress({ current, goal }) {
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta de ahorro</CardTitle>
        <span className="text-sm font-medium text-savings">{progress.toFixed(0)}%</span>
      </CardHeader>

      <p className="text-2xl font-semibold tracking-tight text-white">
        <Money value={current} />
        <span className="text-base font-normal text-slate-500">
          {' '}
          / <Money value={goal} />
        </span>
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-linear-to-r from-savings to-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso de ahorro"
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Te faltan <Money value={Math.max(goal - current, 0)} /> para alcanzar tu meta estimada del mes.
      </p>
    </Card>
  )
}
