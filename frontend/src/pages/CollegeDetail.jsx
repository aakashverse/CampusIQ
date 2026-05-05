import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
import { useCompare } from '../context/CompareContext'
import { useAuth } from '../context/AuthContext'

export default function CollegeDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/colleges/${id}`)
        setCollege(res.data)

        // Check if saved
        if (user) {
          const savedRes = await api.get('/saved/ids')
          setSaved(savedRes.data.includes(parseInt(id)))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id, user])

  const handleSaveToggle = async () => {
    if (!user) { alert('Please login to save colleges'); return }
    try {
      await api.post(`/saved/${id}`)
      setSaved((prev) => !prev)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
        <div className="h-52 bg-slate-200 rounded-xl" />
        <div className="h-6 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
      </div>
    )
  }

  if (!college) return <p className="text-center text-slate-400 py-16">College not found.</p>

  const inCompare = isInCompare(college.id)

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="relative h-52 rounded-xl overflow-hidden">
        <img
          src={college.image_url}
          alt={college.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-5 text-white">
          <h1 className="font-display text-2xl font-bold">{college.name}</h1>
          <p className="text-white/80 text-sm">📍 {college.location}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSaveToggle}
          className="btn-secondary text-sm"
        >
          {saved ? '❤️ Saved' : '🤍 Save'}
        </button>
        <button
          onClick={() => inCompare ? removeFromCompare(college.id) : addToCompare(college)}
          className={`btn-secondary text-sm ${inCompare ? 'border-brand-400 text-brand-600' : ''}`}
        >
          {inCompare ? '✓ In Compare' : '+ Compare'}
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Rating', value: `${college.rating} / 5`, icon: '⭐' },
          { label: 'Placement', value: `${college.placement_percentage}%`, icon: '💼' },
          { label: 'Annual Fees', value: `₹${Number(college.fees).toLocaleString('en-IN')}`, icon: '💰' },
          { label: 'Established', value: college.established_year || 'N/A', icon: '📅' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="font-display font-bold text-slate-900 text-lg">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Overview */}
      {college.overview && (
        <div className="card p-5">
          <h2 className="font-display font-semibold text-slate-800 mb-3">About</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{college.overview}</p>
        </div>
      )}

      {/* Courses offered */}
      {college.courses?.length > 0 && (
        <div className="card p-5">
          <h2 className="font-display font-semibold text-slate-800 mb-3">Courses Offered</h2>
          <div className="flex flex-wrap gap-2">
            {college.courses.map((course, i) => (
              <span key={i} className="bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {course}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}