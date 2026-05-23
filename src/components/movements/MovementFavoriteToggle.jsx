import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconStar } from '../icons'
import { isMovementFavorite } from '../../utils/movementFlags'
import { cn } from '../../utils/cn'

const toggleClass =
  'inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-slate-500 transition ' +
  'hover:border-amber-500/25 hover:bg-amber-500/10 hover:text-amber-400 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30 ' +
  'active:scale-95 motion-safe:transition-transform'

export function MovementFavoriteToggle({ transaction, onToggle, className }) {
  const { t } = useTranslation('forms')
  const isFavorite = isMovementFavorite(transaction)
  const [justToggled, setJustToggled] = useState(false)
  const favoriteLabel = isFavorite
    ? t('movements.actions.removeFavorite')
    : t('movements.actions.addFavorite')

  function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    onToggle?.(transaction)
    setJustToggled(true)
    window.setTimeout(() => setJustToggled(false), 320)
  }

  return (
    <button
      type="button"
      className={cn(
        toggleClass,
        isFavorite && 'border-amber-500/20 bg-amber-500/10 text-amber-400',
        className,
      )}
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={favoriteLabel}
      title={favoriteLabel}
    >
      <IconStar
        filled={isFavorite}
        className={cn(
          'size-4 transition-colors duration-200',
          justToggled && 'motion-safe:animate-star-pop',
        )}
      />
    </button>
  )
}
