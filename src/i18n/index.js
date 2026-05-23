import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  I18N_NAMESPACES,
  LANGUAGE_CODES,
  LANGUAGE_STORAGE_KEY,
} from './languages'

const lazyBackend = {
  type: 'backend',
  init() {},
  read(language, namespace, callback) {
    import(`../locales/${language}/${namespace}.json`)
      .then((mod) => callback(null, mod.default))
      .catch((error) => callback(error, null))
  },
}

void i18n
  .use(LanguageDetector)
  .use(lazyBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: LANGUAGE_CODES,
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
    partialBundledLanguages: true,
    lng: DEFAULT_LANGUAGE,
  })

export default i18n
