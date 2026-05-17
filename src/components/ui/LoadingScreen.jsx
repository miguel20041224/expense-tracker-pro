export function LoadingScreen({ message = 'Cargando FINTRACK…' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-3">
        <div
          className="size-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent"
          role="status"
          aria-label={message}
        />
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </div>
  )
}