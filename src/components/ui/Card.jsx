import { cn } from '../../utils/cn'

export function Card({ className, children, ...props }) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border-subtle bg-surface-card/80 p-5 backdrop-blur-sm',
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
    <h2 className={cn('text-sm font-medium tracking-wide text-slate-400', className)}>
      {children}
    </h2>
  )
}
