export default function AIInsightBox({ insight, loading }) {
  if (loading) {
    return (
      <div className="card p-5 border-l-4 border-l-brand-500">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl">🤖</span>
          <h3 className="font-display font-semibold text-slate-800">AI Insight</h3>
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (!insight) return null

  return (
    <div className="card p-5 border-l-4 border-l-brand-500">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">🤖</span>
        <h3 className="font-display font-semibold text-slate-800">AI Insight</h3>
        <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">Powered by AI</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-50 rounded-lg p-3">
          <p className="text-xs text-emerald-600 font-medium mb-1">Best for Placement</p>
          <p className="font-display font-semibold text-slate-800 text-sm">{insight.bestForPlacement}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-600 font-medium mb-1">Most Affordable</p>
          <p className="font-display font-semibold text-slate-800 text-sm">{insight.mostAffordable}</p>
        </div>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed">{insight.recommendation}</p>
    </div>
  )
}