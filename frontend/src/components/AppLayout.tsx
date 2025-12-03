import type { ReactNode } from 'react'

interface AppLayoutProps {
  version?: string
  children: ReactNode
}

function AppLayout({ version, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-planty-background text-slate-900">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-planty-primary text-white shadow-lg">
              <span className="text-lg font-semibold">P</span>
            </div>
            <div>
              <p className="text-sm font-medium text-planty-primary">Planty</p>
              <p className="text-base font-semibold text-slate-900">PlantUML Gantt Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-planty-secondary/15 px-3 py-1 font-medium text-planty-primary">Dev Ready</span>
            <a
              className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-planty-secondary hover:text-planty-primary"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-10">{children}</main>

      <footer className="border-t border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-planty-secondary" aria-hidden />
            <span>Монорепозитория Planty готова к следующему эпику</span>
          </div>
          <div className="flex items-center gap-4">
            {version && <span className="rounded bg-slate-100 px-2 py-1 font-medium">{version}</span>}
            <a
              className="text-planty-primary underline-offset-4 hover:underline"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              GitHub репозиторий
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
