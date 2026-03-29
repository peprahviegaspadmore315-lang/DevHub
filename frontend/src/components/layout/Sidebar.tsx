import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { coursesApi } from '@/services/api'
import { useSidebarStore } from '@/store'
import { courseData } from '@/data/courseData'
import type { Course } from '@/types'

const Sidebar = () => {
  const { isOpen, setSidebarOpen, toggleSidebar } = useSidebarStore()
  const location = useLocation()
  const [courses, setCourses] = useState<Course[]>([])
  
  // Direct pathname check - simpler and more reliable
  const isOnCssCourse = location.pathname.startsWith('/courses/2')
  const isOnHtmlCourse = location.pathname.startsWith('/courses/1')

  // Force sidebar open when on course pages
  useEffect(() => {
    if (isOnCssCourse || isOnHtmlCourse) {
      localStorage.removeItem('sidebar-storage')
      setSidebarOpen(true)
    }
  }, [isOnCssCourse, isOnHtmlCourse, setSidebarOpen])

  useEffect(() => {
    coursesApi.getAll().then((res) => setCourses(res.data))
  }, [])

return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
        isOpen ? 'w-[280px]' : 'w-0 -translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LP</span>
            </div>
            <span className="font-semibold text-gray-900">LearnCode</span>
          </NavLink>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-6">
            {/* CSS COURSE - Show topics */}
            {location.pathname.includes('/courses/2') && (
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  CSS Topics
                </div>
                {courseData[1]?.lessons?.map((lesson) => (
                  <NavLink
                    key={lesson.id}
                    to={`/topics/css/${lesson.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="truncate text-sm">{lesson.title}</span>
                  </NavLink>
                ))}
              </div>
            )}

            {/* HTML COURSE - Show topics */}
            {location.pathname.includes('/courses/1') && (
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  HTML Topics
                </div>
                {courseData[0]?.lessons?.map((lesson) => (
                  <NavLink
                    key={lesson.id}
                    to={`/topics/html/${lesson.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="truncate text-sm">{lesson.title}</span>
                  </NavLink>
                ))}
              </div>
            )}

            {/* DEFAULT NAVIGATION */}
            {!location.pathname.includes('/courses/1') && !location.pathname.includes('/courses/2') && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </NavLink>

                <NavLink
                  to="/courses"
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Courses</span>
                </NavLink>

                <NavLink
                  to="/editor"
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>Code Editor</span>
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18V3H3zm6 16H5V5h4v14zm2 0V5h8v14h-8z" />
                  </svg>
                  <span>Dashboard</span>
                </NavLink>
              </>
            )}
          </div>

          {/* Courses List */}
          {!location.pathname.includes('/courses/1') && !location.pathname.includes('/courses/2') && (
            <div className="px-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                Tutorials
              </div>
              {courses.map((course) => (
                <NavLink
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      isActive ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="truncate">{course.title}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          <NavLink
            to="/dashboard"
            className="sidebar-link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>My Dashboard</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
