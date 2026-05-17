import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Money } from '../currency/Money'

const barColors = [
  'bg-accent',
  'bg-income',
  'bg-savings',
  'bg-rose-400',
  'bg-slate-500',
]

export function CategoryBreakdown({ categories }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoría</CardTitle>
        <span className="text-xs text-slate-500">Este mes</span>
      </CardHeader>

      <ul className="space-y-4">
        {categories.map((cat, index) => (
          <li key={cat.name}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-slate-200">{cat.name}</span>
              <Money value={cat.amount} className="text-slate-400" />
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full ${barColors[index % barColors.length]}`}
                style={{ width: `${cat.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
