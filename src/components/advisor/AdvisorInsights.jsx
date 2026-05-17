import { Card, CardHeader, CardTitle } from '../ui/Card'
import { cn } from '../../utils/cn'

const typeStyles = {
  danger: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
}

export function AdvisorInsights({ insights }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights automáticos</CardTitle>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-500">Solo lectura</span>
      </CardHeader>
      <ul className="space-y-2">
        {insights.map((item, index) => (
          <li
            key={`${item.type}-${index}`}
            className={cn('rounded-xl border px-3 py-2.5 text-sm', typeStyles[item.type] ?? typeStyles.info)}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </Card>
  )
}
