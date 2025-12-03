import AppLayout from './components/AppLayout'
import AiAssistantPlaceholder from './components/placeholders/AiAssistantPlaceholder'
import GanttPlaceholder from './components/placeholders/GanttPlaceholder'
import UmlEditorPlaceholder from './components/placeholders/UmlEditorPlaceholder'

const version = 'v0.1.0'

function App() {
  return (
    <AppLayout version={version}>
      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-planty-primary">Planty</p>
          <h1 className="text-3xl font-semibold text-slate-900">Визуальный редактор PlantUML Gantt</h1>
          <p className="text-lg leading-relaxed text-slate-700">
            Быстрый каркас для будущего приложения: диаграмма Ганта, PlantUML-редактор и AI-помощник.
            Фронтенд запускается на Vite + React + TypeScript, бэкенд — на FastAPI.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2 rounded-lg bg-planty-background p-3">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-planty-secondary" aria-hidden />
                <span>Двусторонняя синхронизация с PlantUML-кодом (в разработке)</span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-planty-background p-3">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-planty-secondary" aria-hidden />
                <span>Drag & drop редактор задач и зависимостей</span>
              </li>
              <li className="flex items-start gap-2 rounded-lg bg-planty-background p-3">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-planty-secondary" aria-hidden />
                <span>AI-помощник для генерации и правки диаграмм</span>
              </li>
            </ul>
            <div className="rounded-xl border border-planty-secondary/30 bg-white p-4 shadow-inner">
              <p className="text-sm font-semibold text-planty-primary">Каркас dev-режима</p>
              <p className="mt-2 text-sm text-slate-700">
                Запускайте фронтенд и бэкенд одной командой <code className="rounded bg-slate-100 px-1">npm run dev</code>.
                API доступно по <code className="rounded bg-slate-100 px-1">http://localhost:8000/api</code>.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <GanttPlaceholder />
          <div className="grid gap-4 md:grid-cols-2">
            <UmlEditorPlaceholder />
            <AiAssistantPlaceholder />
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default App
