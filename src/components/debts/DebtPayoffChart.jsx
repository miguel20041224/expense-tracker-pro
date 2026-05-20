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
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-card px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-slate-300">{label}</p>
      <p className="text-expense tabular-nums">
        Saldo: {Number(point?.baseline ?? 0).toLocaleString('es')}
      </p>
      {point?.withExtra != null ? (
        <p className="text-income tabular-nums">
          Con extra: {Number(point.withExtra).toLocaleString('es')}
        </p>
      ) : null}
    </div>
  )
}

export function DebtPayoffChart({ baselineTimeline, withExtraTimeline }) {
  const data = mergeTimelines(baselineTimeline, withExtraTimeline)
  const hasData = data.some((d) => d.baseline > 0 || d.withExtra > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyección de saldo</CardTitle>
        <span className="text-xs text-slate-500">Bola de nieve</span>
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
                name="Sin extra"
              />
              <Area
                type="monotone"
                dataKey="withExtra"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#extraGrad)"
                name="Con extra"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          icon={<IconChart className="size-6" />}
          title="Sin proyección"
          description="Agrega deudas para ver cómo baja tu saldo mes a mes."
        />
      )}

      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-expense" />
          Solo mínimos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-income" />
          Con pago extra
        </span>
      </div>
    </Card>
  )
}

function mergeTimelines(baseline, withExtra) {
  const maxLen = Math.max(baseline?.length ?? 0, withExtra?.length ?? 0)
  const rows = []

  for (let i = 0; i < maxLen; i += 1) {
    const b = baseline?.[i]
    const e = withExtra?.[i]
    rows.push({
      label: b?.label ?? e?.label ?? `Mes ${i}`,
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
