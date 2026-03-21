import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
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
            DevHub
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
            <input
              type="text"
              placeholder="Search in tutorials..."
              className="rounded-sm py-1 pl-8 pr-3 text-sm bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />
            <svg className="w-4 h-4 absolute left-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-white/90">{user?.firstName || user?.username}</span>
              <button onClick={handleLogout} className="text-sm px-3 py-1.5 border border-white/40 rounded-sm hover:bg-white/15 transition">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-1.5 border border-white/40 rounded-sm hover:bg-white/15 transition">Log in</Link>
              <Link to="/register" className="text-sm px-3 py-1.5 bg-white text-[#317EFB] rounded-sm font-semibold hover:bg-gray-100 transition">Sign up</Link>
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
