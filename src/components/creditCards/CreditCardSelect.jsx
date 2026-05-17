import { Select } from '../ui/Select'

export function CreditCardSelect({ cards, value, onChange, id = 'credit-card', error }) {
  return (
    <Select id={id} name="creditCardId" value={value} onChange={onChange} error={error}>
      <option value="">Sin tarjeta (gasto normal)</option>
      {cards.map((card) => (
        <option key={card.id} value={card.id}>
          {card.name}
        </option>
      ))}
    </Select>
  )
}
