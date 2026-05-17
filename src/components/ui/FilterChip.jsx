import { cn } from '../../utils/cn'

export function FilterChip({ active, children, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
        active
          ? 'border-accent/40 bg-accent/15 text-white'
          : 'border-border-subtle bg-white/3 text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-slate-200',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
