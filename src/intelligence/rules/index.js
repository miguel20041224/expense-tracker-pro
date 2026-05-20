import { dailyRules } from './daily'
import { weeklyRules } from './weekly'
import { habitRules } from './habits'
import { monthlyRules } from './monthly'

/** Pipeline ordenado: prioridad numérica ascendente al evaluar. */
export const INSIGHT_RULES = [
  ...dailyRules,
  ...weeklyRules,
  ...habitRules,
  ...monthlyRules,
]
