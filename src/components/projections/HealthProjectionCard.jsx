import { Card, CardHeader, CardTitle } from '../ui/Card'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from '../../utils/cn'

const directionCopy = {
  improving: { label: 'Tendencia positiva', className: 'text-emerald-400' },
  declining: { label: 'Requiere atención', className: 'text-rose-400' },
  stable: { label: 'Estable', className: 'text-slate-400' },
}

export function HealthProjectionCard({ health }) {
  if (!health) return null

  const dir = directionCopy[health.direction] ?? directionCopy.stable
  const chartData = [
    { label: 'Hoy', score: health.currentScore },
    ...(health.points?.map((p) => ({ label: `+${p.month}m`, score: p.score })) ?? []),
  ]

  return (
    <Card className="border-sky-500/15 bg-linear-to-br from-sky-500/5 to-transparent">
      <CardHeader>
        <CardTitle>Salud financiera futura</CardTitle>
        <span className={cn('text-xs font-medium', dir.className)}>{dir.label}</span>
      </CardHeader>

      <div className="flex flex-wrap items-end gap-6">
        <div>
          <p className="text-xs text-slate-500">Hoy</p>
          <p className="text-3xl font-semibold text-white tabular-nums">{health.currentScore}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Proyección</p>
          <p className="text-3xl font-semibold text-sky-300 tabular-nums">
            {health.projectedScore}
          </p>
          <p className="text-xs text-slate-500">{health.projectedLevelLabel}</p>
        </div>
      </div>

      <div className="mt-4 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-card)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={{ r: 3, fill: '#38bdf8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
