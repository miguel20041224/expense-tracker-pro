import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { IconWallet } from '../components/icons'
import { IconBadge } from '../components/ui/IconBadge'
import { LanguageSelector } from '../components/language/LanguageSelector'
import { cn } from '../utils/cn'
import { FirebaseAuthNotice } from '../components/auth/FirebaseAuthNotice'

export default function AuthPage() {
  const { t } = useTranslation('common')
  const { login, register, firebaseConfigError, firebaseReady, firebaseConsoleAuthUrl } = useAuth()
  const [mode, setMode] = useState('login')
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
        await register({ name, email, password })
      }
    } catch (err) {
      setError(err.message ?? t('auth.loginError'))
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
        <div className="mb-6 flex justify-end">
          <LanguageSelector />
        </div>

        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <IconBadge variant="accent" className="size-12">
            <IconWallet className="size-6" />
          </IconBadge>
          <h1 className="text-2xl font-semibold text-white">{t('app.name')}</h1>
          <p className="text-sm text-slate-400">{t('app.subtitle')}</p>
        </div>

        <Card className="animate-fade-in-up">
          <div className="mb-6 flex rounded-xl bg-white/5 p-1">
            {[
              { id: 'login', label: t('auth.login') },
              { id: 'register', label: t('auth.register') },
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
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-400">{t('auth.name')}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
                  placeholder={t('auth.namePlaceholder')}
                />
              </label>
            ) : null}

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-400">{t('auth.email')}</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
                placeholder={t('auth.emailPlaceholder')}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-400">{t('auth.password')}</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
                placeholder={t('auth.passwordPlaceholder')}
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
              {loading
                ? t('auth.processing')
                : mode === 'login'
                  ? t('auth.enter')
                  : t('auth.createAccount')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
