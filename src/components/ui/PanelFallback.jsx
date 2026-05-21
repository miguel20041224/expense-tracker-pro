import { cn } from '../../utils/cn'

export function PanelFallback({ label = 'Cargando…', className }) {
  return (
    <div
      className={cn(
        'flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-border-subtle bg-surface-card/60 p-8',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="size-7 animate-spin rounded-full border-2 border-accent/25 border-t-accent" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}
