import { useTranslation } from 'react-i18next'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

export function ExtraPaymentSuggestions({ suggestions, selectedExtra, onSelect }) {
  const { t } = useTranslation('forms')
  const { t: tp } = useTranslation('projections')

  if (!suggestions?.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      <span className="w-full text-xs text-slate-500">{t('debts.extraPayment.tryAmounts')}</span>
      {suggestions.map((item) => {
        const active = selectedExtra === item.amount
        return (
          <button
            key={item.amount}
            type="button"
            onClick={() => onSelect(String(item.amount))}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition',
              active
                ? 'border-accent/50 bg-accent/15 text-white'
                : 'border-border-subtle bg-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200',
            )}
          >
            +<Money value={item.amount} />
            {item.monthsSaved > 0 ? (
              <span className="ml-1 text-income">
                {tp('healthChart.monthOffset', { months: item.monthsSaved }).replace('+', '−')}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
