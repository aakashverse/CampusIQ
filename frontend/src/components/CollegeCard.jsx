import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useAuth } from '../context/AuthContext'
import CollegeDetail from '../pages/CollegeDetail'
import api from '../utils/api'

export default function CollegeCard({ college, savedIds = [], onSaveToggle }) {
  // ALL hooks must be called before any conditional return (React rules of hooks)
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { user } = useAuth()

  // Guard after hooks — safe to bail out here
  if (!college) return null

  const inCompare = isInCompare(college.id)
  const isSaved = savedIds.includes(college.id)

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(college.id)
    } else {
      addToCompare(college)
    }
  }

  const handleSaveToggle = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to save colleges')
      return
    }
    try {
      await api.post(`/saved/${college.id}`)
      onSaveToggle?.(college.id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div onClick={() => navigate('/college')} className="card hover:shadow-md transition-shadow duration-200 overflow-hidden group">
        <Link to={`/colleges/${college.id}`}>
      {/* College Image */}
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        <img
          src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=400'}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Save button */}
        <button
          onClick={handleSaveToggle}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm hover:bg-white transition-colors shadow-sm"
          title={isSaved ? 'Remove from saved' : 'Save college'}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="p-4">
          <h3 className="font-display font-semibold text-slate-900 text-sm leading-snug hover:text-brand-600 transition-colors line-clamp-2 mb-1">
            {college.name}
          </h3>
     

        <p className="text-slate-500 text-xs mb-3">📍 {college.location}</p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs mb-4">
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            ⭐ {college.rating}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-600 font-medium">
            {college.placement_percentage}% placed
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">
            ₹{(college.fees / 100000).toFixed(1)}L/yr
          </span>
        </div>

        {/* Compare toggle */}
        <button
          onClick={handleCompareToggle}
          className={`w-full text-xs py-1.5 rounded-lg border font-medium transition-colors ${
            inCompare
              ? 'bg-brand-50 border-brand-300 text-brand-700'
              : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
          }`}
        >
          {inCompare ? '✓ Added to Compare' : '+ Compare'}
        </button>
      </div>
       </Link>
    </div>
  )
}