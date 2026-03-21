import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { lessonsApi, progressApi } from '@/services/api'
import { useLessonRobot } from '@/components/robot'
import TryItYourself from '@/components/editor/TryItYourself'
import { courseData } from '@/data/courseData'
import type { Lesson } from '@/types'

const LessonPage = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [topicNotes, setTopicNotes] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {}
    return JSON.parse(localStorage.getItem('lesson_topic_notes') || '{}')
  })
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('lesson_completed_topics') || '[]')
  })
  const [draftTopicNote, setDraftTopicNote] = useState('')

  const currentTopic = lesson?.title || ''
  const { readLesson } = useLessonRobot(lesson)

  useEffect(() => {
    if (currentTopic && topicNotes[currentTopic]) {
      setDraftTopicNote(topicNotes[currentTopic])
    } else {
      setDraftTopicNote('')
    }
  }, [currentTopic, topicNotes])

  // Robot reads lesson when it loads
  useEffect(() => {
    if (lesson && lesson.title) {
      readLesson()
    }
  }, [lesson?.id, lesson?.title, readLesson])

  const saveTopicNotes = (notes: Record<string, string>) => {
    setTopicNotes(notes)
    localStorage.setItem('lesson_topic_notes', JSON.stringify(notes))
  }

  const toggleTopicCompletion = (topic: string) => {
    if (completedTopics.includes(topic)) {
      const nextList = completedTopics.filter((t) => t !== topic)
      setCompletedTopics(nextList)
      localStorage.setItem('lesson_completed_topics', JSON.stringify(nextList))
    } else {
      const nextList = [...completedTopics, topic]
      setCompletedTopics(nextList)
      localStorage.setItem('lesson_completed_topics', JSON.stringify(nextList))
    }
  }

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId || !courseId) return
      try {
        const res = await lessonsApi.getById(parseInt(lessonId))
        if (res?.data) {
          setLesson(res.data)
        } else {
          throw new Error('Lesson not found via API')
        }
      } catch (error) {
        console.warn('API lesson fetch failed, falling back to local data:', error)
        const localCourse = courseData.find((c) => c.id === parseInt(courseId))
        const localLesson = localCourse?.lessons.find((l) => l.id === parseInt(lessonId))
        if (localLesson) {
          setLesson({
            ...localLesson,
            courseId: localCourse?.id || 0,
            courseTitle: localCourse?.title || 'HTML Tutorial',
            slug: localLesson.title.toLowerCase().replace(/\s+/g, '-'),
            orderIndex: localLesson.id,
            isPublished: true,
            isPremium: false,
            hasNext: !!localCourse?.lessons.some((l) => l.id === parseInt(lessonId) + 1),
            hasPrevious: !!localCourse?.lessons.some((l) => l.id === parseInt(lessonId) - 1),
            nextLessonId: localCourse?.lessons.find((l) => l.id === parseInt(lessonId) + 1)?.id,
            previousLessonId: localCourse?.lessons.find((l) => l.id === parseInt(lessonId) - 1)?.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as unknown as Lesson)
        } else {
          setLesson(null)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [courseId, lessonId])

  const handleMarkComplete = async () => {
    if (!lessonId) return
    try {
      await progressApi.markLessonComplete(parseInt(lessonId))
      if (lesson?.hasNext && lesson.nextLessonId) {
        navigate(`/courses/${courseId}/lessons/${lesson.nextLessonId}`)
      }
    } catch (error) {
      console.error('Failed to mark complete:', error)
    }
  }

  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    )
  }

  if (!lesson) {
    return <div>Lesson not found</div>
  }

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Lesson Header */}
        <div className="card p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to={`/courses/${courseId}`} className="hover:text-primary-600">
              {lesson.courseTitle}
            </Link>
            <span>›</span>
            <span className="text-gray-900">{lesson.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          {lesson.estimatedMinutes && (
            <p className="text-gray-500 mt-1">Estimated time: {lesson.estimatedMinutes} minutes</p>
          )}
        </div>

        {/* Lesson Content */}
        <div className="card p-6">
          <div className="prose max-w-none">
            <ReactMarkdown components={components}>
              {lesson.content}
            </ReactMarkdown>
          </div>

          {/* Code Example */}
          {lesson.codeExample && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Example</h2>
              <div className="rounded-lg overflow-hidden">
                <SyntaxHighlighter language="html" style={oneDark}>
                  {lesson.codeExample}
                </SyntaxHighlighter>
              </div>
              <button
                onClick={() => setShowCodeEditor(true)}
                className="btn btn-primary mt-4"
              >
                Try It Yourself →
              </button>
            </div>
          )}

          {/* Try It Yourself Editor */}
          {showCodeEditor && lesson.codeExample && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Try It Yourself</h2>
                <button
                  onClick={() => setShowCodeEditor(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕ Close
                </button>
              </div>
              <TryItYourself 
                defaultCode={lesson.codeExample} 
                defaultLanguage="html"
                height="500px"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {lesson.previousLessonId ? (
            <Link
              to={`/courses/${courseId}/lessons/${lesson.previousLessonId}`}
              className="btn btn-secondary"
            >
              ← Previous Lesson
            </Link>
          ) : (
            <div />
          )}
          
          <button onClick={handleMarkComplete} className="btn btn-primary">
            Mark Complete & Next →
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="card p-4 sticky top-20">
          <h3 className="font-semibold text-gray-900 mb-3">Lesson Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowCodeEditor(true)}
              className="w-full btn btn-primary justify-start"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Open Code Editor
            </button>

            {lesson && (
              <div className="card p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm font-medium text-gray-700 mb-2">Lesson Notes</p>
                <textarea
                  value={draftTopicNote}
                  onChange={(e) => setDraftTopicNote(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  placeholder="Add note for this lesson..."
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      saveTopicNotes({ ...topicNotes, [currentTopic]: draftTopicNote })
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => toggleTopicCompletion(currentTopic)}
                    className={`btn btn-sm ${completedTopics.includes(currentTopic) ? 'btn-success' : 'btn-outline'}`}
                  >
                    {completedTopics.includes(currentTopic) ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            )}

            <Link
              to={`/courses/${courseId}`}
              className="w-full btn btn-outline justify-start"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              View All Lessons
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonPage
