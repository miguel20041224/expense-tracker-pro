import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { MAX_ADVISOR_CLIENTS } from '../../utils/auth/constants'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

export function AdvisorLinkPanel() {
  const { linkedAdvisor, linkAdvisor, unlinkAdvisor, reloadUser } = useAuth()
  const [linkMode, setLinkMode] = useState('code')
  const [advisorKey, setAdvisorKey] = useState('')
  const [advisorEmail, setAdvisorEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLink(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const result = await linkAdvisor({
        advisorKey: linkMode === 'code' ? advisorKey : '',
        advisorEmail: linkMode === 'email' ? advisorEmail : '',
      })
      const advisorName = result?.advisor?.name ?? linkedAdvisor?.name ?? 'tu asesor'
      setSuccess(`Vinculado con ${advisorName} correctamente.`)
      setAdvisorKey('')
      setAdvisorEmail('')
    } catch (err) {
      setError(err.message ?? 'No se pudo vincular al asesor')
    } finally {
      setLoading(false)
    }
  }

  async function handleUnlink() {
    if (!window.confirm('¿Desvincular a tu asesor financiero actual?')) return
    setLoading(true)
    try {
      await unlinkAdvisor()
      setSuccess('Asesor desvinculado.')
      setError('')
    } catch (err) {
      setError(err.message ?? 'No se pudo desvincular')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Asesor financiero</CardTitle>
        </CardHeader>

        <p className="mb-4 text-sm text-slate-400">
          Vincula a un asesor para que pueda ver y analizar tus finanzas en modo solo lectura. Tú
          sigues siendo el único que puede editar tus datos.
        </p>

        {linkedAdvisor ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-sm font-medium text-emerald-200">Asesor vinculado</p>
            <p className="mt-1 text-white">{linkedAdvisor.name}</p>
            <p className="text-sm text-slate-400">{linkedAdvisor.email}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={handleUnlink}
            >
              Desvincular asesor
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLink} className="space-y-4">
            <div className="flex rounded-lg bg-white/5 p-1">
              {[
                { id: 'code', label: 'Código' },
                { id: 'email', label: 'Correo' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLinkMode(tab.id)}
                  className={cn(
                    'flex-1 rounded-md py-1.5 text-xs font-medium transition',
                    linkMode === tab.id ? 'bg-white/10 text-white' : 'text-slate-500',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {linkMode === 'code' ? (
              <label className="block space-y-1.5">
                <span className="text-xs text-slate-400">Código del asesor (advisorKey)</span>
                <input
                  type="text"
                  required
                  value={advisorKey}
                  onChange={(e) => setAdvisorKey(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 font-mono text-sm uppercase tracking-widest text-white outline-none focus:border-accent/50"
                  placeholder="Ej. AB12CD34"
                />
              </label>
            ) : (
              <label className="block space-y-1.5">
                <span className="text-xs text-slate-400">Correo del asesor</span>
                <input
                  type="email"
                  required
                  value={advisorEmail}
                  onChange={(e) => setAdvisorEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
                  placeholder="asesor@ejemplo.com"
                />
              </label>
            )}

            <p className="text-xs text-slate-500">
              Cada asesor puede tener hasta {MAX_ADVISOR_CLIENTS} clientes activos.
            </p>

            <Button type="submit" disabled={loading}>
              {loading ? 'Vinculando…' : 'Vincular asesor'}
            </Button>
          </form>
        )}

        {error ? (
          <p className="mt-3 text-sm text-rose-300" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="mt-3 text-sm text-emerald-300" role="status">
            {success}
          </p>
        ) : null}
      </Card>
    </section>
  )
}
