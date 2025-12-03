function UmlEditorPlaceholder() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-planty-secondary/50 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-planty-secondary/15 text-planty-primary">
          &#60;/&#62;
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">PlantUML Editor</p>
          <p className="text-xs text-slate-600">Заглушка для будущего кода и синхронизации.</p>
        </div>
      </div>
      <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
        @startgantt
        <br />
        [Проект] lasts 3 weeks
        <br />
        [Design] happens after [Проект]
        <br />
        [Release] happens after [Design]
        <br />
        @endgantt
      </div>
    </div>
  )
}

export default UmlEditorPlaceholder
