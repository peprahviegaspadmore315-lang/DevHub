import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { coursesApi } from '@/services/api'
import { useSidebarStore } from '@/store'
import type { Course } from '@/types'

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebarStore()
  const location = useLocation()
  const [courses, setCourses] = useState<Course[]>([])
  const courseMatch = location.pathname.match(/^\/courses\/(\d+)/)
  const courseId = courseMatch ? parseInt(courseMatch[1], 10) : null
  const expandedCourse = courseId || null

  const isHtmlCourse = courseId === 1

  const htmlTopics = [
    'HTML Tutorial',
    'HTML HOME',
    'HTML Introduction',
    'HTML Editors',
    'HTML Basic',
    'HTML Elements',
    'HTML Attributes',
    'HTML Headings',
    'HTML Paragraphs',
    'HTML Styles',
    'HTML Formatting',
    'HTML Quotations',
    'HTML Comments',
    'HTML Colors',
    'HTML CSS',
    'HTML Links',
    'HTML Images',
    'HTML Favicon',
    'HTML Page Title',
    'HTML Tables',
    'HTML Lists',
    'HTML Block & Inline',
    'HTML Div',
    'HTML Classes',
    'HTML Id',
    'HTML Buttons',
    'HTML Iframes',
    'HTML JavaScript',
    'HTML File Paths',
    'HTML Head',
    'HTML Layout',
    'HTML Responsive',
    'HTML Computercode',
    'HTML Semantics',
    'HTML Style Guide',
    'HTML Entities',
    'HTML Symbols',
    'HTML Emojis',
    'HTML Charsets',
    'HTML URL Encode',
    'HTML vs. XHTML',
    'HTML Forms',
    'HTML Form Attributes',
    'HTML Form Elements',
    'HTML Input Types',
    'HTML Input Attributes',
    'Input Form Attributes',
    'HTML Graphics',
    'HTML Canvas',
    'HTML SVG',
    'HTML Media',
    'HTML Video',
    'HTML Audio',
    'HTML Plug-ins',
    'HTML YouTube',
    'HTML APIs',
    'HTML Web APIs',
    'HTML Geolocation',
    'HTML Drag and Drop',
    'HTML Web Storage',
    'HTML Web Workers',
    'HTML SSE',
    'HTML Examples',
    'HTML Editor',
    'HTML Quiz',
    'HTML Exercises',
    'HTML Challenges',
    'HTML Website',
    'HTML Syllabus',
    'HTML Study Plan',
    'HTML Interview Prep',
    'HTML Bootcamp',
    'HTML Certificate',
    'HTML Summary',
    'HTML Accessibility',
    'HTML References',
    'HTML Tag List',
    'HTML Attributes',
    'HTML Global Attributes',
    'HTML Browser Support',
    'HTML Events',
    'HTML Colors',
    'HTML Canvas',
    'HTML Audio/Video',
    'HTML Doctypes',
    'HTML Character Sets',
    'HTML URL Encode',
    'HTML Lang Codes',
    'HTTP Messages',
    'HTTP Methods',
    'PX to EM Converter',
    'Keyboard Shortcuts',
  ]

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
          {/* Main Links */}
          <div className="px-3 mb-6">
            {isHtmlCourse ? (
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  HTML Topics
                </div>
                {htmlTopics.map((topic) => (
                  <NavLink
                    key={topic}
                    to={`/courses/1?topic=${encodeURIComponent(topic)}`}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="truncate text-sm">{topic}</span>
                  </NavLink>
                ))}
              </div>
            ) : (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </NavLink>
                
                <NavLink
                  to="/courses"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Courses</span>
                </NavLink>
                
                <NavLink
                  to="/editor"
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>Code Editor</span>
                </NavLink>
              </>
            )}

            {!isHtmlCourse && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18V3H3zm6 16H5V5h4v14zm2 0V5h8v14h-8z" />
                </svg>
                <span>Dashboard</span>
              </NavLink>
            )}
          </div>

          {/* Courses List - W3Schools Style */}
          {!isHtmlCourse && (
            <div className="px-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                Tutorials
              </div>
              
              {courses.map((course) => (
              <div key={course.id} className="mb-1">
                <NavLink
                  to={`/courses/${course.id}`}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      isActive ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="truncate">{course.title}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </NavLink>

                {expandedCourse === course.id && (
                  <div className="ml-4 mt-1 space-y-1">
                    <NavLink
                      to={`/courses/${course.id}`}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm rounded-lg transition-colors ${
                          isActive ? 'text-primary-600 bg-primary-50 font-medium' : 'text-gray-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      View All Lessons
                    </NavLink>
                  </div>
                )}
              </div>
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
  )
}

export default Sidebar
