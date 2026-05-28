import { cn } from '../../utils/cn'

export function Card({ className, children, ...props }) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border-subtle bg-surface-card/90 p-5 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset] backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export function CardHeader({ className, children }) {
  return (
    <header className={cn('mb-4 flex items-center justify-between gap-3', className)}>
      {children}
    </header>
  )
}

export function CardTitle({ className, children }) {
  return (
    <h2 className={cn('text-sm font-semibold tracking-wide text-slate-300', className)}>
      {children}
    </h2>
  )
}
