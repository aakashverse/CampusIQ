import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import CollegeCard from '../components/CollegeCard'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import Pagination from '../components/Pagination'

export default function Home() {
  const { user } = useAuth()
  const [colleges, setColleges] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 9 })
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ location: '', maxFees: '' })
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(true)

  // Debounce search — don't hit API on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch colleges whenever search/filter/page changes
  const fetchColleges = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = { page, limit: 9, search: debouncedSearch, ...filters }
      const res = await api.get(`${import.meta.env.VITE_API_URL}/colleges`, { params })
      setColleges(res.data.colleges)
      setPagination(res.data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, filters])

  useEffect(() => {
    fetchColleges(1)
  }, [fetchColleges])

  // Fetch saved IDs if logged in (to show heart state on cards)
  useEffect(() => {
    if (user) {
      api.get(`${import.meta.env.VITE_API_URL}/saved/ids`)
        .then((res) => setSavedIds(res.data))
        .catch(() => {})
    }
  }, [user])

  const handleSaveToggle = (collegeId) => {
    setSavedIds((prev) =>
      prev.includes(collegeId) ? prev.filter((id) => id !== collegeId) : [...prev, collegeId]
    )
  }

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8 pt-4">
        <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">
          Find Your Perfect College
        </h1>
        <p className="text-slate-500 text-base">
          Explore, compare, and decide with data-driven insights
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="w-56 shrink-0 hidden md:block">
          <FilterPanel filters={filters} onChange={setFilters} />
        </aside>

        {/* College grid */}
        <div className="flex-1">
          {/* Result count */}
          <p className="text-sm text-slate-400 mb-4">
            {loading ? 'Searching...' : `${pagination.total} colleges found`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <span className="text-4xl block mb-3">🎓</span>
              No colleges found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {colleges.filter(Boolean).map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  savedIds={savedIds}
                  onSaveToggle={handleSaveToggle}
                />
              ))}
            </div>
          )}

          <Pagination
            pagination={pagination}
            onPageChange={(page) => fetchColleges(page)}
          />
        </div>
      </div>
    </div>
  )
}