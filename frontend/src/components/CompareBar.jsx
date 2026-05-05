import { useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const navigate = useNavigate()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-slate-600">
            Comparing ({compareList.length}/3):
          </span>
          {compareList.map((c) => (
            <span
              key={c.id}
              className="flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {c.name.split(' ').slice(0, 3).join(' ')}
              <button
                onClick={() => removeFromCompare(c.id)}
                className="hover:text-brand-900 ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={clearCompare} className="btn-secondary text-xs py-1.5">
            Clear
          </button>
          <button
            onClick={() => navigate('/compare')}
            disabled={compareList.length < 2}
            className="btn-primary text-xs py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compare Now →
          </button>
        </div>
      </div>
    </div>
  )
}