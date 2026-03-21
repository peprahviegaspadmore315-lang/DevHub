import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { coursesApi } from '@/services/api'
import { courseData } from '@/data/courseData'
import type { Course, Lesson } from '@/types'

const CourseDetailPage = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          coursesApi.getById(parseInt(courseId)),
          coursesApi.getLessons(parseInt(courseId)),
        ])
        setCourse(courseRes.data)
        setLessons(lessonsRes.data)
      } catch (error) {
        console.warn('Failed to fetch course from API, using fallback:', error)

        const localCourse = courseData.find((c) => c.id === parseInt(courseId))
        if (localCourse) {
          setCourse({
            id: localCourse.id,
            title: localCourse.title,
            description: localCourse.description,
            category: localCourse.category,
            difficulty: localCourse.difficulty,
            slug: localCourse.slug,
            iconUrl: localCourse.image,
            bannerUrl: localCourse.image,
            estimatedHours: localCourse.lessons.length * 0.25,
            lessonsCount: localCourse.lessons.length,
            exercisesCount: localCourse.lessons.length,
            quizzesCount: 0,
            isPremium: false,
            price: 0,
            orderIndex: 1,
            isPublished: true,
            isFeatured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Course)
          setLessons(localCourse.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            summary: lesson.summary,
            estimatedMinutes: 10,
            courseId: localCourse.id,
            courseTitle: localCourse.title,
            slug: lesson.title.toLowerCase().replace(/\s+/g, '-'),
            orderIndex: lesson.id,
            isPublished: true,
            isPremium: false,
            hasNext: !!localCourse.lessons.find((l) => l.id === lesson.id + 1),
            hasPrevious: !!localCourse.lessons.find((l) => l.id === lesson.id - 1),
            nextLessonId: localCourse.lessons.find((l) => l.id === lesson.id + 1)?.id,
            previousLessonId: localCourse.lessons.find((l) => l.id === lesson.id - 1)?.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Lesson)))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [courseId])

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

  const [searchParams, setSearchParams] = useSearchParams()
  const [activeHtmlTopic, setActiveHtmlTopic] = useState(htmlTopics[0])
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('html_completed_topics') || '[]')
  })
  const [topicNotes, setTopicNotes] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {}
    return JSON.parse(localStorage.getItem('html_topic_notes') || '{}')
  })
  const [draftTopicNote, setDraftTopicNote] = useState('')
  const topicRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const topicParam = searchParams.get('topic')?.trim().toLowerCase()
    if (topicParam) {
      const matchingTopic = htmlTopics.find((topic) => topic.toLowerCase() === topicParam)
      if (matchingTopic) {
        setActiveHtmlTopic(matchingTopic)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (topicNotes[activeHtmlTopic]) {
      setDraftTopicNote(topicNotes[activeHtmlTopic])
    } else {
      setDraftTopicNote('')
    }
  }, [activeHtmlTopic, topicNotes])

  useEffect(() => {
    const paramValue = searchParams.get('topic')
    if (paramValue !== activeHtmlTopic) {
      setSearchParams({ topic: activeHtmlTopic }, { replace: true })
    }

    const activeButton = topicRefs.current[activeHtmlTopic]
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeHtmlTopic, searchParams, setSearchParams])

  const saveCompletedTopics = (topics: string[]) => {
    setCompletedTopics(topics)
    localStorage.setItem('html_completed_topics', JSON.stringify(topics))
  }

  const saveTopicNotes = (notes: Record<string, string>) => {
    setTopicNotes(notes)
    localStorage.setItem('html_topic_notes', JSON.stringify(notes))
  }

  const toggleTopicCompletion = (topic: string) => {
    if (completedTopics.includes(topic)) {
      saveCompletedTopics(completedTopics.filter((t) => t !== topic))
    } else {
      saveCompletedTopics([...completedTopics, topic])
    }
  }

  const getHtmlTopicDetails = (topic: string) => {
    const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')
    switch (normalize(topic)) {
      case 'html tutorial':
        return {
          description: 'Begin with a complete HTML overview: document structure, elements, attributes, and how HTML works with CSS and JavaScript. You will learn about the DOCTYPE, <html>, <head>, and <body>, and set up your first page.',
          code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>HTML Tutorial</title>\n  </head>\n  <body>\n    <h1>Welcome to HTML Tutorial</h1>\n    <p>This is the foundation of modern web pages.</p>\n  </body>\n</html>',
        }
      case 'html home':
        return {
          description: 'HTML HOME is the landing section that lets learners navigate the full course outline quickly, with major topic blocks easily reachable from one pane.',
          code: '<nav>\n  <ul>\n    <li><a href="#introduction">Introduction</a></li>\n    <li><a href="#elements">Elements</a></li>\n    <li><a href="#forms">Forms</a></li>\n  </ul>\n</nav>',
        }
      case 'html introduction':
        return {
          description: 'HTML Introduction explains the web content model, difference between markup and scripting, and how browsers interpret HTML into the rendered DOM tree.',
          code: '<section>\n  <h2>What is HTML?</h2>\n  <p>HTML stands for HyperText Markup Language and is used to structure content in a web browser.</p>\n</section>',
        }
      case 'html editors':
        return {
          description: 'Learn about popular HTML editors like VS Code, Sublime Text, and the built-in Try It Yourself editor for experiments and instant results.',
          code: '<p>Examples: VS <strong>Code</strong>, Sublime Text, Atom, and browser-based editors.</p>',
        }
      case 'html basic':
        return {
          description: 'HTML Basics covers tags, attributes, element nesting, and writing valid semantic structure for accessibility and maintainability.',
          code: '<!DOCTYPE html>\n<html>\n<body>\n  <h1>Heading</h1>\n  <p>Paragraph text.</p>\n</body>\n</html>',
        }
      case 'html elements':
        return {
          description: 'Elements are the core representation of HTML nodes. They can be block-level, inline and self-closing, and may contain attributes and children.',
          code: '<div>\n  <h2>Section</h2>\n  <p>Inline <span>elements</span> are also possible.</p>\n</div>',
        }
      case 'html attributes':
        return {
          description: 'Attributes provide additional information about elements, including IDs, classes, links, sources, alt text, and ARIA properties.',
          code: '<img src="example.png" alt="Example image" width="300" loading="lazy">',
        }
      case 'html headings':
        return {
          description: 'Headings from <h1> to <h6> define content hierarchy. Use one <h1> per page for SEO and screen reader best practices.',
          code: '<h1>Main title</h1>\n<h2>Subheading</h2>\n<h3>Sub-subheading</h3>',
        }
      case 'html paragraphs':
        return {
          description: 'Paragraphs (<p>) group text into readable blocks. Avoid using <br> for spacing—use CSS margins instead.',
          code: '<p>This is the first paragraph.</p>\n<p>This is the second paragraph, using proper structure.</p>',
        }
      case 'html styles':
        return {
          description: 'Styles control the look & feel via CSS. You can use inline, internal, or external stylesheets. Avoid inline styles for maintainability.',
          code: '<style>\n  body { font-family: Arial, sans-serif; }\n  .highlight { color: #1d4ed8; }\n</style>\n<p class="highlight">Styled text</p>',
        }
      case 'html formatting':
        return {
          description: 'Formatting tags like <strong>, <em>, <small>, <abbr>, and <mark> provide semantic meaning beyond simple appearance.',
          code: '<p><strong>Strong</strong>, <em>Emphasis</em>, <small>Small text</small>, <mark>Highlight</mark>.</p>',
        }
      case 'html quotations':
        return {
          description: 'Use <blockquote> for long quotes and <q> for short inline quotes. Proper quoting improves semantics and accessibility.',
          code: '<blockquote>“Always code as if the person who ends up maintaining your code is a violent psychopath who knows where you live.”</blockquote>',
        }
      case 'html comments':
        return {
          description: 'Comments are hidden notes in source code. Useful for reminders but should not include sensitive data.',
          code: '<!-- This is a comment for developers, not shown in rendered page -->',
        }
      case 'html colors':
        return {
          description: 'Color values can be hex, rgb(), rgba(), hsl(). Use contrast ratios for accessibility and themes.',
          code: '<p style="color:#0f172a;background:#bfdbfe">Color contrast example</p>',
        }
      case 'html css':
        return {
          description: 'Embed CSS with <style> tags or external .css files. Separate presentation from content for clarity.',
          code: '<link rel="stylesheet" href="styles.css">\n<style>body { margin: 0; }</style>',
        }
      case 'html links':
        return {
          description: 'Links use <a href="...">. Include target="_blank" rel="noopener" for external links to improve security.',
          code: '<a href="https://www.example.com" target="_blank" rel="noopener">Visit Example</a>',
        }
      case 'html images':
        return {
          description: 'Images increase visual engagement. Always provide alt text and optimized formats; use srcset for responsive images.',
          code: '<img src="pic.jpg" alt="Description" width="600" />',
        }
      case 'html favicon':
        return {
          description: 'Favicons appear in browser tabs. Use <link rel="icon" href="favicon.ico" type="image/x-icon">.',
          code: '<link rel="icon" href="/favicon.ico" type="image/x-icon" />',
        }
      case 'html page title':
        return {
          description: '<title> sets what appears in browser tab and search results, so make it unique and keyword-rich.',
          code: '<title>DevHub HTML Tutorial</title>',
        }
      case 'html tables':
        return {
          description: 'Tables are for tabular data. Use <thead>, <tbody>, <tfoot>, and captions for semantics.',
          code: '<table>\n  <caption>Product prices</caption>\n  <thead><tr><th>Name</th><th>Price</th></tr></thead>\n  <tbody><tr><td>Book</td><td>$20</td></tr></tbody>\n</table>',
        }
      case 'html lists':
        return {
          description: 'Ordered <ol> and unordered <ul> lists structure items. Nested lists create hierarchies.',
          code: '<ul><li>HTML</li><li>CSS</li><li>JavaScript</li></ul>',
        }
      case 'html block & inline':
        return {
          description: 'Block elements consume full width; inline elements flow with text. Know the difference for layout tolerance.',
          code: '<div>Block</div><span style="background:#f3f4f6">Inline</span>',
        }
      case 'html div':
        return {
          description: '<div> is a generic block container used for layout and grouping. Use semantic alternatives when possible.',
          code: '<div class="container"><p>Content inside a div container</p></div>',
        }
      case 'html classes':
        return {
          description: 'Classes provide reusable style hooks with CSS and JS. Add multiple classes separated by spaces.',
          code: '<p class="text-blue text-lg">Styled with classes</p>',
        }
      case 'html id':
        return {
          description: 'IDs must be unique per page and can target specific elements with CSS/JS anchor links.',
          code: '<h2 id="section1">Section 1</h2>',
        }
      case 'html buttons':
        return {
          description: 'Buttons (<button>) trigger actions; avoid using links for interactive operations.',
          code: '<button type="button" onclick="alert(\"Clicked\")">Click Me</button>',
        }
      case 'html iframes':
        return {
          description: 'iFrames embed external content. Use sandbox attributes and lazy loading to improve security and performance.',
          code: '<iframe src="https://www.example.com" loading="lazy" width="600" height="400" sandbox="allow-scripts"></iframe>',
        }
      case 'html javascript':
        return {
          description: 'JavaScript adds interactivity. Place <script> tags at end of <body> or use deferred loading to avoid render-blocking.',
          code: '<script>document.getElementById(\"btn\").addEventListener(\"click\", () => alert(\"Hello\"));</script>',
        }
      case 'html file paths':
        return {
          description: 'Relative and absolute paths point files correctly. Use / for root path, ./ for current folder, and ../ for parent folder.',
          code: '<img src="./images/logo.png" alt="Logo" />',
        }
      case 'html head':
        return {
          description: '<head> contains metadata, title, styles, and scripts. Keep only non-visible page settings here.',
          code: '<head><meta charset="UTF-8"><title>My Page</title></head>',
        }
      case 'html layout':
        return {
          description: 'Page layout uses CSS Grid or Flexbox along with HTML structure to create responsive designs.',
          code: '<div style="display:grid;grid-template-columns:1fr 2fr;"><aside>Nav</aside><main>Content</main></div>',
        }
      case 'html responsive':
        return {
          description: 'Responsive design uses viewport meta and media queries for mobile friendliness.',
          code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<style>@media (max-width: 600px){body{font-size:14px;}}</style>',
        }
      case 'html computercode':
        return {
          description: 'Use <pre><code> to show computer code verbatim preserving whitespace.',
          code: '<pre><code>&lt;div&gt;Hello&lt;/div&gt;</code></pre>',
        }
      case 'html semantics':
        return {
          description: 'Semantics use <header>, <nav>, <article>, <section> to improve accessibility and SEO.',
          code: '<article><header><h1>Article title</h1></header><p>Text</p></article>',
        }
      case 'html style guide':
        return {
          description: 'Follow consistent naming, indentation, and semantics. Use linters and validators for quality.',
          code: '<!-- Document coding standards for your team -->',
        }
      case 'html entities':
        return {
          description: 'Use HTML entities for reserved characters, e.g., &amp; &lt; &gt; &quot;. Support special symbols safely.',
          code: '&lt;p&gt;A &amp; B &lt;/p&gt;',
        }
      case 'html symbols':
        return {
          description: 'Symbols such as &copy; and &reg; represent special characters in HTML pages.',
          code: '<p>&copy; 2026 DevHub</p>',
        }
      case 'html emojis':
        return {
          description: 'Use Unicode emojis directly or entity codes in text content for expressive UI.',
          code: '<p>HTML is fun 😊</p>',
        }
      case 'html charsets':
        return {
          description: 'charset meta tag sets the document text encoding. UTF-8 is recommended for broad compatibility.',
          code: '<meta charset="UTF-8">',
        }
      case 'html url encode':
        return {
          description: 'URL encodes spaces and special characters for links. Use encodeURIComponent in JS for dynamic URLs.',
          code: '<a href="https://www.example.com/search?q=hello%20world">Search</a>',
        }
      case 'html vs xhtml':
        return {
          description: 'HTML5 is lenient; XHTML is stricter XML-style and requires closing tags and lowercase names.',
          code: '<!DOCTYPE html> vs <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN">',
        }
      case 'html forms':
        return {
          description: 'Forms collect user input. Use <form>, <label>, and proper field types for accessibility.',
          code: '<form><label>Name:<input name="name" required></label><button type="submit">Submit</button></form>',
        }
      case 'html form attributes':
        return {
          description: 'Attributes include action, method, enctype, autocomplete and novalidate for form behavior.',
          code: '<form action="/submit" method="post" autocomplete="on"></form>',
        }
      case 'html form elements':
        return {
          description: 'Elements include <input>, <textarea>, <select>, <button>, and fieldsets for grouped fields.',
          code: '<label>Email:<input type="email" required></label>',
        }
      case 'html input types':
        return {
          description: 'Input types like text, email, password, number, date enhance validation and keyboard support.',
          code: '<input type="email" placeholder="user@example.com"/>',
        }
      case 'html input attributes':
        return {
          description: 'Common attributes are placeholder, required, min, max, pattern, step, and readonly.',
          code: '<input type="number" min="1" max="10" />',
        }
      case 'input form attributes':
        return {
          description: 'Input attributes include name, value, aria-labels, and tabindex for accessibility.',
          code: '<input name="username" aria-label="Username" required>',
        }
      case 'html graphics':
        return {
          description: 'Graphics use <canvas> and <svg> for drawing and vector shapes directly in HTML.',
          code: '<canvas id="myCanvas" width="200" height="100"></canvas>',
        }
      case 'html canvas':
        return {
          description: 'Canvas provides an area for scriptable rendering of 2D shapes and bitmap images.',
          code: '<canvas id="canvas" width="300" height="150"></canvas>\n<script>const c=document.getElementById("canvas").getContext("2d");c.fillStyle="#f59e0b";c.fillRect(20,20,150,100);</script>',
        }
      case 'html svg':
        return {
          description: 'SVG is XML-based vector graphics; resolution-independent and animatable with CSS and JS.',
          code: '<svg width="120" height="120"><circle cx="60" cy="60" r="50" stroke="black" stroke-width="2" fill="lightblue" /></svg>',
        }
      case 'html media':
        return {
          description: 'Media elements include <video> and <audio> for embedding multimedia content with controls.',
          code: '<video controls width="320"><source src="sample.mp4" type="video/mp4"></video>',
        }
      case 'html video':
        return {
          description: 'Video has controls, autoplay, loop, muted, and preload attributes.',
          code: '<video controls width="320"><source src="sample.mp4" type="video/mp4"></video>',
        }
      case 'html audio':
        return {
          description: 'Audio is for sound playback using <audio> tags and optional progress handling.',
          code: '<audio controls><source src="sample.mp3" type="audio/mpeg"></audio>',
        }
      case 'html plug-ins':
        return {
          description: 'Plugins are mostly deprecated; use native media elements and Web APIs instead.',
          code: '<!-- Avoid legacy plugin <embed> or <object> for modern apps -->',
        }
      case 'html youtube':
        return {
          description: 'Embed YouTube with <iframe> using privacy-enhanced URLs and lazy loading.',
          code: '<iframe width="560" height="315" loading="lazy" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>',
        }
      case 'html apis':
        return {
          description: 'Web APIs provide browser features like Geolocation, Drag and Drop, and Web Storage for advanced app interaction.',
          code: '<script>navigator.geolocation.getCurrentPosition(p=>console.log(p.coords))</script>',
        }
      case 'html web apis':
        return {
          description: 'Core APIs include DOM, Fetch, Storage, and Media APIs accessible from JavaScript.',
          code: '<script>fetch("/data.json").then(r=>r.json()).then(console.log)</script>',
        }
      case 'html geolocation':
        return {
          description: 'Geolocation API gets user location with permission; use HTTPS and fallbacks gracefully.',
          code: '<script>navigator.geolocation.getCurrentPosition(pos => console.log(pos.coords));</script>',
        }
      case 'html drag and drop':
        return {
          description: 'Drag and Drop API enables user-driven element dragging with dragenter/dragleave/drop events.',
          code: '<div draggable="true" ondragstart="event.dataTransfer.setData(\"text\", event.target.id)">Drag me</div>',
        }
      case 'html web storage':
        return {
          description: 'Web Storage has localStorage/sessionStorage for persistent key/value data in the browser.',
          code: '<script>localStorage.setItem("name","devhub")</script>',
        }
      case 'html web workers':
        return {
          description: 'Web Workers run scripts in background threads for CPU-intensive tasks without blocking UI.',
          code: '<script>const worker=new Worker("worker.js")</script>',
        }
      case 'html sse':
        return {
          description: 'Server-Sent Events enable one-way real-time server updates with EventSource.',
          code: '<script>new EventSource("/events").onmessage=e=>console.log(e.data)</script>',
        }
      case 'html examples':
        return {
          description: 'Examples show how to combine tags into practical pages for learning and reuse.',
          code: '<section><h2>Example</h2><p>This is a sample page block.</p></section>',
        }
      case 'html editor':
        return {
          description: 'The TryItYourself editor provides live HTML editing and preview right in this course page.',
          code: '<!-- Use the editor panel to test code in real-time -->',
        }
      case 'html quiz':
        return {
          description: 'Quizzes help reinforce concepts with questions and instant feedback.',
          code: '<!-- Add quiz items in the learning platform -->',
        }
      case 'html exercises':
        return {
          description: 'Exercises let you practice by solving small tasks like creating lists, links, and forms.',
          code: '<!-- Practice exercises will appear here. -->',
        }
      case 'html challenges':
        return {
          description: 'Challenges are harder tasks that combine multiple concepts into a real project.',
          code: '<!-- Build a small blog layout to test your knowledge -->',
        }
      case 'html website':
        return {
          description: 'Build a simple website structure with header, footer, nav, and content sections.',
          code: '<header><h1>Website</h1></header><main><p>Page</p></main><footer>Footer</footer>',
        }
      case 'html syllabus':
        return {
          description: 'Syllabus outlines the learning path and topics covered from beginner to advanced.',
          code: '<ul><li>Intro</li><li>Elements</li><li>Forms</li></ul>',
        }
      case 'html study plan':
        return {
          description: 'Study plan helps schedule topics over days with incremental progress and goals.',
          code: '<!-- Example: Day1=Intro, Day2=Elements -->',
        }
      case 'html interview prep':
        return {
          description: 'Interview prep focuses on common HTML questions, page optimization, and semantics.',
          code: '<!-- Sample question: difference between id and class -->',
        }
      case 'html bootcamp':
        return {
          description: 'Bootcamp bundles intensive training sessions covering core web development skills.',
          code: '<!-- Bootcamp project structure here -->',
        }
      case 'html certificate':
        return {
          description: 'Completing the course earns an achievement certificate for your portfolio.',
          code: '<!-- User certificate can be generated on completion -->',
        }
      case 'html summary':
        return {
          description: 'Summary recaps major topics and best practices learned in this HTML course.',
          code: '<!-- Wrap-up notes -->',
        }
      case 'html accessibility':
        return {
          description: 'Accessibility ensures content is usable by everyone, including screen readers and keyboard users.',
          code: '<button aria-label="Close menu">✕</button>',
        }
      case 'html references':
        return {
          description: 'Reference sections list syntax, elements, attributes, and browser support details.',
          code: '<!-- Use MDN or W3C for in-depth references -->',
        }
      case 'html tag list':
        return {
          description: 'Tag list includes all HTML elements with usage and semantics for each.',
          code: '<ul><li><code>&lt;div&gt;</code></li><li><code>&lt;p&gt;</code></li></ul>',
        }
      case 'html global attributes':
        return {
          description: 'Global attributes apply to all elements, such as id, class, data-*, style, title, and aria-*.',
          code: '<p class="note" title="Tooltip">Global attribute example</p>',
        }
      case 'html browser support':
        return {
          description: 'Check compatibility tables for each element and API; use polyfills when needed.',
          code: '<!-- Add feature detection scripts if needed -->',
        }
      case 'html events':
        return {
          description: 'Events like click, submit, and load can trigger JavaScript functions.',
          code: '<button onclick="alert(\"Clicked\")">Press</button>',
        }
      case 'html doctype':
        return {
          description: 'DOCTYPE declaration at top of document defines standard HTML5 mode.',
          code: '<!DOCTYPE html>',
        }
      case 'http messages':
        return {
          description: 'HTTP messages include request/response headers and body content exchanged between client/server.',
          code: 'GET /index.html HTTP/1.1',
        }
      case 'http methods':
        return {
          description: 'Common HTTP methods: GET, POST, PUT, DELETE, PATCH for CRUD APIs used by web apps.',
          code: 'fetch("/api/data", { method: "POST" })',
        }
      case 'px to em converter':
        return {
          description: 'Use em/rem units for scalable typography; 16px commonly equals 1em in browsers.',
          code: '<style>p{font-size:1.125rem;}</style>',
        }
      case 'keyboard shortcuts':
        return {
          description: 'Keyboard shortcuts improve productivity in editors (e.g., Ctrl+S save, Ctrl+F find).',
          code: '<!-- Example: Ctrl+C copy, Ctrl+V paste. -->',
        }
      default:
        return {
          description: `${topic} is an important topic in HTML. Read this note and practice with the provided code sample for better mastery.`,
          code: `<p>Practice example for ${topic}</p>`,
        }
    }
  }

  const activeHtmlDetails = getHtmlTopicDetails(activeHtmlTopic)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'badge-success'
      case 'INTERMEDIATE': return 'badge-warning'
      case 'ADVANCED': return 'badge-danger'
      default: return 'badge-primary'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    )
  }

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="card overflow-hidden relative">
        <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700" />

        {course.slug === 'html-tutorial' && (
          <div className="absolute inset-x-0 top-4 z-20 px-6">
            <div className="flex items-center justify-between gap-6 rounded-lg border border-white/30 bg-white/85 p-2 shadow-md backdrop-blur">
              <div className="flex items-center gap-3">
                <a
                  href="/"
                  className="rounded px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition"
                >
                  Home
                </a>
                <button
                  onClick={() => {
                    const currentTopicIndex = htmlTopics.findIndex((topic) => topic === activeHtmlTopic)
                    const prevTopic = htmlTopics[currentTopicIndex - 1]
                    if (prevTopic) {
                      setActiveHtmlTopic(prevTopic)
                      setSearchParams({ topic: prevTopic })
                    }
                  }}
                  disabled={htmlTopics.indexOf(activeHtmlTopic) === 0}
                  className="rounded px-4 py-2 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  &lt; Previous
                </button>
                <button
                  onClick={() => {
                    const currentTopicIndex = htmlTopics.findIndex((topic) => topic === activeHtmlTopic)
                    const nextTopic = htmlTopics[currentTopicIndex + 1]
                    if (nextTopic) {
                      setActiveHtmlTopic(nextTopic)
                      setSearchParams({ topic: nextTopic })
                    }
                  }}
                  disabled={htmlTopics.indexOf(activeHtmlTopic) === htmlTopics.length - 1}
                  className="rounded px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next &gt;
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">{htmlTopics.indexOf(activeHtmlTopic) + 1}/{htmlTopics.length}</span>
                <button
                  onClick={() => {
                    const payload = {
                      language: 'html',
                      code: activeHtmlDetails.code,
                      topic: activeHtmlTopic,
                      timestamp: Date.now(),
                    }
                    window.sessionStorage.setItem('tryit-yourself', JSON.stringify(payload))
                    window.open('/editor?from=html-tutorial', '_blank', 'noopener')
                  }}
                  className="rounded px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Try It Yourself
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 pt-24">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`badge ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
            <span className="badge bg-gray-100 text-gray-600">{course.category}</span>
            {course.isPremium && <span className="badge badge-warning">Premium</span>}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          {course.slug === 'html-tutorial' && (
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80"
                alt="HTML Project Concept"
                className="w-full h-44 object-cover"
              />
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <span>📚 {lessons.length} lessons</span>
            <span>⏱ {course.estimatedHours || 0} hours</span>
            <span>📝 {course.exercisesCount || 0} exercises</span>
            <span>🏆 {course.quizzesCount || 0} quizzes</span>
          </div>
          
          <Link
            to={`/courses/${course.id}/lessons/${lessons[0]?.id || 1}`}
            className="btn btn-primary"
          >
            Start Learning
          </Link>
        </div>
      </div>

      {/* HTML Tutorial Topic Viewer */}
      {course.slug === 'html-tutorial' && (
        <div className="card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">HTML Tutorial</h2>
            <p className="text-gray-500 text-sm mt-2">
              Use the left sidebar for full topic navigation. The detail content below updates for the selected topic.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900">{activeHtmlTopic}</h3>

            <p className="text-gray-600 leading-relaxed mb-4">
              This section covers <strong>{activeHtmlTopic}</strong>. Keep the left sidebar open for fast jumping between topics.
            </p>

            <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-800">Your notes</h4>
                <button
                  onClick={() => toggleTopicCompletion(activeHtmlTopic)}
                  className={`text-xs font-semibold px-2 py-1 rounded ${completedTopics.includes(activeHtmlTopic) ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                >
                  {completedTopics.includes(activeHtmlTopic) ? 'Mark as Undone' : 'Mark as Done'}
                </button>
              </div>
              <textarea
                value={draftTopicNote}
                onChange={(e) => setDraftTopicNote(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded p-2 text-sm"
                placeholder="Write your own notes for this topic..."
              />
              <div className="mt-2 flex gap-2 justify-end">
                <button
                  onClick={() => saveTopicNotes({ ...topicNotes, [activeHtmlTopic]: draftTopicNote })}
                  className="btn btn-sm btn-primary"
                >
                  Save notes
                </button>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p>{activeHtmlDetails.description}</p>
              <pre>{activeHtmlDetails.code}</pre>
              <div className="mt-4">
                <button
                  onClick={() => {
                    const payload = {
                      language: 'html',
                      code: activeHtmlDetails.code,
                      topic: activeHtmlTopic,
                      timestamp: Date.now(),
                    }
                    window.sessionStorage.setItem('tryit-yourself', JSON.stringify(payload))
                    window.open('/editor?from=html-tutorial', '_blank', 'noopener')
                  }}
                  className="btn btn-primary"
                >
                  Try It Yourself in full IDE
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Course Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lessons List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
          {lessons.map((lesson, index) => (
            <Link
              key={lesson.id}
              to={`/courses/${course.id}/lessons/${lesson.id}`}
              className="card card-hover p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                <p className="text-sm text-gray-500">
                  {lesson.estimatedMinutes || 10} min
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">What you'll learn</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Fundamentals of {course.title}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Hands-on coding exercises</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Build real-world projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Certificate of completion</span>
              </li>
            </ul>
          </div>
          
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Basic computer skills</li>
              <li>• No prior programming experience needed</li>
              <li>• A modern web browser</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
