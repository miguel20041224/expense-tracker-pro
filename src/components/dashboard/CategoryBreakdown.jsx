import { Card, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { Money } from '../currency/Money'
import { IconChart } from '../icons'
import { chartColors } from '../../theme/chartColors'

export function CategoryBreakdown({ categories }) {
  const hasCategories = categories.length > 0
  const palette = chartColors.categoryPalette

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Gastos por categoría</CardTitle>
        {hasCategories ? (
          <span className="text-xs text-slate-500">Este mes</span>
        ) : null}
      </CardHeader>

      {hasCategories ? (
        <ul className="space-y-4">
          {categories.map((cat, index) => (
            <li key={cat.name}>
              <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-slate-200">{cat.name}</span>
                <span className="shrink-0 tabular-nums text-slate-400">
                  <Money value={cat.amount} />
                  <span className="ml-1.5 text-xs text-slate-500">({cat.percent}%)</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <span
                  className="block h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percent}%`,
                    backgroundColor: palette[index % palette.length],
                    minWidth: cat.percent > 0 ? '4px' : undefined,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<IconChart className="size-5" />}
          title="Sin gastos por categoría"
          description="Cuando registres gastos con categoría, verás aquí el desglose y los porcentajes del mes."
        />
      )}
    </Card>
  )
}
