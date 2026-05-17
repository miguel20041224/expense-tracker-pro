import { FormField } from '../ui/FormField'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'
import {
  FLOW_FILTER_OPTIONS,
  KIND_FILTER_OPTIONS,
  SORT_OPTIONS,
} from '../../config/movementFilters'

export function MovementFilterFields({
  filters,
  categories,
  onFilterChange,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <FormField label="Flujo" htmlFor="filter-flow">
        <Select
          id="filter-flow"
          value={filters.flow}
          onChange={(event) => onFilterChange('flow', event.target.value)}
        >
          {FLOW_FILTER_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Presupuesto / gasto" htmlFor="filter-kind">
        <Select
          id="filter-kind"
          value={filters.kind}
          onChange={(event) => onFilterChange('kind', event.target.value)}
        >
          {KIND_FILTER_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Categoría" htmlFor="filter-category">
        <Select
          id="filter-category"
          value={filters.category}
          onChange={(event) => onFilterChange('category', event.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Fecha" htmlFor="filter-date">
        <Input
          id="filter-date"
          type="date"
          value={filters.date}
          onChange={(event) => onFilterChange('date', event.target.value)}
          max={new Date().toISOString().slice(0, 10)}
        />
      </FormField>

      <FormField label="Ordenar por" htmlFor="filter-sort">
        <Select
          id="filter-sort"
          value={filters.sort}
          onChange={(event) => onFilterChange('sort', event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>
    </div>
  )
}
