import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, ChevronRight, PlayCircle, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import AnimatedNumberFlip from '@/components/ui/animated-number-flip'
import { Button } from '@/components/ui/button'
import { OrbitalLoader } from '@/components/ui/orbital-loader'
import { useAIAssistant } from '@/contexts/AIAssistantContext'
import { coursesApi } from '@/services/api'
import { topicApi, Topic } from '@/services/topicService'
import { courseData, type CourseData } from '@/data/courseData'
import { createCourseTopicSlugMap } from '@/lib/course-topic-slugs'
import {
  loadStoredCourseCompletedTopics,
  loadStoredCourseTopicNotes,
  saveStoredCourseCompletedTopics,
  saveStoredCourseTopicNotes,
} from '@/lib/learning-progress'
import { useAuthStore } from '@/store'
import type { Course, Lesson } from '@/types'

const courseHeroVisuals: Record<
  string,
  {
    alt: string
    image: string
    overlayLabel: string
    overlayTintClass: string
  }
> = {
  'html-tutorial': {
    alt: 'HTML tutorial hero showing a blurred code editor and browser-like screen',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80',
    overlayLabel: 'Web Structure',
    overlayTintClass: 'from-slate-950/10 via-sky-900/10 to-slate-950/35',
  },
  'css-tutorial': {
    alt: 'CSS tutorial hero showing a clean interface-design workspace',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
    overlayLabel: 'Visual Styling',
    overlayTintClass: 'from-cyan-950/15 via-sky-900/10 to-slate-950/30',
  },
  'java-tutorial': {
    alt: 'Java tutorial hero showing a clean workstation focused on object-oriented coding practice',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80',
    overlayLabel: 'Interactive Logic',
    overlayTintClass: 'from-amber-950/15 via-slate-950/5 to-slate-950/35',
  },
  'python-tutorial': {
    alt: 'Python tutorial hero showing a bright coding workspace suited to scripting and automation',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',
    overlayLabel: 'Automation & Data',
    overlayTintClass: 'from-blue-950/20 via-slate-950/5 to-slate-950/35',
  },
}

const getCourseHeroVisual = (slug?: string, title?: string) => {
  if (slug && courseHeroVisuals[slug]) {
    return courseHeroVisuals[slug]
  }

  const normalizedTitle = title?.toLowerCase() || ''

  if (normalizedTitle.includes('html')) {
    return courseHeroVisuals['html-tutorial']
  }

  if (normalizedTitle.includes('css')) {
    return courseHeroVisuals['css-tutorial']
  }

  if (normalizedTitle.includes('java')) {
    return courseHeroVisuals['java-tutorial']
  }

  if (normalizedTitle.includes('python')) {
    return courseHeroVisuals['python-tutorial']
  }

  return {
    alt: 'Programming tutorial hero image showing a coding workspace',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    overlayLabel: 'Learning Path',
    overlayTintClass: 'from-slate-950/10 via-slate-900/10 to-slate-950/35',
  }
}

const mapLessonsToTopics = (courseIdNumber: number, topicLanguage: string): Topic[] => {
  const localCourse = courseData.find((c) => c.id === courseIdNumber)
  if (!localCourse?.lessons) {
    return []
  }

  const lessonSlugs = createCourseTopicSlugMap(localCourse.lessons)

  return localCourse.lessons.map((lesson) => ({
    id: lesson.id,
    language: topicLanguage,
    slug: lessonSlugs[lesson.id],
    title: lesson.title,
    description: lesson.content,
    simpleExplanation: lesson.summary,
    difficulty: 'beginner',
    orderIndex: lesson.id,
    codeExamples: lesson.codeSample
      ? [{
          id: lesson.id,
          title: `${lesson.title} Example`,
          description: lesson.summary,
          code: lesson.codeSample,
          codeLanguage: topicLanguage,
          output: '',
          orderIndex: 1,
        }]
      : [],
    keyPoints: [],
    video: null,
    isPremium: false,
    whyLearn: '',
  } as Topic))
}

