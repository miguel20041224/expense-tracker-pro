import { useMemo, useRef, useState } from 'react'
import { buildAllReports } from '../../intelligence/reports'
import { ReportDocument } from './ReportDocument'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { cn } from '../../utils/cn'

const REPORT_TYPES = [
  { id: 'daily', label: 'Diario', description: 'Hoy vs ayer' },
  { id: 'weekly', label: 'Semanal', description: 'Últimos 7 días' },
  { id: 'monthly', label: 'Mensual', description: 'Mes completo' },
]

export function ReportsPanel({ financialData, userName }) {
  const [activeType, setActiveType] = useState('monthly')
  const printRef = useRef(null)

  const reports = useMemo(() => buildAllReports(financialData), [financialData])

  const activeReport = reports[activeType]

  function handlePrint() {
    window.print()
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-accent/15 bg-linear-to-br from-accent/8 via-surface-card/60 to-surface-card/60 p-5 print:hidden">
        <p className="text-xs font-medium tracking-widest text-accent/90 uppercase">
          Reportes profesionales
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Análisis automático con categorías, hábitos, proyecciones y consejos. Exporta con
          imprimir o guardar como PDF desde el diálogo del navegador.
        </p>
      </header>

      <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {REPORT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setActiveType(type.id)}
              className={cn(
                'rounded-xl border px-4 py-2.5 text-left transition',
                activeType === type.id
                  ? 'border-accent/50 bg-accent/15'
                  : 'border-border-subtle bg-white/5 hover:bg-white/8',
              )}
            >
              <span className="block text-sm font-medium text-white">{type.label}</span>
              <span className="block text-xs text-slate-500">{type.description}</span>
            </button>
          ))}
        </div>
        <Button type="button" onClick={handlePrint}>
          Imprimir / PDF
        </Button>
      </div>

      <div ref={printRef} className="report-print-root">
        <ReportDocument report={activeReport} userName={userName} />
      </div>

      <Card className="print:hidden">
        <p className="text-xs text-slate-500">
          Tip: en el diálogo de impresión elige &quot;Guardar como PDF&quot; para exportar el
          reporte {REPORT_TYPES.find((t) => t.id === activeType)?.label.toLowerCase()}.
        </p>
      </Card>
    </section>
  )
}
