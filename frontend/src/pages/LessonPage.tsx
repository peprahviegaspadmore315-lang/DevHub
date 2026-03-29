import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { lessonsApi, progressApi } from '@/services/api'
import { OrbitalLoader } from '@/components/ui/orbital-loader'
import { useLessonRobot } from '@/components/robot'
import { useAIAssistant } from '@/contexts/AIAssistantContext'
import TryItYourself from '@/components/editor/TryItYourself'
import { courseData } from '@/data/courseData'
import { createCourseTopicSlugMap } from '@/lib/course-topic-slugs'
import {
  loadStoredCourseCompletedTopics,
  loadStoredCourseTopicNotes,
  saveStoredCourseCompletedTopics,
  saveStoredCourseTopicNotes,
} from '@/lib/learning-progress'
import { useAuthStore } from '@/store'
import type { Lesson } from '@/types'

const LessonPage = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { setLearningContext, clearLearningContext } = useAIAssistant()
  const user = useAuthStore((state) => state.user)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [topicNotes, setTopicNotes] = useState<Record<string, string>>({})
  const [completedTopics, setCompletedTopics] = useState<string[]>([])
  const [draftTopicNote, setDraftTopicNote] = useState('')

  const courseIdNumber = courseId ? parseInt(courseId, 10) : 0
  const currentCourse = useMemo(
    () => courseData.find((course) => course.id === courseIdNumber) || null,
    [courseIdNumber]
  )
  const courseLessons = currentCourse?.lessons || []
  const topicSlugMap = useMemo(() => createCourseTopicSlugMap(courseLessons), [courseLessons])
  const currentTopic = lesson?.title || ''
  const currentTopicSlug = useMemo(() => {
    if (!lesson) {
      return ''
    }

    const directSlug = topicSlugMap[lesson.id]
    if (directSlug) {
      return directSlug
    }

    const matchedLesson = courseLessons.find(
      (courseLesson) => courseLesson.id === lesson.id || courseLesson.title === lesson.title
    )

    return matchedLesson
      ? topicSlugMap[matchedLesson.id] || matchedLesson.title.toLowerCase().replace(/\s+/g, '-')
      : lesson.title.toLowerCase().replace(/\s+/g, '-')
  }, [courseLessons, lesson, topicSlugMap])
  const { readLesson } = useLessonRobot(lesson)

  useEffect(() => {
    const activeNoteKey = currentTopicSlug || currentTopic
    if (activeNoteKey && topicNotes[activeNoteKey]) {
      setDraftTopicNote(topicNotes[activeNoteKey])
    } else {
      setDraftTopicNote('')
    }
  }, [currentTopic, currentTopicSlug, topicNotes])

  useEffect(() => {
    if (!courseIdNumber || courseLessons.length === 0) {
      setCompletedTopics([])
      setTopicNotes({})
      return
    }

    setCompletedTopics(
      loadStoredCourseCompletedTopics({
        courseId: courseIdNumber,
        lessons: courseLessons,
        userId: user?.id,
      })
    )
    setTopicNotes(
      loadStoredCourseTopicNotes({
        courseId: courseIdNumber,
        lessons: courseLessons,
        userId: user?.id,
      })
    )
  }, [courseIdNumber, courseLessons, user?.id])

  // Robot reads lesson when it loads
  useEffect(() => {
    if (lesson && lesson.title) {
      readLesson()
    }
  }, [lesson?.id, lesson?.title, readLesson])

  useEffect(() => {
    if (!lesson) {
      clearLearningContext()
      return
    }

    setLearningContext({
      source: 'lesson-page',
      route: window.location.pathname + window.location.search,
      courseId: lesson.courseId,
      courseTitle: lesson.courseTitle,
      topicTitle: lesson.title,
      topicSummary: lesson.content || '',
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      lessonContent: lesson.content || '',
      codeExample: lesson.codeExample || '',
    })

    return () => {
      clearLearningContext()
    }
  }, [clearLearningContext, lesson, setLearningContext])

  const saveTopicNotes = (notes: Record<string, string>) => {
    setTopicNotes(notes)
    saveStoredCourseTopicNotes({
      courseId: courseIdNumber,
      lessons: courseLessons,
      notes,
      userId: user?.id,
    })
  }

  const toggleTopicCompletion = (topicSlug: string) => {
    if (completedTopics.includes(topicSlug)) {
      const nextList = completedTopics.filter((topic) => topic !== topicSlug)
      setCompletedTopics(nextList)
      saveStoredCourseCompletedTopics({
        courseId: courseIdNumber,
        lessons: courseLessons,
        topicSlugs: nextList,
        userId: user?.id,
      })
    } else {
      const nextList = [...completedTopics, topicSlug]
      setCompletedTopics(nextList)
      saveStoredCourseCompletedTopics({
        courseId: courseIdNumber,
        lessons: courseLessons,
        topicSlugs: nextList,
        userId: user?.id,
      })
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

    if (currentTopicSlug && !completedTopics.includes(currentTopicSlug)) {
      const nextList = [...completedTopics, currentTopicSlug]
      setCompletedTopics(nextList)
      saveStoredCourseCompletedTopics({
        courseId: courseIdNumber,
        lessons: courseLessons,
        topicSlugs: nextList,
        userId: user?.id,
      })
    }

    try {
      await progressApi.markLessonComplete(parseInt(lessonId))
    } catch (error) {
      console.error('Failed to mark complete:', error)
    }

    if (lesson?.hasNext && lesson.nextLessonId) {
      navigate(`/courses/${courseId}/lessons/${lesson.nextLessonId}`)
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
      <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50/70 px-6 py-16 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <OrbitalLoader
          message="Loading your lesson content and getting the reading tools ready..."
          size="lg"
        />
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
                      const noteKey = currentTopicSlug || currentTopic
                      saveTopicNotes({ ...topicNotes, [noteKey]: draftTopicNote })
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => toggleTopicCompletion(currentTopicSlug || currentTopic)}
                    className={`btn btn-sm ${completedTopics.includes(currentTopicSlug || currentTopic) ? 'btn-success' : 'btn-outline'}`}
                  >
                    {completedTopics.includes(currentTopicSlug || currentTopic) ? 'Completed' : 'Mark Complete'}
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
