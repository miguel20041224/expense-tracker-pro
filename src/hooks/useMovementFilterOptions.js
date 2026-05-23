import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function useMovementFilterOptions() {
  const { t } = useTranslation('forms')

  return useMemo(
    () => ({
      quickRange: [
        { id: 'all', label: t('movements.filters.periodAll') },
        { id: 'today', label: t('movements.filters.periodToday') },
        { id: 'week', label: t('movements.filters.periodWeek') },
        { id: 'month', label: t('movements.filters.periodMonth') },
      ],
      flow: [
        { id: 'all', label: t('movements.filters.flowAll') },
        { id: 'income', label: t('movements.filters.flowIncome') },
        { id: 'expense', label: t('movements.filters.flowExpense') },
      ],
      kind: [
        { id: 'all', label: t('movements.filters.kindAll') },
        { id: 'budget', label: t('movements.filters.kindBudget') },
        { id: 'expense', label: t('movements.filters.kindExpense') },
      ],
      sort: [
        { id: 'newest', label: t('movements.filters.sortNewest') },
        { id: 'oldest', label: t('movements.filters.sortOldest') },
        { id: 'expense-high', label: t('movements.filters.sortExpenseHigh') },
        { id: 'expense-low', label: t('movements.filters.sortExpenseLow') },
        { id: 'income-high', label: t('movements.filters.sortIncomeHigh') },
      ],
      favorites: [
        { id: 'all', label: t('movements.filters.favoritesAll') },
        { id: 'favorites', label: t('movements.filters.favoritesOnly') },
      ],
    }),
    [t],
  )
}
