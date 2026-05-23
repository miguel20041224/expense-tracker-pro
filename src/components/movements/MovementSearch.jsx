import { useTranslation } from 'react-i18next'
import { Input } from '../ui/Input'
import { IconSearch, IconX } from '../icons'
import { cn } from '../../utils/cn'

export function MovementSearch({ value, onChange, className }) {
  const { t } = useTranslation('forms')

  return (
    <div className={cn('relative', className)}>
      <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('movements.search.placeholder')}
        className="pl-10 pr-10"
        aria-label={t('movements.search.ariaLabel')}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-0.5 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
          aria-label={t('movements.search.clearAriaLabel')}
        >
          <IconX className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
