/** Patrones de color que html2canvas no puede parsear en hojas de estilo. */
const UNSUPPORTED_COLOR_IN_VALUE =
  /oklch\(|oklab\(|lab\(|lch\(|color-mix\(/i

const UNSUPPORTED_COLOR_FN =
  /(?:oklch|oklab|lab|lch|color-mix)\((?:[^()]+|\([^()]*\))*\)/gi

const COLOR_PROPERTIES = [
  'color',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'fill',
  'stroke',
  'stop-color',
]

const colorCache = new Map()

/**
 * Resuelve un valor CSS moderno al rgb/rgba que el navegador ya calculó.
 * @param {string} value
 * @param {Document} doc
 */
export function resolveColorForCanvas(value, doc = document) {
  if (!value || !UNSUPPORTED_COLOR_IN_VALUE.test(value)) return value

  const key = value.trim()
  if (colorCache.has(key)) return colorCache.get(key)

  const win = doc.defaultView
  if (!win) return '#888888'

  const probe = doc.createElement('div')
  probe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden;'
  doc.body.appendChild(probe)

  let resolved = ''
  probe.style.color = key
  resolved = win.getComputedStyle(probe).color

  if (!resolved || resolved === 'rgba(0, 0, 0, 0)') {
    probe.style.color = ''
    probe.style.backgroundColor = key
    resolved = win.getComputedStyle(probe).backgroundColor
  }

  doc.body.removeChild(probe)

  const safe =
    resolved && resolved !== 'rgba(0, 0, 0, 0)' && !UNSUPPORTED_COLOR_IN_VALUE.test(resolved)
      ? resolved
      : '#888888'

  colorCache.set(key, safe)
  return safe
}

/**
 * Reemplaza funciones de color no soportadas en texto CSS (p. ej. Tailwind v4).
 * @param {string} cssText
 * @param {Document} doc
 */
export function sanitizeStylesheetText(cssText, doc = document) {
  if (!cssText || !UNSUPPORTED_COLOR_IN_VALUE.test(cssText)) return cssText

  let result = cssText
  let previous = ''
  let guard = 0

  while (result !== previous && guard < 32) {
    previous = result
    result = result.replace(UNSUPPORTED_COLOR_FN, (match) => resolveColorForCanvas(match, doc))
    guard += 1
  }

  return result
}

function sanitizeInlineStyleAttribute(styleAttr, doc) {
  if (!styleAttr || !UNSUPPORTED_COLOR_IN_VALUE.test(styleAttr)) return styleAttr

  return styleAttr.replace(/([a-z-]+)\s*:\s*([^;]+)/gi, (full, prop, rawValue) => {
    const value = rawValue.trim()
    if (!UNSUPPORTED_COLOR_IN_VALUE.test(value)) return full
    return `${prop}:${resolveColorForCanvas(value, doc)}`
  })
}

/**
 * Copia colores ya computados (rgb) del árbol original al clon.
 * @param {HTMLElement} sourceRoot
 * @param {HTMLElement} cloneRoot
 * @param {Window} sourceWindow
 */
export function syncComputedColorsToClone(sourceRoot, cloneRoot, sourceWindow) {
  if (!sourceRoot || !cloneRoot || !sourceWindow) return

  const sourceNodes = [sourceRoot, ...sourceRoot.querySelectorAll('*')]
  const cloneNodes = [cloneRoot, ...cloneRoot.querySelectorAll('*')]

  if (sourceNodes.length !== cloneNodes.length) {
    console.warn('[PDF] Árbol clonado no coincide; omitiendo sync de colores.')
    return
  }

  for (let i = 0; i < sourceNodes.length; i += 1) {
    const src = sourceNodes[i]
    const clone = cloneNodes[i]
    const computed = sourceWindow.getComputedStyle(src)

    for (const prop of COLOR_PROPERTIES) {
      const value = computed.getPropertyValue(prop)
      if (!value || value === 'transparent' || value === 'rgba(0, 0, 0, 0)') continue
      if (UNSUPPORTED_COLOR_IN_VALUE.test(value)) continue
      clone.style.setProperty(prop, value, 'important')
    }

    if (clone.hasAttribute('style')) {
      const sanitized = sanitizeInlineStyleAttribute(clone.getAttribute('style'), sourceWindow.document)
      clone.setAttribute('style', sanitized)
    }

    if (clone.tagName === 'svg' || src.tagName === 'svg') {
      const fill = computed.fill
      const stroke = computed.stroke
      if (fill && !UNSUPPORTED_COLOR_IN_VALUE.test(fill)) clone.setAttribute('fill', fill)
      if (stroke && !UNSUPPORTED_COLOR_IN_VALUE.test(stroke)) clone.setAttribute('stroke', stroke)
    }
  }
}

/**
 * Prepara el documento clonado de html2canvas para evitar errores oklch/lab.
 * @param {Document} clonedDoc
 * @param {HTMLElement} sourceElement
 * @param {HTMLElement} clonedElement
 */
export function sanitizeClonedDocumentForPdf(clonedDoc, sourceElement, clonedElement) {
  const sourceDoc = sourceElement?.ownerDocument ?? document
  const sourceWin = sourceDoc.defaultView ?? window

  clonedDoc.querySelectorAll('style').forEach((styleEl) => {
    if (styleEl.textContent) {
      styleEl.textContent = sanitizeStylesheetText(styleEl.textContent, sourceDoc)
    }
  })

  clonedDoc.querySelectorAll('[style]').forEach((el) => {
    const attr = el.getAttribute('style')
    if (attr) el.setAttribute('style', sanitizeInlineStyleAttribute(attr, sourceDoc))
  })

  syncComputedColorsToClone(sourceElement, clonedElement, sourceWin)
}

/** Limpia caché entre exportaciones. */
export function resetPdfColorCache() {
  colorCache.clear()
}
