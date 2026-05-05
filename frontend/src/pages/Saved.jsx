import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import CollegeCard from '../components/CollegeCard'

export default function Saved() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    const fetchSaved = async () => {
      try {
        const res = await api.get('/saved')
        setColleges(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSaved()
  }, [user, navigate])

  // When user unsaves from this page, remove from local list immediately
  const handleSaveToggle = (collegeId) => {
    setColleges((prev) => prev.filter((c) => c.id !== collegeId))
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-64 animate-pulse bg-slate-100" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Saved Colleges</h1>
        <p className="text-slate-500 text-sm">{colleges.length} college{colleges.length !== 1 ? 's' : ''} saved</p>
      </div>

      {colleges.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">🤍</span>
          <h2 className="font-display text-xl font-semibold text-slate-800 mb-2">No saved colleges yet</h2>
          <p className="text-slate-500 text-sm mb-6">Browse colleges and hit the heart icon to save them here</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse Colleges
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colleges.filter(Boolean).map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              savedIds={colleges.map((c) => c.id)}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}