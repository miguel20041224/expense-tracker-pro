import { cn } from '../../utils/cn'

const variants = {
  default: 'bg-white/5 text-slate-300',
  income: 'bg-emerald-500/10 text-income',
  expense: 'bg-rose-500/10 text-expense',
  savings: 'bg-blue-500/10 text-savings',
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
