import {
  resetPdfColorCache,
  sanitizeClonedDocumentForPdf,
} from './pdfExportColorSanitizer'
import '../styles/report-pdf-export.css'

const CAPTURE_CLASS = 'report-pdf-capture'
const RENDER_DELAY_MS = 450

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, RENDER_DELAY_MS)
      })
    })
  })
}

/** @param {string} [generatedAt] */
export function buildReportPdfFilename(generatedAt) {
  const date = generatedAt ? new Date(generatedAt) : new Date()
  return `financial-report-${date.toISOString().slice(0, 10)}.pdf`
}

/**
 * @param {HTMLElement} element — contenedor `.report-print-root`
 * @param {{ filename?: string }} [options]
 */
export async function exportReportToPdf(element, options = {}) {
  if (!element) {
    throw new Error('No se encontró el contenido del reporte para exportar.')
  }

  const filename = options.filename ?? buildReportPdfFilename()
  resetPdfColorCache()

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  element.classList.add(CAPTURE_CLASS)

  try {
    await waitForPaint()

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0a0f1a',
      scrollX: 0,
      scrollY: -window.scrollY,
      width: element.scrollWidth,
      height: element.scrollHeight,
      onclone: (clonedDoc, clonedElement) => {
        sanitizeClonedDocumentForPdf(clonedDoc, element, clonedElement)
      },
    })

    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 8
    const printableWidth = pageWidth - margin * 2
    const printableHeight = pageHeight - margin * 2
    const imgHeightMm = (canvas.height * printableWidth) / canvas.width

    let offsetY = 0
    let pageIndex = 0

    while (offsetY < imgHeightMm) {
      if (pageIndex > 0) pdf.addPage()
      pdf.addImage(imgData, 'PNG', margin, margin - offsetY, printableWidth, imgHeightMm)
      offsetY += printableHeight
      pageIndex += 1
    }

    pdf.save(filename)
  } finally {
    element.classList.remove(CAPTURE_CLASS)
    resetPdfColorCache()
  }
}
