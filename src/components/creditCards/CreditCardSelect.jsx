import { useTranslation } from 'react-i18next'
import { Select } from '../ui/Select'

export function CreditCardSelect({ cards, value, onChange, id = 'credit-card', error }) {
  const { t } = useTranslation('forms')

  return (
    <Select id={id} name="creditCardId" value={value} onChange={onChange} error={error}>
      <option value="">{t('expenses.cardSelect.none')}</option>
      {cards.map((card) => (
        <option key={card.id} value={card.id}>
          {card.name}
        </option>
      ))}
    </Select>
  )
}
