import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '../ui/Card'

const PIE_COLORS = ['#3b82f6', '#34d399', '#60a5fa', '#fb7185', '#a78bfa', '#94a3b8']

const tooltipStyle = {
  contentStyle: {
    background: '#151d2e',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    fontSize: '12px',
  },
  labelStyle: { color: '#94a3b8' },
}

export function CategoryPieChart({ categories }) {
  const data = categories.slice(0, 6).map((c) => ({ name: c.name, value: c.amount }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoría</CardTitle>
      </CardHeader>
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">Sin gastos categorizados este mes.</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}

export function IncomeExpenseLineChart({ trend }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs gastos</CardTitle>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey="income" name="Ingresos" stroke="#34d399" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="expenses" name="Gastos" stroke="#fb7185" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function DebtRiskBarChart({ debtToIncome, creditUsagePercent, riskScore }) {
  const data = [
    { name: 'Deuda / ingreso', value: Math.min(debtToIncome, 100) },
    { name: 'Uso crédito', value: creditUsagePercent },
    { name: 'Índice riesgo', value: Math.min(riskScore, 100) },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicadores de riesgo</CardTitle>
      </CardHeader>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} formatter={(v) => `${Math.round(v)}%`} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.value >= 70 ? '#fb7185' : entry.value >= 40 ? '#fbbf24' : '#34d399'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function CreditUsageBarChart({ cardStats }) {
  const data = cardStats.map(({ card, stats }) => ({
    name: card.name.length > 12 ? `${card.name.slice(0, 12)}…` : card.name,
    usage: Math.round(stats.usagePercent),
  }))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uso de tarjetas</CardTitle>
        </CardHeader>
        <p className="text-sm text-slate-500">El cliente no tiene tarjetas registradas.</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uso de tarjetas de crédito</CardTitle>
      </CardHeader>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} formatter={(v) => `${v}%`} />
            <Bar dataKey="usage" name="% uso" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
