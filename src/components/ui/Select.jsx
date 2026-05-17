import { cn } from '../../utils/cn'

const baseStyles =
  'w-full appearance-none rounded-xl border border-border-subtle bg-surface-card px-3.5 py-2.5 text-sm text-slate-100 ' +
  'shadow-inner shadow-black/10 transition ' +
  'hover:border-white/12 hover:bg-surface-raised ' +
  'focus:border-accent/50 focus:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-accent/25 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export function Select({ className, error, children, ...props }) {
  const hasValue = props.value !== undefined && props.value !== ''

  return (
    <div className="relative">
      <select
        className={cn(
          baseStyles,
          error
            ? 'border-rose-500/40 focus:border-rose-500/50 focus:ring-rose-500/20'
            : null,
          !hasValue && 'text-slate-400',
          'pr-10',
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400"
        aria-hidden
      >
        ▾
      </span>
    </div>
  )
}
