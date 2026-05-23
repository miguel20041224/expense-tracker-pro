import { useTranslation } from 'react-i18next'
import { IconPencil, IconTrash } from '../icons'
import { cn } from '../../utils/cn'

const actionButtonClass =
  'inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-slate-400 transition ' +
  'hover:border-border-subtle hover:bg-white/6 hover:text-slate-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30'

export function MovementActionButtons({ onEdit, onDelete, className }) {
  const { t } = useTranslation('forms')

  return (
    <div className={cn('flex shrink-0 items-center gap-1', className)}>
      <button
        type="button"
        className={cn(actionButtonClass, 'hover:text-accent')}
        onClick={onEdit}
        aria-label={t('movements.actions.editAriaLabel')}
      >
        <IconPencil className="size-4" />
      </button>
      <button
        type="button"
        className={cn(actionButtonClass, 'hover:text-expense')}
        onClick={onDelete}
        aria-label={t('movements.actions.deleteAriaLabel')}
      >
        <IconTrash className="size-4" />
      </button>
    </div>
  )
}