const buildLocalCoursePayload = (localCourse: CourseData) => {
  const lessonSlugs = createCourseTopicSlugMap(localCourse.lessons)

  return {
    course: {
      id: localCourse.id,
      title: localCourse.title,
      description: localCourse.description,
      category: localCourse.category,
      difficulty: localCourse.difficulty,
      slug: localCourse.slug,
      iconUrl: localCourse.image,
      bannerUrl: localCourse.image,
      estimatedHours: Math.max(1, Number((localCourse.lessons.length * 0.25).toFixed(1))),
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
    } as Course,
    lessons: localCourse.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      summary: lesson.summary,
      estimatedMinutes: 10,
      courseId: localCourse.id,
      courseTitle: localCourse.title,
      slug: lessonSlugs[lesson.id],
      orderIndex: lesson.id,
      isPublished: true,
      isPremium: false,
      hasNext: !!localCourse.lessons.find((item) => item.id === lesson.id + 1),
      hasPrevious: !!localCourse.lessons.find((item) => item.id === lesson.id - 1),
      nextLessonId: localCourse.lessons.find((item) => item.id === lesson.id + 1)?.id,
      previousLessonId: localCourse.lessons.find((item) => item.id === lesson.id - 1)?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Lesson)),
  }
}

const CourseDetailPage = () => {
  const { courseId } = useParams()
  const { setLearningContext, clearLearningContext } = useAIAssistant()
  const user = useAuthStore((state) => state.user)
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return
      const localCourse = courseData.find((c) => c.id === parseInt(courseId, 10))
      if (localCourse) {
        const localPayload = buildLocalCoursePayload(localCourse)
        setCourse(localPayload.course)
        setLessons(localPayload.lessons)
        setLoading(false)
        return
      }

      try {
        const [courseRes, lessonsRes] = await Promise.all([
          coursesApi.getById(parseInt(courseId)),
          coursesApi.getLessons(parseInt(courseId)),
        ])
        setCourse(courseRes.data)
        setLessons(lessonsRes.data)
      } catch (error) {
        console.warn('Failed to fetch course from API, using fallback:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [courseId])

  const [searchParams, setSearchParams] = useSearchParams()
  const [topics, setTopics] = useState<Topic[]>([])
  const [activeTopicSlug, setActiveTopicSlug] = useState('')
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null)

  const activeTopicDetails = activeTopic
    ? {
        title: activeTopic.title,
        description: activeTopic.description || activeTopic.simpleExplanation || 'No description available.',
        code: activeTopic.codeExamples?.[0]?.code || '',
      }
    : { title: '', description: '', code: '' }

  const [completedTopics, setCompletedTopics] = useState<string[]>([])
  const [topicNotes, setTopicNotes] = useState<Record<string, string>>({})
  const [draftTopicNote, setDraftTopicNote] = useState('')
  const topicRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const courseLanguageMap: Record<number, string> = {
    1: 'html',
    2: 'css',
    3: 'java',
    4: 'python',
  }

  const courseIdNumber = courseId ? parseInt(courseId, 10) : 0
  const topicLanguage = courseLanguageMap[courseIdNumber] || 'html'
  const storageLessons =
    lessons.length > 0
      ? lessons
      : courseData.find((item) => item.id === courseIdNumber)?.lessons || []

  useEffect(() => {
    if (!courseIdNumber || storageLessons.length === 0) {
      setCompletedTopics([])
      setTopicNotes({})
      return
    }

    setCompletedTopics(
      loadStoredCourseCompletedTopics({
        courseId: courseIdNumber,
        lessons: storageLessons,
        userId: user?.id,
      })
    )
    setTopicNotes(
      loadStoredCourseTopicNotes({
        courseId: courseIdNumber,
        lessons: storageLessons,
        userId: user?.id,
      })
    )
  }, [courseIdNumber, storageLessons, user?.id])

  useEffect(() => {
    const loadTopics = async () => {
      const localTopics = mapLessonsToTopics(courseIdNumber, topicLanguage)
      if (localTopics.length > 0) {
        setTopics(localTopics)
        return
      }

      try {
        const data = await topicApi.getTopics(topicLanguage)
        setTopics(data)
      } catch (error) {
        console.warn('Failed to fetch topics from API, using courseData fallback:', error)
      }
    }

    loadTopics()
  }, [topicLanguage, courseIdNumber])

  useEffect(() => {
    if (topics.length === 0) return

    const topicParam = searchParams.get('topic')?.trim().toLowerCase()
    const matchingTopic = topics.find((topic) =>
      topic.slug.toLowerCase() === topicParam || topic.title.toLowerCase() === topicParam
    )

    if (matchingTopic && matchingTopic.slug !== activeTopicSlug) {
      setActiveTopicSlug(matchingTopic.slug)
    } else if (!activeTopicSlug) {
      setActiveTopicSlug(topics[0].slug)
    }
  }, [searchParams, topics, activeTopicSlug])

  useEffect(() => {
    const selected = topics.find((topic) => topic.slug === activeTopicSlug)
    setActiveTopic(selected || null)
  }, [activeTopicSlug, topics])

  useEffect(() => {
    if (!activeTopic) {
      setDraftTopicNote('')
      return
    }

    setDraftTopicNote(topicNotes[activeTopic.slug] || '')
  }, [activeTopic, topicNotes])

  useEffect(() => {
    if (!course || !activeTopic) {
      clearLearningContext()
      return
    }

    setLearningContext({
      source: 'course-detail-page',
      route: window.location.pathname + window.location.search,
      language: topicLanguage,
      courseId: course.id,
      courseTitle: course.title,
      topicSlug: activeTopic.slug,
      topicTitle: activeTopic.title,
      topicSummary:
        activeTopic.simpleExplanation ||
        activeTopic.description ||
        course.description ||
        '',
      lessonTitle: activeTopic.title,
      lessonContent: activeTopic.description || activeTopic.simpleExplanation || '',
      codeExample: activeTopic.codeExamples?.[0]?.code || '',
    })

    return () => {
      clearLearningContext()
    }
  }, [activeTopic, clearLearningContext, course, setLearningContext, topicLanguage])

  useEffect(() => {
    if (!activeTopic) return

    const paramValue = searchParams.get('topic')
    const matchingTopic = paramValue
      ? topics.find((topic) =>
          topic.slug.toLowerCase() === paramValue.toLowerCase() ||
          topic.title.toLowerCase() === paramValue.toLowerCase()
        )
      : null

    if (!matchingTopic && paramValue !== activeTopic.slug) {
      setSearchParams({ topic: activeTopic.slug }, { replace: true })
    }

    const activeButton = topicRefs.current[activeTopic.slug]
    if (activeButton) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeTopic, searchParams, setSearchParams, topics])

  const saveCompletedTopics = (topicSlugs: string[]) => {
    setCompletedTopics(topicSlugs)
    saveStoredCourseCompletedTopics({
      courseId: courseIdNumber,
      lessons: storageLessons,
      topicSlugs,
      userId: user?.id,
    })
  }

  const saveTopicNotes = (notes: Record<string, string>) => {
    setTopicNotes(notes)
    saveStoredCourseTopicNotes({
      courseId: courseIdNumber,
      lessons: storageLessons,
      notes,
      userId: user?.id,
    })
  }

  const toggleTopicCompletion = (topicSlug: string) => {
    if (completedTopics.includes(topicSlug)) {
      saveCompletedTopics(completedTopics.filter((t) => t !== topicSlug))
    } else {
      saveCompletedTopics([...completedTopics, topicSlug])
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'badge-success'
      case 'INTERMEDIATE': return 'badge-warning'
      case 'ADVANCED': return 'badge-danger'
      default: return 'badge-primary'
    }
  }

  const markdownComponents = {
    code({ inline, className, children, ...props }: any) {
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

  const openTryItYourself = () => {
    if (!activeTopic) return

    const payload = {
      language: topicLanguage,
      code: activeTopicDetails.code,
      topic: activeTopic.title,
      timestamp: Date.now(),
    }
    window.sessionStorage.setItem('tryit-yourself', JSON.stringify(payload))
    window.open(`/editor?from=${topicLanguage}-tutorial`, '_blank', 'noopener')
  }

  const activeTopicIndex = activeTopic
    ? topics.findIndex((topic) => topic.slug === activeTopic.slug)
    : -1
  const currentTopicNumber = activeTopicIndex >= 0 ? activeTopicIndex + 1 : 0
  const previousTopic = activeTopicIndex > 0 ? topics[activeTopicIndex - 1] : null
  const nextTopic = activeTopicIndex >= 0 && activeTopicIndex < topics.length - 1
    ? topics[activeTopicIndex + 1]
    : null

  const navigateToTopic = (topic: Topic | null) => {
    if (!topic) return

    setActiveTopicSlug(topic.slug)
    setSearchParams({ topic: topic.slug })
  }

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center rounded-[2rem] border border-cyan-200/20 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.18),transparent_36%),linear-gradient(135deg,#0b5f87_0%,#0a567d_52%,#094c6e_100%)] px-6 py-16 shadow-2xl shadow-cyan-950/20">
        <OrbitalLoader
          message="Preparing your course overview and topic navigator..."
          size="lg"
          tone="light"
        />
      </div>
    )
  }

  if (!course) {
    return <div>Course not found</div>
  }

  const courseHeroVisual = getCourseHeroVisual(course.slug, course.title)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Course Header */}
      <div className="card relative overflow-hidden">
        <div className="h-36 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.18),transparent_38%),linear-gradient(135deg,#0b5f87_0%,#0a567d_52%,#094c6e_100%)] sm:h-44 xl:h-48" />

        {topics.length > 0 && activeTopic && (
          <div className="z-20 px-4 pb-4 pt-4 sm:px-6 xl:absolute xl:inset-x-0 xl:top-4 xl:pb-0 xl:pt-0">
            <div className="rounded-2xl border border-cyan-200/10 bg-[linear-gradient(135deg,rgba(9,76,110,0.92),rgba(10,86,125,0.94),rgba(8,68,98,0.92))] p-3 text-white shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-4">
              <div className="grid gap-3 2xl:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,0.95fr)] 2xl:items-center">
                <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="h-10 w-full justify-center rounded-xl border border-white/10 bg-white/[0.08] px-4 text-white hover:bg-white/[0.12] sm:w-max"
                  >
                    <Link to="/courses" className="inline-flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>All Courses</span>
                    </Link>
                  </Button>
                  <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-100/80">
                      Topic Navigator
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {activeTopic.title}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center 2xl:flex-nowrap 2xl:justify-self-center">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => navigateToTopic(previousTopic)}
                    disabled={!previousTopic}
                    className="h-11 w-full justify-center rounded-xl border border-white/10 bg-white/[0.08] px-4 text-white hover:bg-white/[0.12] disabled:bg-white/[0.05] disabled:text-white/45 sm:w-auto"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-3 py-2 shadow-inner shadow-black/10 sm:w-auto">
                    <AnimatedNumberFlip
                      value={currentTopicNumber}
                      className="h-12 min-w-[4.25rem] rounded-xl border-white/10 bg-white/[0.12] shadow-none sm:h-14 sm:min-w-[4.75rem]"
                      valueClassName="text-2xl font-bold text-white"
                    />
                    <div className="pr-1 text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-100/80">
                        Lesson
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        of {topics.length}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => navigateToTopic(nextTopic)}
                    disabled={!nextTopic}
                    className="h-11 w-full justify-center rounded-xl bg-cyan-500 px-4 text-white shadow-lg shadow-cyan-950/20 hover:bg-cyan-400 disabled:bg-white/[0.05] disabled:text-white/45 sm:w-auto"
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center 2xl:justify-self-end">
                  <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-100/80">
                      Up Next
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-white/95 sm:max-w-[15rem] lg:max-w-[18rem]">
                      {nextTopic?.title || 'You are on the final topic'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={openTryItYourself}
                    className="h-11 w-full justify-center rounded-xl bg-cyan-500 px-4 text-white shadow-lg shadow-cyan-950/20 hover:bg-cyan-400 md:w-auto"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try It Yourself
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 xl:pt-28">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`badge ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
            <span className="badge bg-gray-100 text-gray-600">{course.category}</span>
            {course.isPremium && <span className="badge badge-warning">Premium</span>}
          </div>
          
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="mb-4 text-gray-600">{course.description}</p>

          {topics.length > 0 && (
            <div className="mb-4 overflow-hidden rounded-[1.2rem] border border-slate-200/80 bg-slate-950/5 shadow-[0_20px_45px_-38px_rgba(15,23,42,0.55)]">
              <div className="relative h-36 sm:h-44">
                <img
                  key={courseHeroVisual.image}
                  src={courseHeroVisual.image}
                  alt={courseHeroVisual.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${courseHeroVisual.overlayTintClass}`}
                />
                <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-white/15 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white shadow-sm backdrop-blur-sm">
                  {courseHeroVisual.overlayLabel}
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 sm:gap-6">
            <span>📚 {lessons.length} lessons</span>
            <span>⏱ {course.estimatedHours || 0} hours</span>
            <span>📝 {course.exercisesCount || 0} exercises</span>
            <span>🏆 {course.quizzesCount || 0} quizzes</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to={`/courses/${course.id}/lessons/${lessons[0]?.id || 1}`}
              className="btn btn-primary w-full text-center sm:w-auto"
            >
              Start Learning
            </Link>
            <Link
              to={`/videos?courseId=${course.id}&course=${course.slug}&language=${topicLanguage}${activeTopic ? `&topic=${activeTopic.slug}` : ''}`}
              className="btn btn-secondary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <PlayCircle className="h-4 w-4" />
              Watch Videos
            </Link>
          </div>
        </div>
      </div>

      {/* Course Topic Viewer */}
      {topics.length > 0 && activeTopic && (
        <div className="card p-4 sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{course.title} Topics</h2>
            <p className="text-gray-500 text-sm mt-2">
              Use the left topic sidebar on larger screens, or open the Topics button on smaller screens. The detail content below updates for the selected topic.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 sm:p-5">
            <h3 className="text-lg font-semibold text-gray-900">{activeTopic.title}</h3>

            <p className="text-gray-600 leading-relaxed mb-4">
              This section covers <strong>{activeTopic.title}</strong>. Keep the topic navigator open for fast jumping between topics.
            </p>

            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-sm font-semibold text-gray-800">Your notes</h4>
                <button
                  onClick={() => toggleTopicCompletion(activeTopic.slug)}
                  className={`text-xs font-semibold px-2 py-1 rounded ${completedTopics.includes(activeTopic.slug) ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                >
                  {completedTopics.includes(activeTopic.slug) ? 'Mark as Undone' : 'Mark as Done'}
                </button>
              </div>
              <textarea
                value={draftTopicNote}
                onChange={(e) => setDraftTopicNote(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded p-2 text-sm"
                placeholder="Write your own notes for this topic..."
              />
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={() => saveTopicNotes({ ...topicNotes, [activeTopic.slug]: draftTopicNote })}
                  className="btn btn-sm btn-primary"
                >
                  Save notes
                </button>
              </div>
            </div>

            <div className="prose prose-slate max-w-none overflow-hidden">
              <ReactMarkdown components={markdownComponents}>
                {activeTopicDetails.description}
              </ReactMarkdown>
              {activeTopicDetails.code && !activeTopicDetails.description.includes('```') && (
                <div className="mt-4">
                  <SyntaxHighlighter language={topicLanguage} style={oneDark}>
                    {activeTopicDetails.code}
                  </SyntaxHighlighter>
                </div>
              )}
              <div className="mt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    onClick={openTryItYourself}
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    Try It Yourself in full IDE
                  </button>
                  <Link
                    to={`/videos?courseId=${course.id}&course=${course.slug}&language=${topicLanguage}&topic=${activeTopic.slug}`}
                    className="btn btn-secondary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch Topic Videos
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}


    </div>
  )
}

export default CourseDetailPage
