import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { IconChart } from '../icons'

function ChartTooltip({ active, payload, label }) {
  const { t: tp, i18n } = useTranslation('projections')

  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-card px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-slate-300">{label}</p>
      <p className="text-expense tabular-nums">
        {tp('debtChart.balance')}: {Number(point?.baseline ?? 0).toLocaleString(i18n.language)}
      </p>
      {point?.withExtra != null ? (
        <p className="text-income tabular-nums">
          {tp('debtChart.withExtra')}: {Number(point.withExtra).toLocaleString(i18n.language)}
        </p>
      ) : null}
    </div>
  )
}

export function DebtPayoffChart({ baselineTimeline, withExtraTimeline }) {
  const { t: tf } = useTranslation('forms')
  const { t: tp } = useTranslation('projections')
  const data = useMemo(
    () => mergeTimelines(baselineTimeline, withExtraTimeline, tf),
    [baselineTimeline, withExtraTimeline, tf],
  )
  const hasData = data.some((d) => d.baseline > 0 || d.withExtra > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tp('debtChart.title')}</CardTitle>
        <span className="text-xs text-slate-500">{tp('debtChart.subtitle')}</span>
      </CardHeader>

      {hasData ? (
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="extraGrad" x1="0" y1="0" x2="0" y2="1">
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
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="baseline"
                stroke="#fb7185"
                strokeWidth={2}
                fill="url(#baselineGrad)"
                name={tp('debtChart.withoutExtra')}
              />
              <Area
                type="monotone"
                dataKey="withExtra"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#extraGrad)"
                name={tp('debtChart.withExtra')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          icon={<IconChart className="size-6" />}
          title={tp('debtChart.emptyTitle')}
          description={tp('debtChart.emptyDescription')}
        />
      )}

      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-expense" />
          {tp('debtChart.minimumOnly')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-income" />
          {tp('debtChart.withExtraPayment')}
        </span>
      </div>
    </Card>
  )
}

function mergeTimelines(baseline, withExtra, t) {
  const maxLen = Math.max(baseline?.length ?? 0, withExtra?.length ?? 0)
  const rows = []

  for (let i = 0; i < maxLen; i += 1) {
    const b = baseline?.[i]
    const e = withExtra?.[i]
    rows.push({
      label: b?.label ?? e?.label ?? t('debts.chart.monthLabel', { index: i }),
      baseline: b?.totalBalance ?? 0,
      withExtra: e?.totalBalance ?? 0,
    })
  }

  return downsampleTimeline(rows, 24)
}

/** Reduce puntos para gráficos legibles en deudas largas. */
function downsampleTimeline(rows, maxPoints) {
  if (rows.length <= maxPoints) return rows
  const step = Math.ceil(rows.length / maxPoints)
  const sampled = rows.filter((_, i) => i === 0 || i === rows.length - 1 || i % step === 0)
  return sampled
}
