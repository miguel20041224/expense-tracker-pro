export const NAV_TAB_IDS = [
  'inicio',
  'alertas',
  'movimientos',
  'presupuesto',
  'tarjetas',
  'metas',
  'deudas',
  'proyecciones',
  'reportes',
]

/** @deprecated Use NAV_TAB_IDS + useNavTabs() for localized labels */
export const NAV_TABS = NAV_TAB_IDS.map((id) => ({ id, label: id }))
