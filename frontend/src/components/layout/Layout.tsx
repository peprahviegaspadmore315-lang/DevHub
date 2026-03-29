import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useSidebarStore } from '@/store'

const SIDEBAR_AUTO_COLLAPSE_BREAKPOINT = 1280

const Layout = () => {
  const { isOpen, setSidebarOpen } = useSidebarStore()
  const location = useLocation()
  const isEditor = location.pathname.startsWith('/editor')
  const previousCompactModeRef = useRef<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const syncSidebarMode = () => {
      const isCompactViewport = window.innerWidth < SIDEBAR_AUTO_COLLAPSE_BREAKPOINT

      if (previousCompactModeRef.current === null) {
        previousCompactModeRef.current = isCompactViewport
        if (isCompactViewport) {
          setSidebarOpen(false)
        }
        return
      }

      if (isCompactViewport && !previousCompactModeRef.current) {
        setSidebarOpen(false)
      }

      previousCompactModeRef.current = isCompactViewport
    }

    syncSidebarMode()
    window.addEventListener('resize', syncSidebarMode, { passive: true })

    return () => {
      window.removeEventListener('resize', syncSidebarMode)
    }
  }, [setSidebarOpen])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex h-full">
        {!isEditor && <Sidebar />}

        <main
          className={`${
            isEditor
              ? 'min-h-screen flex-1 w-full'
              : 'min-h-screen flex-1 transition-all duration-300'
          } ${!isEditor ? (isOpen ? 'md:ml-72' : 'md:ml-20') : ''}`}
          style={{
            paddingTop: isEditor
              ? 'calc(var(--devhub-navbar-offset, 80px) + 16px)'
              : 'var(--devhub-navbar-offset, 80px)',
          }}
        >
          <div className={`${isEditor ? 'p-0' : 'p-4 lg:p-6'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
