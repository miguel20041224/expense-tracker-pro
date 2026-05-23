import { NAV_TAB_IDS } from '../config/navigation'
import { useTranslation } from 'react-i18next'

export function useNavTabs() {
  const { t } = useTranslation('common')

  return NAV_TAB_IDS.map((id) => ({
    id,
    label: t(`nav.${id}`),
  }))
}
