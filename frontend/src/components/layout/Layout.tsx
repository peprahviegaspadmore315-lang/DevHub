import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useSidebarStore } from '@/store'

const Layout = () => {
  const { isOpen } = useSidebarStore()
  const location = useLocation()
  const isEditor = location.pathname.startsWith('/editor')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex h-full">
        {!isEditor && <Sidebar />}

        <main
          className={`${
            isEditor
              ? 'pt-[80px] min-h-screen flex-1 w-full'
              : 'pt-16 min-h-screen flex-1 transition-all duration-300'
          } ${!isEditor && isOpen ? 'lg:ml-[280px]' : ''}`}
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
