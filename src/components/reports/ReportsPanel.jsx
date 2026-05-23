import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { buildAllReports } from '../../intelligence/reports'
import { buildReportPdfFilename, exportReportToPdf } from '../../services/exportReportPdf'
import { ReportDocument } from './ReportDocument'
import { Button } from '../ui/Button'
import { SectionHeader } from '../ui/SectionHeader'
import { cn } from '../../utils/cn'

const REPORT_TYPE_IDS = ['daily', 'weekly', 'monthly']

export function ReportsPanel({ financialData, userName }) {
  const { t, i18n } = useTranslation('reports')
  const [activeType, setActiveType] = useState('monthly')
  const [isExporting, setIsExporting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const printRef = useRef(null)

  const reports = useMemo(
    () => buildAllReports(financialData),
    [financialData, i18n.language],
  )
  const activeReport = reports[activeType]

  function handlePrint() {
    window.print()
  }

  async function handleDownloadPdf() {
    const root = printRef.current
    if (!root) {
      setFeedback({ type: 'error', message: t('panel.pdfLocateError') })
      return
    }

    setFeedback(null)
    setIsExporting(true)

    try {
      const filename = buildReportPdfFilename(activeReport?.generatedAt)
      await exportReportToPdf(root, { filename })
      setFeedback({ type: 'success', message: t('panel.pdfDownloaded', { filename }) })
    } catch (err) {
      console.error('[Reports] PDF export failed:', err)
      setFeedback({
        type: 'error',
        message: err?.message ?? t('panel.pdfGenerateError'),
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="space-y-6">
      <SectionHeader
        variant="accent"
        eyebrow={t('panel.eyebrow')}
        description={t('panel.description')}
        className="print:hidden"
      />

      <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {REPORT_TYPE_IDS.map((typeId) => (
            <button
              key={typeId}
              type="button"
              onClick={() => setActiveType(typeId)}
              className={cn(
                'rounded-xl border px-4 py-2.5 text-left transition',
                activeType === typeId
                  ? 'border-accent/50 bg-accent/15'
                  : 'border-border-subtle bg-white/5 hover:bg-white/8',
              )}
            >
              <span className="block text-sm font-medium text-white">
                {t(`types.${typeId}.label`)}
              </span>
              <span className="block text-xs text-slate-500">
                {t(`types.${typeId}.description`)}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={handlePrint} disabled={isExporting}>
            {t('panel.print')}
          </Button>
          <Button type="button" onClick={handleDownloadPdf} disabled={isExporting}>
            {isExporting ? t('panel.generatingPdf') : t('panel.downloadPdf')}
          </Button>
        </div>
      </div>

      {feedback ? (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            'rounded-lg px-3 py-2 text-sm print:hidden',
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300'
              : 'bg-rose-500/10 text-rose-300',
          )}
        >
          {feedback.message}
        </p>
      ) : null}

      <p className="text-xs text-slate-500 print:hidden">{t('panel.printHint')}</p>

      <div ref={printRef} className="report-print-root">
        <ReportDocument report={activeReport} userName={userName} />
      </div>
    </section>
  )
}
