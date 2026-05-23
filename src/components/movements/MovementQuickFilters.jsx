import { useMovementFilterOptions } from '../../hooks/useMovementFilterOptions'
import { FilterChip } from '../ui/FilterChip'

export function MovementQuickFilters({ value, onChange }) {
  const { t } = useTranslation('forms')
  const { quickRange: quickRangeOptions } = useMovementFilterOptions()

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-0.5"
      role="group"
      aria-label={t('movements.filters.quickRangeAriaLabel')}
    >
      {quickRangeOptions.map((option) => (
        <FilterChip
          key={option.id}
          active={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </FilterChip>
      ))}
    </div>
  )
}
