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
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { IconChart } from '../icons'
import { chartColors } from '../../theme/chartColors'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-card/95 px-3 py-2.5 text-xs shadow-lg backdrop-blur-sm">
      <p className="mb-1.5 font-medium text-slate-200">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="tabular-nums">
          {entry.name}: {Number(entry.value).toLocaleString('es')}
        </p>
      ))}
    </div>
  )
}

export function ExpenseTrendChart({ trend }) {
  const hasData = trend?.some((p) => p.income > 0 || p.expenses > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución (6 meses)</CardTitle>
        <span className="text-xs text-slate-500">Ingresos vs gastos</span>
      </CardHeader>

      {hasData ? (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={chartColors.grid} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: chartColors.tick, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: chartColors.tick, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                }
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: chartColors.tick }}
                formatter={(value) =>
                  value === 'income' ? 'Ingresos' : value === 'expenses' ? 'Gastos' : value
                }
              />
              <Line
                type="monotone"
                dataKey="income"
                name="income"
                stroke={chartColors.income}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="expenses"
                stroke={chartColors.expense}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState
          icon={<IconChart className="size-6" />}
          title="Sin historial suficiente"
          description="Registra movimientos en meses anteriores para ver la tendencia."
        />
      )}
    </Card>
  )
}
