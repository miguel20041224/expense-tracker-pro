export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-card px-3 py-2 text-xs shadow-elevated">
      <p className="mb-1 font-medium text-slate-300">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="tabular-nums">
          {entry.name}: {Number(entry.value).toLocaleString('es')}
        </p>
      ))}
    </div>
  )
}
