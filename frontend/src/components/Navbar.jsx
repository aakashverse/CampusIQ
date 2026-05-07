import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success("Logged out!")
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-brand-600 text-xl">🎓</span>
          <span className="font-display font-bold text-slate-900 text-lg">CampusIQ</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-slate-600 hover:text-brand-600 transition-colors">
            Explore
          </Link>
          <Link to="/compare" className="text-slate-600 hover:text-brand-600 transition-colors">
            Compare
          </Link>

          {user ? (
            <>
              <Link to="/saved" className="text-slate-600 hover:text-brand-600 transition-colors">
                Saved
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm py-1.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-brand-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-1.5">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}