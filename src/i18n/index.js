import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {
  FALLBACK_LANGUAGE,
  I18N_NAMESPACES,
  LANGUAGE_CODES,
  LANGUAGE_STORAGE_KEY,
} from './languages'
import { buildI18nResources } from './resources'

const resources = buildI18nResources()

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: LANGUAGE_CODES,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    ns: I18N_NAMESPACES,
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
    },
  })

export default i18n
