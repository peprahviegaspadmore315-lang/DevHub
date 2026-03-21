import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'

const navItems = [
  { label: 'Tutorials', path: '/' },
  { label: 'Courses', path: '/courses' },
  { label: 'Exercises', path: '/' },
  { label: 'Certificates', path: '/' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const initial = localStorage.getItem('theme') === 'dark'
    setDarkMode(initial)
    document.documentElement.classList.toggle('dark', initial)
  }, [])

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <nav className="navbar bg-[#317EFB] text-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="text-white lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
              <img src="/devhubsymbol.png" alt="DevHub" className="h-8 w-8 rounded" />
              DevHub
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {navItems.map((item) => (
              <Link key={item.label} to={item.path} className="text-sm font-medium hover:text-gray-200">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            <SearchBar placeholder="Search in tutorials..." />
            <button
              onClick={toggleDarkMode}
              className="rounded border border-white/70 px-3 py-1 text-sm font-medium hover:bg-white/20"
              aria-label="Toggle dark mode"
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="rounded border border-white/70 px-3 py-1 text-sm font-medium hover:bg-white/20"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="rounded bg-white px-3 py-1 text-sm font-bold text-[#317EFB] hover:bg-gray-100"
            >
              Sign up
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t border-white/20 py-3">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block rounded px-2 py-1 text-sm font-medium text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2">
                <SearchBar placeholder="Search..." />
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => { setIsOpen(false); toggleDarkMode() }}
                  className="flex-1 rounded border border-white/70 px-3 py-1 text-sm font-medium hover:bg-white/20"
                >
                  {darkMode ? 'Light' : 'Dark'}
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => { setIsOpen(false); navigate('/login') }}
                  className="flex-1 rounded border border-white/70 px-3 py-1 text-sm font-medium hover:bg-white/20"
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsOpen(false); navigate('/register') }}
                  className="flex-1 rounded bg-white px-3 py-1 text-sm font-bold text-[#317EFB] hover:bg-gray-100"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
