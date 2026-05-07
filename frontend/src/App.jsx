import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CompareProvider } from './context/CompareContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CollegeDetail from './pages/CollegeDetail'
import Compare from './pages/Compare'
import Login from './pages/Login'
import Register from './pages/Register'
import Saved from './pages/Saved'
import CompareBar from './components/CompareBar'
import { ToastContainer, toast } from 'react-toastify';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CompareProvider>
          <div className="min-h-screen">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/colleges/:id" element={<CollegeDetail />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/saved" element={<Saved />} />
              </Routes>
            </main>
            {/* Floating compare bar shown when colleges are queued */}
            <CompareBar />
          </div>
        </CompareProvider>
      </AuthProvider>
      <ToastContainer position="top-center"/>
    </BrowserRouter>
  )
}