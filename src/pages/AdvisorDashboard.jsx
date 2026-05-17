import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { MAX_ADVISOR_CLIENTS } from '../utils/auth/constants'
import { AdvisorShell } from '../components/layout/AdvisorShell'
import { AdvisorClientDetail } from '../components/advisor/AdvisorClientDetail'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { IconChart } from '../components/icons'
import { cn } from '../utils/cn'

export default function AdvisorDashboard() {
  const { user, clients, reloadUser } = useAuth()
  const clientUid = (c) => c.uid ?? c.id
  const [selectedClientId, setSelectedClientId] = useState(() =>
    clients[0] ? clientUid(clients[0]) : null,
  )

  useEffect(() => {
    if (clients.length === 0) {
      setSelectedClientId(null)
      return
    }
    if (!clients.some((c) => clientUid(c) === selectedClientId)) {
      setSelectedClientId(clientUid(clients[0]))
    }
  }, [clients, selectedClientId])

  const selectedClient =
    clients.find((c) => clientUid(c) === selectedClientId) ?? null

  return (
    <AdvisorShell onRefresh={reloadUser}>
      <div className="space-y-6">
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle>Tu código de asesor</CardTitle>
          </CardHeader>
          <p className="font-mono text-2xl font-semibold tracking-[0.2em] text-white">
            {user.advisorKey}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Comparte este código o tu correo ({user.email}) para que los clientes se vinculen.
            Cupo: {clients.length}/{MAX_ADVISOR_CLIENTS} clientes activos.
          </p>
        </Card>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4 xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Clientes vinculados</CardTitle>
                <span className="text-xs text-slate-500">{clients.length}</span>
              </CardHeader>

              {clients.length === 0 ? (
                <EmptyState
                  icon={<IconChart className="size-5" />}
                  title="Sin clientes"
                  description="Cuando un cliente te vincule con tu código o correo, aparecerá aquí."
                />
              ) : (
                <ul className="space-y-1">
                  {clients.map((client) => {
                    const active = clientUid(client) === selectedClientId
                    return (
                      <li key={client.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedClientId(clientUid(client))}
                          className={cn(
                            'w-full rounded-xl px-3 py-2.5 text-left transition',
                            active
                              ? 'bg-accent/15 text-white ring-1 ring-accent/30'
                              : 'text-slate-300 hover:bg-white/5',
                          )}
                        >
                          <span className="block text-sm font-medium">{client.name}</span>
                          <span className="block truncate text-xs text-slate-500">
                            {client.email}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Card>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9">
            {selectedClient ? (
              <AdvisorClientDetail advisor={user} client={selectedClient} />
            ) : (
              <Card>
                <EmptyState
                  icon={<IconChart className="size-6" />}
                  title="Selecciona un cliente"
                  description="Elige un cliente de la lista para ver su análisis financiero en modo solo lectura."
                />
              </Card>
            )}
          </section>
        </div>
      </div>
    </AdvisorShell>
  )
}
