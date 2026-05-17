import { useMemo } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import {
  EXPENSE_TYPES,
  PAYMENT_METHODS,
  collectDynamicCategories,
} from '../../data/expenseTaxonomy'
import {
  EMPTY_TRANSACTION_FILTERS,
  countActiveTransactionFilters,
} from '../../utils/transactionFilters'
import { cn } from '../../utils/cn'

export function AdvisorTransactionFilters({
  filters,
  onChange,
  onReset,
  transactions = [],
  filteredCount = 0,
  totalExpenseCount = 0,
}) {
  const dynamicCategories = useMemo(
    () => collectDynamicCategories(transactions),
    [transactions],
  )

  const activeCount = countActiveTransactionFilters(filters)

  function update(field, value) {
    onChange({ ...filters, [field]: value })
  }

  return (
    <Card className="border-white/5">
      <CardHeader>
        <CardTitle>Filtros de transacciones</CardTitle>
        <span className="text-xs text-slate-500">
          {filteredCount}/{totalExpenseCount} gastos
          {activeCount > 0 ? ` · ${activeCount} activo${activeCount > 1 ? 's' : ''}` : ''}
        </span>
      </CardHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <label className="block space-y-1.5 sm:col-span-1">
          <span className="text-xs font-medium text-slate-400">Tipo de gasto</span>
          <Select
            value={filters.expenseType}
            onChange={(e) => update('expenseType', e.target.value)}
            aria-label="Tipo de gasto"
          >
            <option value="">Todos</option>
            {EXPENSE_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </Select>
        </label>

        <label className="block space-y-1.5 sm:col-span-1">
          <span className="text-xs font-medium text-slate-400">Categoría</span>
          <Select
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
            aria-label="Categoría"
          >
            <option value="">Todas</option>
            {dynamicCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </label>

        <label className="block space-y-1.5 sm:col-span-1">
          <span className="text-xs font-medium text-slate-400">Método de pago</span>
          <Select
            value={filters.paymentMethod}
            onChange={(e) => update('paymentMethod', e.target.value)}
            aria-label="Método de pago"
          >
            <option value="">Todos</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method.id} value={method.id}>
                {method.label}
              </option>
            ))}
          </Select>
        </label>

        <label className="block space-y-1.5 sm:col-span-1">
          <span className="text-xs font-medium text-slate-400">Desde</span>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => update('dateFrom', e.target.value)}
            aria-label="Fecha inicio"
          />
        </label>

        <label className="block space-y-1.5 sm:col-span-1">
          <span className="text-xs font-medium text-slate-400">Hasta</span>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => update('dateTo', e.target.value)}
            aria-label="Fecha fin"
          />
        </label>

        <div className="flex items-end sm:col-span-1">
          <Button
            type="button"
            variant="secondary"
            className={cn('w-full', activeCount === 0 && 'opacity-60')}
            onClick={onReset}
            disabled={activeCount === 0}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </Card>
  )
}
