import { QUICK_RANGE_OPTIONS } from '../../config/movementFilters'
import { FilterChip } from '../ui/FilterChip'

export function MovementQuickFilters({ value, onChange }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-0.5"
      role="group"
      aria-label="Filtros rápidos por fecha"
    >
      {QUICK_RANGE_OPTIONS.map((option) => (
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
