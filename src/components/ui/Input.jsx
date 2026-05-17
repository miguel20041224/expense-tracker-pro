import { cn } from '../../utils/cn'

const baseStyles =
  'w-full rounded-xl border border-border-subtle bg-surface-card px-3.5 py-2.5 text-sm text-slate-100 ' +
  'placeholder:text-slate-500 shadow-inner shadow-black/10 transition ' +
  'hover:border-white/12 hover:bg-surface-raised ' +
  'focus:border-accent/50 focus:bg-surface-raised focus:outline-none focus:ring-2 focus:ring-accent/25 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export function Input({ className, error, type, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        baseStyles,
        type === 'date' && 'scheme-dark',
        error
          ? 'border-rose-500/40 focus:border-rose-500/50 focus:ring-rose-500/20'
          : null,
        className,
      )}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  )
}
