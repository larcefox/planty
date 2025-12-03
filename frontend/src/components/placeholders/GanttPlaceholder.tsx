function GanttPlaceholder() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-planty-background p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-planty-primary">Диаграмма Ганта</p>
          <p className="text-xs text-slate-600">Быстрый эскиз для канваса и шкалы времени</p>
        </div>
        <span className="rounded-full bg-planty-secondary/20 px-3 py-1 text-xs font-semibold text-planty-primary">
          Draft
        </span>
      </div>
      <div className="mt-4 space-y-2 text-xs text-slate-700">
        {['Design', 'Backend API', 'Frontend UI', 'QA'].map((task, index) => (
          <div key={task} className="flex items-center gap-3">
            <div className="h-8 w-24 rounded-full bg-slate-100" />
            <div
              className="h-8 rounded-full bg-planty-secondary/60"
              style={{ width: `${80 + index * 10}px` }}
            />
            <span className="text-slate-600">{task}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GanttPlaceholder
