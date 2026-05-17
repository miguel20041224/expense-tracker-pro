import { cn } from '../../utils/cn'

const baseStyles =
  'w-full rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition ' +
  'focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(
        baseStyles,
        error
          ? 'border-rose-500/40 focus:border-rose-500/50 focus:ring-rose-500/20'
          : 'border-border-subtle',
        className,
      )}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  )
}
