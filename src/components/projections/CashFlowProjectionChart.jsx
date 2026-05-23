import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { IconChart } from '../icons'

function ChartTooltip({ active, payload, label }) {
  const { t, i18n } = useTranslation('projections')

  if (!active || !payload?.length) return null
  const isForecast = payload[0]?.payload?.isForecast
  const seriesLabels = {
    income: t('cashFlow.income'),
    expenses: t('cashFlow.expenses'),
    savings: t('cashFlow.margin'),
  }

  return (
    <div className="rounded-lg border border-border-subtle bg-surface-card px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-slate-300">
        {label}
        {isForecast ? (
          <span className="ml-1 text-violet-400">{t('cashFlow.forecast')}</span>
        ) : null}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="tabular-nums">
          {seriesLabels[entry.name] ?? entry.name}:{' '}
          {Number(entry.value).toLocaleString(i18n.language)}
        </p>
      ))}
    </div>
  )
}

export function CashFlowProjectionChart({ chartTrend }) {
  const { t } = useTranslation('projections')
  const hasData = chartTrend?.some((p) => p.income > 0 || p.expenses > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('cashFlow.title')}</CardTitle>
        <span className="text-xs text-slate-500">{t('cashFlow.subtitle')}</span>
      </CardHeader>

      {hasData ? (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                }
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
                formatter={(value) =>
                  value === 'income'
                    ? t('cashFlow.income')
                    : value === 'expenses'
                      ? t('cashFlow.expenses')
                      : value === 'savings'
                        ? t('cashFlow.margin')
                        : value
                }
              />
              <Line
                type="monotone"
                dataKey="income"
                name="income"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
                strokeDasharray={(d) => (d?.isForecast ? '4 4' : undefined)}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="expenses"
                stroke="#fb7185"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="savings"
                name="savings"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          icon={<IconChart className="size-6" />}
          title={t('cashFlow.emptyTitle')}
          description={t('cashFlow.emptyDescription')}
        />
      )}

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-income" />
          {t('cashFlow.income')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-expense" />
          {t('cashFlow.expenses')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-violet-400" />
          {t('cashFlow.marginProjection')}
        </span>
      </div>
    </Card>
  )
}
