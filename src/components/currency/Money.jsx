import { useCurrency } from '../../hooks/useCurrency'
import { cn } from '../../utils/cn'

export function Money({ value, className, compact = false }) {
  const { formatCurrency, formatCompact } = useCurrency()
  const formatted = compact ? formatCompact(value) : formatCurrency(value)

  return <span className={cn('tabular-nums', className)}>{formatted}</span>
}
