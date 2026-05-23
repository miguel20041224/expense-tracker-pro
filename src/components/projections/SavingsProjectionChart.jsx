import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { IconPiggyBank } from '../icons'

export function SavingsProjectionChart({ savingsProjection }) {
  const { t, i18n } = useTranslation('projections')
  const points = savingsProjection?.points ?? []
  const hasData = points.some((p) => p.cumulative > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('savingsChart.title')}</CardTitle>
        <span className="text-xs text-slate-500">{t('savingsChart.subtitle')}</span>
      </CardHeader>

      {hasData ? (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsProjGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
              />
              <Tooltip
                formatter={(v) => Number(v).toLocaleString(i18n.language)}
                contentStyle={{
                  background: 'var(--color-surface-card)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                name={t('savingsChart.cumulative')}
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#savingsProjGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          icon={<IconPiggyBank className="size-6" />}
          title={t('savingsChart.emptyTitle')}
          description={t('savingsChart.emptyDescription')}
        />
      )}
    </Card>
  )
}
