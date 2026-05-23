import { useTranslation } from 'react-i18next'
import { FormField } from '../ui/FormField'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'
import { useMovementFilterOptions } from '../../hooks/useMovementFilterOptions'

export function MovementFilterFields({
  filters,
  categories,
  onFilterChange,
}) {
  const { t } = useTranslation('forms')
  const { flow: flowOptions, kind: kindOptions, sort: sortOptions } = useMovementFilterOptions()

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <FormField label={t('fields.flow')} htmlFor="filter-flow">
        <Select
          id="filter-flow"
          value={filters.flow}
          onChange={(event) => onFilterChange('flow', event.target.value)}
        >
          {flowOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label={t('fields.budgetOrExpense')} htmlFor="filter-kind">
        <Select
          id="filter-kind"
          value={filters.kind}
          onChange={(event) => onFilterChange('kind', event.target.value)}
        >
          {kindOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label={t('fields.category')} htmlFor="filter-category">
        <Select
          id="filter-category"
          value={filters.category}
          onChange={(event) => onFilterChange('category', event.target.value)}
        >
          <option value="all">{t('movements.filters.allCategories')}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label={t('fields.date')} htmlFor="filter-date">
        <Input
          id="filter-date"
          type="date"
          value={filters.date}
          onChange={(event) => onFilterChange('date', event.target.value)}
          max={new Date().toISOString().slice(0, 10)}
        />
      </FormField>

      <FormField label={t('fields.sortBy')} htmlFor="filter-sort">
        <Select
          id="filter-sort"
          value={filters.sort}
          onChange={(event) => onFilterChange('sort', event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>
    </div>
  )
}
