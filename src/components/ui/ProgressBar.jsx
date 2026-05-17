import { cn } from '../../utils/cn'

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
  barClassName,
  variant = 'default',
}) {
  const percent = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0

  const barVariants = {
    default: 'bg-linear-to-r from-income to-savings',
    accent: 'bg-accent',
    expense: 'bg-expense',
    warning: 'bg-amber-400',
  }

  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-white/5', className)}>
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500',
          barVariants[variant] ?? barVariants.default,
          barClassName,
        )}
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      />
    </div>
  )
}
