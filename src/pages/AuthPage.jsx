import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/auth/constants'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { IconWallet } from '../components/icons'
import { IconBadge } from '../components/ui/IconBadge'
import { cn } from '../utils/cn'
import { FirebaseAuthNotice } from '../components/auth/FirebaseAuthNotice'

export default function AuthPage() {
  const { login, register, firebaseConfigError, firebaseReady, firebaseConsoleAuthUrl } = useAuth()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState(ROLES.CLIENT)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await register({ name, email, password, role })
      }
    } catch (err) {
      setError(err.message ?? 'Error de autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <IconBadge variant="accent" className="size-12">
            <IconWallet className="size-6" />
          </IconBadge>
          <h1 className="text-2xl font-semibold text-white">FINTRACK</h1>
          <p className="text-sm text-slate-400">
            Finanzas personales con Firebase · Panel profesional para asesores
          </p>
        </div>

        <Card className="animate-fade-in-up">
          <div className="mb-6 flex rounded-xl bg-white/5 p-1">
            {[
              { id: 'login', label: 'Iniciar sesión' },
              { id: 'register', label: 'Registrarse' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id)
                  setError('')
                }}
                className={cn(
                  'flex-1 rounded-lg py-2 text-sm font-medium transition',
                  mode === tab.id ? 'bg-accent text-white' : 'text-slate-400 hover:text-slate-200',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' ? (
              <>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-400">Nombre</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
                    placeholder="Tu nombre"
                  />
                </label>

                <fieldset className="space-y-2">
                  <legend className="text-xs font-medium text-slate-400">Tipo de cuenta</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: ROLES.CLIENT, label: 'Cliente', hint: 'Gestiona tus finanzas' },
                      { id: ROLES.ADVISOR, label: 'Asesor', hint: 'Analiza clientes' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRole(opt.id)}
                        className={cn(
                          'rounded-xl border px-3 py-3 text-left transition',
                          role === opt.id
                            ? 'border-accent/50 bg-accent/10'
                            : 'border-border-subtle bg-white/5 hover:bg-white/8',
                        )}
                      >
                        <span className="block text-sm font-medium text-white">{opt.label}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{opt.hint}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </>
            ) : null}

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-400">Correo</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
                placeholder="correo@ejemplo.com"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-400">Contraseña</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
                placeholder="Mínimo 6 caracteres"
              />
            </label>

            <FirebaseAuthNotice
              message={firebaseConfigError}
              consoleUrl={firebaseConsoleAuthUrl}
            />

            {error ? (
              <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading || !firebaseReady}>
              {loading ? 'Procesando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </Button>
          </form>

          {mode === 'register' && role === ROLES.ADVISOR ? (
            <p className="mt-4 text-xs text-slate-500">
              Al registrarte como asesor recibirás un código único para que tus clientes se vinculen
              (máximo 5 clientes activos).
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
