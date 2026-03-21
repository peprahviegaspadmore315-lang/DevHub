import { Link, useLocation } from 'react-router-dom'

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

const sidebarItems = [
  { label: 'Home', path: '/' },
  { label: 'Courses', path: '/courses' },
  { label: 'Code Editor', path: '/editor' },
  { label: 'Dashboard', path: '/dashboard' },
]

const Sidebar = () => {
  const location = useLocation()
  const isHtmlCourse = location.pathname.startsWith('/courses/1')

  return (
    <aside className="hidden w-64 flex-col gap-2 border-r border-gray-200 bg-white p-4 md:flex">
      {isHtmlCourse ? (
        <>
          <div className="mb-4 text-sm text-gray-500 uppercase tracking-wide">HTML Topics</div>
          <nav className="flex flex-col gap-1 max-h-[calc(100vh-120px)] overflow-y-auto">
            {htmlTopics.map((topic) => (
              <Link
                key={topic}
                to={`/courses/1?topic=${encodeURIComponent(topic)}`}
                className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                {topic}
              </Link>
            ))}
          </nav>
        </>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500 uppercase tracking-wide">Navigation</div>
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-500">
            Recommended
            <ul className="mt-2 space-y-1">
              <li><Link to="/courses" className="text-blue-600 hover:underline">Start with HTML</Link></li>
              <li><Link to="/courses" className="text-blue-600 hover:underline">Try CSS first</Link></li>
            </ul>
          </div>
        </>
      )}
    </aside>
  )
}

export default Sidebar
