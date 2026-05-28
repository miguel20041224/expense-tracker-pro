import { cn } from '../../utils/cn'

const variants = {
  default: 'bg-white/5 text-slate-300',
  income: 'bg-income/12 text-income',
  expense: 'bg-expense/12 text-expense',
  savings: 'bg-savings/12 text-savings',
  accent: 'bg-accent/15 text-accent',
}

export function IconBadge({ variant = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-xl',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
