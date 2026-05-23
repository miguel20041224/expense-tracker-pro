import { useTranslation } from 'react-i18next'
import { formatMovementDateTime } from '../../utils/movements'
import { isValidAuditTimestamp, wasTransactionEdited } from '../../utils/transactionAudit'
import { cn } from '../../utils/cn'

export function MovementEditIndicator({ transaction, locale, className }) {
  const { t } = useTranslation('forms')

  if (!wasTransactionEdited(transaction)) return null

  const updatedAt = transaction.updatedAt
  if (!isValidAuditTimestamp(updatedAt)) return null

  const label = t('movements.audit.editedAt', {
    datetime: formatMovementDateTime(updatedAt, locale),
  })

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
