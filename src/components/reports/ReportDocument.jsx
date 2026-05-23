import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { Money } from '../currency/Money'
import { cn } from '../../utils/cn'

const metricVariants = {
  income: 'text-income',
  expense: 'text-expense',
  accent: 'text-accent',
  neutral: 'text-white',
}

function formatMetricValue(metric) {
  if (metric.format === 'percent') {
    const n = Number(metric.value)
    const sign = n > 0 ? '+' : ''
    return `${sign}${Math.round(n)}%`
  }
  if (metric.format === 'score') return `${metric.value}/100`
  if (metric.format === 'number') return String(metric.value)
  return <Money value={metric.value} />
}

export function ReportDocument({ report, userName }) {
  const { t, i18n } = useTranslation(['reports', 'forms'])

  if (!report) return null

  return (
    <article className="report-document space-y-8 rounded-2xl border border-border-subtle bg-surface-card/80 p-6 sm:p-8 print:border-0 print:bg-white print:p-0 print:text-black">
      <header className="border-b border-white/10 pb-6 print:border-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase print:text-slate-600">
              {t('document.brand')}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white print:text-slate-900">
              {t(`reports:${report.id}.title`, { defaultValue: report.title })}
            </h1>
            <p className="mt-1 text-sm text-slate-400 print:text-slate-600">
              {t(`reports:${report.id}.subtitle`, { defaultValue: report.subtitle })}
            </p>
            <p className="mt-2 text-xs text-slate-500">{report.periodLabel}</p>
          </div>
          <div className="text-right">
            {userName ? (
              <p className="text-sm font-medium text-slate-200 print:text-slate-800">{userName}</p>
            ) : null}
            <p className="mt-1 text-xs text-slate-500">
              {t('document.generated', {
                date: new Date(report.generatedAt).toLocaleString(i18n.language),
              })}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 print:border-slate-300 print:bg-slate-50">
              <span className="text-2xl font-bold tabular-nums text-white print:text-slate-900">
                {report.healthScore}
              </span>
              <span className="text-left text-xs text-slate-400 print:text-slate-600">
                {t('document.health')}
                <br />
                <span className="font-medium text-slate-200 print:text-slate-800">
                  {report.healthLabel}
                </span>
              </span>
            </div>
          </div>
        </div>

        {report.highlights?.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {report.highlights.map((text) => (
              <li
                key={text}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300 print:bg-slate-100 print:text-slate-700"
              >
                {text}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {report.sections?.map((section) => (
        <section key={section.id} className="report-section break-inside-avoid">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase print:text-slate-800">
            {section.title}
          </h2>

          {section.metrics?.length ? (
            <dl className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {section.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-border-subtle bg-white/3 px-4 py-3 print:border-slate-200 print:bg-slate-50"
                >
                  <dt className="text-xs text-slate-500">{m.label}</dt>
                  <dd
                    className={cn(
                      'mt-1 text-lg font-semibold tabular-nums',
                      metricVariants[m.variant] ?? metricVariants.neutral,
                      'print:text-slate-900',
                    )}
                  >
                    {formatMetricValue(m)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {section.categories?.length ? (
            <ul className="space-y-2">
              {section.categories.map((cat) => (
                <li key={cat.name} className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5 print:bg-slate-200">
                    <span
                      className="block h-full rounded-full bg-accent print:bg-slate-600"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                  <span className="w-28 shrink-0 text-sm text-slate-300 print:text-slate-700">
                    {cat.name}
                  </span>
                  <span className="w-20 shrink-0 text-right text-sm tabular-nums text-slate-400 print:text-slate-600">
                    <Money value={cat.amount} /> ({cat.percent}%)
                  </span>
                </li>
              ))}
            </ul>
          ) : section.categories ? (
            <p className="text-sm text-slate-500">{section.emptyMessage}</p>
          ) : null}

          {section.items?.length ? (
            <ul className="divide-y divide-white/5 rounded-xl border border-border-subtle print:divide-slate-200 print:border-slate-200">
              {section.items.map((item, i) => (
                <li
                  key={`${item.label}-${i}`}
                  className="flex justify-between gap-4 px-4 py-2.5 text-sm"
                >
                  <span className="text-slate-300 print:text-slate-800">
                    {item.label}
                    <span className="ml-2 text-xs text-slate-500">{item.category}</span>
                  </span>
                  <Money value={item.amount} className="text-expense" />
                </li>
              ))}
            </ul>
          ) : section.items ? (
            <p className="text-sm text-slate-500">{section.emptyMessage}</p>
          ) : null}

          {section.goals?.length ? (
            <ul className="space-y-3">
              {section.goals.map((g) => (
                <li key={g.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-200 print:text-slate-800">{g.name}</span>
                    <span className="text-slate-500">{g.percent}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5 print:bg-slate-200">
                    <span
                      className="block h-full rounded-full bg-income print:bg-emerald-600"
                      style={{ width: `${g.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : section.goals ? (
            <p className="text-sm text-slate-500">{section.emptyMessage}</p>
          ) : null}

          {section.trend?.length ? (
            <div className="h-48 print:h-40">
              <ResponsiveContainer width="100%" height="100%" className="print:hidden">
                <LineChart data={section.trend}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} width={40} />
                  <Tooltip />
                  <Line type="monotone" dataKey="expenses" stroke="#fb7185" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}

          {section.paragraphs?.map((p) => (
            <p key={p} className="mb-2 text-sm leading-relaxed text-slate-400 print:text-slate-700">
              {p}
            </p>
          ))}

          {section.bullets?.length ? (
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-400 print:text-slate-700">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      {report.dailySeries?.length ? (
        <section className="break-inside-avoid print:hidden">
          <h2 className="mb-4 text-sm font-semibold text-white uppercase">
            {t('document.dailySpend')}
          </h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.dailySeries}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} width={36} />
                <Tooltip />
                <Bar dataKey="expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      {report.tips?.length ? (
        <footer className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 print:border-slate-300 print:bg-slate-50">
          <h2 className="text-xs font-semibold tracking-wide text-emerald-400 uppercase print:text-slate-700">
            {t('document.copilotTips')}
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-300 print:text-slate-700">
            {report.tips.map((tip) => (
              <li key={tip}>· {tip}</li>
            ))}
          </ul>
        </footer>
      ) : null}
    </article>
  )
}
