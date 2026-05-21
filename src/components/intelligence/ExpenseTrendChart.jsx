import { memo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { ChartShell } from '../charts/ChartShell'
import { ChartTooltip } from '../charts/ChartTooltip'
import { IconChart } from '../icons'

function ExpenseTrendChartInner({ trend }) {
  const hasData = trend?.some((p) => p.income > 0 || p.expenses > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolución (6 meses)</CardTitle>
        <span className="text-xs text-slate-500">Ingresos vs gastos</span>
      </CardHeader>

      {hasData ? (
        <ChartShell height={224}>
            <LineChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
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
                  value === 'income' ? 'Ingresos' : value === 'expenses' ? 'Gastos' : value
                }
              />
              <Line
                type="monotone"
                dataKey="income"
                name="income"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="expenses"
                stroke="#fb7185"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
        </ChartShell>
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

export const ExpenseTrendChart = memo(ExpenseTrendChartInner)
