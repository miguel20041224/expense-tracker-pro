export const SUPPORTED_LANGUAGES = [
  { code: 'es', label: 'Español', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', nativeLabel: 'Português', flag: '🇧🇷' },
  { code: 'fr', label: 'Français', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', nativeLabel: 'Deutsch', flag: '🇩🇪' },
]

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code)

export const LANGUAGE_STORAGE_KEY = 'vault-language'

export const I18N_NAMESPACES = ['common', 'dashboard', 'reports', 'alerts', 'projections']

export const DEFAULT_LANGUAGE = 'es'

export const FALLBACK_LANGUAGE = 'es'

/** Normaliza códigos tipo "en-US" → "en" para coincidir con supportedLngs. */
export function normalizeLanguageCode(code) {
  if (!code) return FALLBACK_LANGUAGE
  const base = code.split('-')[0]?.toLowerCase()
  return LANGUAGE_CODES.includes(base) ? base : FALLBACK_LANGUAGE
}
