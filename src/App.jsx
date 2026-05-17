export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium tracking-wide text-sky-400 uppercase">
          React + Vite + Tailwind v4
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          Tailwind está funcionando
        </h1>
        <p className="mt-4 text-slate-400">
          Utilidades de Tailwind aplicadas con el plugin oficial{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sky-300">
            @tailwindcss/vite
          </code>
          .
        </p>
      </div>
    </main>
  )
}
