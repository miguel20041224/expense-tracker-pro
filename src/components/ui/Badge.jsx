import { cn } from '../../utils/cn'

const variants = {
  neutral: 'bg-white/5 text-slate-300',
  positive: 'bg-emerald-500/10 text-emerald-400',
  negative: 'bg-rose-500/10 text-rose-400',
}

export function Badge({ variant = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
