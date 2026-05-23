/**
 * Empaqueta todos los locales en el bundle de Vite (fiable en Vercel/producción).
 * El backend dinámico con import() puede fallar al cambiar idioma en CDN estático.
 */
const localeModules = import.meta.glob('../locales/*/*.json', { eager: true })

export function buildI18nResources() {
  /** @type {Record<string, Record<string, object>>} */
  const resources = {}

  for (const [path, mod] of Object.entries(localeModules)) {
    const match = path.match(/\/locales\/([^/]+)\/([^/]+)\.json$/)
    if (!match) continue

    const [, language, namespace] = match
    resources[language] ??= {}
    resources[language][namespace] = mod.default
  }

  return resources
}
