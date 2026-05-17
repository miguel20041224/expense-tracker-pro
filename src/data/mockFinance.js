export const summary = {
  balance: 12450.8,
  income: 5200,
  expenses: 3180.45,
  savings: 2019.55,
  savingsGoal: 3000,
  balanceChange: 4.2,
}

export const transactions = [
  {
    id: '1',
    label: 'Nómina',
    category: 'Ingresos',
    amount: 2800,
    type: 'income',
    date: '2026-05-15',
  },
  {
    id: '2',
    label: 'Supermercado',
    category: 'Alimentación',
    amount: -86.4,
    type: 'expense',
    date: '2026-05-16',
  },
  {
    id: '3',
    label: 'Netflix',
    category: 'Suscripciones',
    amount: -15.99,
    type: 'expense',
    date: '2026-05-14',
  },
  {
    id: '4',
    label: 'Transferencia a ahorro',
    category: 'Ahorro',
    amount: -400,
    type: 'savings',
    date: '2026-05-13',
  },
  {
    id: '5',
    label: 'Freelance',
    category: 'Ingresos',
    amount: 950,
    type: 'income',
    date: '2026-05-12',
  },
]

export const categories = [
  { name: 'Vivienda', amount: 980, percent: 31 },
  { name: 'Alimentación', amount: 520, percent: 16 },
  { name: 'Transporte', amount: 340, percent: 11 },
  { name: 'Ocio', amount: 280, percent: 9 },
  { name: 'Otros', amount: 1060.45, percent: 33 },
]
