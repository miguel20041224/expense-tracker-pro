import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-accent text-white shadow-lg shadow-accent/20 hover:bg-blue-500 focus-visible:ring-accent/40',
  secondary:
    'border border-border-subtle bg-white/5 text-slate-200 hover:bg-white/8 focus-visible:ring-white/20',
}

const sizes = {
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface ' +
          'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
