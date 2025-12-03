function AiAssistantPlaceholder() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">🤖</span>
        <div>
          <p className="text-sm font-semibold text-slate-900">AI Assistant</p>
          <p className="text-xs text-slate-600">Скоро здесь появятся подсказки и автогенерация задач.</p>
        </div>
      </div>
      <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
        «Сформируй план спринта на 2 недели, добавь зависимости и сроки для каждой вехи»
      </div>
    </div>
  )
}

export default AiAssistantPlaceholder
