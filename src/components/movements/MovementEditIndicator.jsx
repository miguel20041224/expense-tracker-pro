import { formatEditedLabel, wasTransactionEdited } from '../../utils/transactionAudit'
import { cn } from '../../utils/cn'

export function MovementEditIndicator({ transaction, locale, className }) {
  if (!wasTransactionEdited(transaction)) return null

  const label = formatEditedLabel(transaction.updatedAt, locale)
  if (!label) return null

  return (
    <p
      className={cn(
        'mt-1 flex items-center gap-1.5 text-[11px] leading-snug text-slate-500',
        className,
      )}
      aria-label={label}
    >
      <span
        className="size-1 shrink-0 rounded-full bg-amber-500/70"
        aria-hidden
      />
      <span>{label}</span>
    </p>
  )
}
