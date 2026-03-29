import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import DevHubWordmark from '@/components/ui/devhub-wordmark'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/topics?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-[#317EFB] text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white font-bold text-xl flex items-center gap-2">
            <span aria-hidden="true" className="inline-flex h-6 w-6 items-center justify-center rounded bg-white/20">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </span>
            <DevHubWordmark
              as="span"
              tone="light"
              devClassName="text-sky-200"
              hubClassName="text-cyan-300"
            />
          </Link>
          <nav className="hidden lg:flex gap-3 text-sm">
            <Link to="/" className="hover:text-gray-200">Tutorials</Link>
            <Link to="/courses" className="hover:text-gray-200">Courses</Link>
            <Link to="/" className="hover:text-gray-200">References</Link>
            <Link to="/" className="hover:text-gray-200">Exercises</Link>
            <Link to="/" className="hover:text-gray-200">Certificates</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center relative">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in tutorials..."
                className="rounded-l-sm py-1 pl-8 pr-3 text-sm bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gray-100 border-l border-gray-300 rounded-r-sm py-1 px-2 hover:bg-gray-200 transition"
                aria-label="Search"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-white/90">{user?.firstName || user?.username}</span>
              <button onClick={handleLogout} className="text-sm px-3 py-1.5 border border-white/40 rounded-sm hover:bg-white/15 transition">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-1.5 bg-white text-[#317EFB] rounded-sm font-semibold hover:bg-gray-100 transition">Login / Sign up</Link>
            </>
          )}
        </div>
      </div>

      <div className="bg-[#DCE6FE] text-[#317EFB] text-xs font-semibold px-4 py-1 border-b border-[#B9CCFE]">
        Get certified, level up your skills, and track progress in real-time.
      </div>
    </header>
  )
}

export default Header
