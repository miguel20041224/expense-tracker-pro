import { useTranslation } from 'react-i18next'
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

export function HealthProjectionCard({ health }) {
  const { t } = useTranslation(['projections', 'forms'])

  if (!health) return null

  const directionCopy = {
    improving: { label: t('health.improving'), className: 'text-emerald-400' },
    declining: { label: t('health.declining'), className: 'text-rose-400' },
    stable: { label: t('health.stable'), className: 'text-slate-400' },
  }

  const dir = directionCopy[health.direction] ?? directionCopy.stable
  const chartData = [
    { label: t('projections.healthChart.today', { ns: 'forms' }), score: health.currentScore },
    ...(health.points?.map((p) => ({
      label: t('projections.healthChart.monthOffset', { ns: 'forms', months: p.month }),
      score: p.score,
    })) ?? []),
  ]

  return (
    <Card className="border-sky-500/15 bg-linear-to-br from-sky-500/5 to-transparent">
      <CardHeader>
        <CardTitle>{t('health.title')}</CardTitle>
        <span className={cn('text-xs font-medium', dir.className)}>{dir.label}</span>
      </CardHeader>

      <div className="flex flex-wrap items-end gap-6">
        <div>
          <p className="text-xs text-slate-500">{t('health.today')}</p>
          <p className="text-3xl font-semibold text-white tabular-nums">{health.currentScore}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">{t('health.projection')}</p>
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
