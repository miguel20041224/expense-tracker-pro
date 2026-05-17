import { cn } from '../../utils/cn'

export function EmptyState({ icon, title, description, className, children }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8 text-center sm:py-10', className)}>
      {icon ? (
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-border-subtle bg-white/5 text-slate-400 sm:size-14">
          {icon}
        </div>
      ) : null}
      <p className="text-sm font-medium text-slate-300">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-slate-500">{description}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  )
}
