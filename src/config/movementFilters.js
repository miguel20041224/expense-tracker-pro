export const MOVEMENT_FILTERS_STORAGE_KEY = 'finance-movement-filters'

/** IDs de filtros — labels via useMovementFilterOptions() + forms.json */
export const QUICK_RANGE_IDS = ['all', 'today', 'week', 'month']
export const FLOW_FILTER_IDS = ['all', 'income', 'expense']
export const KIND_FILTER_IDS = ['all', 'budget', 'expense']
export const SORT_IDS = ['newest', 'oldest', 'expense-high', 'expense-low', 'income-high']
export const FAVORITE_FILTER_IDS = ['all', 'favorites']

/** @deprecated Use useMovementFilterOptions() for localized labels */
export const QUICK_RANGE_OPTIONS = QUICK_RANGE_IDS.map((id) => ({ id, label: id }))
export const FLOW_FILTER_OPTIONS = FLOW_FILTER_IDS.map((id) => ({ id, label: id }))
export const KIND_FILTER_OPTIONS = KIND_FILTER_IDS.map((id) => ({ id, label: id }))
export const SORT_OPTIONS = SORT_IDS.map((id) => ({ id, label: id }))
export const FAVORITE_FILTER_OPTIONS = FAVORITE_FILTER_IDS.map((id) => ({ id, label: id }))

export const DEFAULT_MOVEMENT_FILTERS = {
  query: '',
  flow: 'all',
  kind: 'all',
  category: 'all',
  date: '',
  quickRange: 'all',
  favoriteFilter: 'all',
  sort: 'newest',
}
