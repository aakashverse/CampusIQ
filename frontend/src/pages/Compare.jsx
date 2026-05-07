import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import api from '../utils/api'
import CompareTable from '../components/CompareTable'
import AIInsightBox from '../components/AiInsightBox'

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCompare = async () => {
    if (compareList.length < 2) return
    setLoading(true)
    try {
      const res = await api.post(`/compare`, {
        collegeIds: compareList.map((c) => c.id),
      })
      setResult(res.data.colleges)
      setInsight(res.data.insight)
    } catch (err) {
      console.error(err)
      toast.error('Comparison failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (compareList.length === 0) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl block mb-4">📊</span>
        <h2 className="font-display text-xl font-semibold text-slate-800 mb-2">No colleges selected</h2>
        <p className="text-slate-500 text-sm mb-6">Go to the home page and add 2–3 colleges to compare</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Browse Colleges
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Compare Colleges</h1>
          <p className="text-slate-500 text-sm">{compareList.length} colleges selected</p>
        </div>
        <div className="flex gap-2">
          <button onClick={clearCompare} className="btn-secondary text-sm">
            Clear All
          </button>
          <button
            onClick={handleCompare}
            disabled={compareList.length < 2 || loading}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {loading ? 'Comparing...' : 'Compare + AI Insight'}
          </button>
        </div>
      </div>

      {/* Selected college chips */}
      <div className="flex flex-wrap gap-2">
        {compareList.map((c) => (
          <div key={c.id} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <span className="font-medium text-slate-700">{c.name}</span>
            <button
              onClick={() => removeFromCompare(c.id)}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Results */}
      {result ? (
        <div className="space-y-5">
          <CompareTable colleges={result} />
          <AIInsightBox insight={insight} loading={false} />
        </div>
      ) : loading ? (
        <div className="space-y-5">
          <div className="card h-48 animate-pulse bg-slate-100" />
          <AIInsightBox insight={null} loading={true} />
        </div>
      ) : (
        <div className="card p-8 text-center text-slate-400 text-sm">
          Click "Compare + AI Insight" to see the comparison table and get AI-powered recommendations
        </div>
      )}
    </div>
  )
}