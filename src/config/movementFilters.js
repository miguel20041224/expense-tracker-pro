export const MOVEMENT_FILTERS_STORAGE_KEY = 'finance-movement-filters'

export const QUICK_RANGE_OPTIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'today', label: 'Hoy' },
  { id: 'week', label: 'Esta semana' },
  { id: 'month', label: 'Este mes' },
]

export const FLOW_FILTER_OPTIONS = [
  { id: 'all', label: 'Todos los flujos' },
  { id: 'income', label: 'Ingreso' },
  { id: 'expense', label: 'Gasto' },
]

export const KIND_FILTER_OPTIONS = [
  { id: 'all', label: 'Todos los tipos' },
  { id: 'budget', label: 'Presupuesto' },
  { id: 'expense', label: 'Gasto registrado' },
]

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Más recientes' },
  { id: 'oldest', label: 'Más antiguos' },
  { id: 'expense-high', label: 'Mayor gasto' },
  { id: 'expense-low', label: 'Menor gasto' },
  { id: 'income-high', label: 'Mayor ingreso' },
]

export const DEFAULT_MOVEMENT_FILTERS = {
  query: '',
  flow: 'all',
  kind: 'all',
  category: 'all',
  date: '',
  quickRange: 'all',
  sort: 'newest',
}
