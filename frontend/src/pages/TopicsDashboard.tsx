import { useMemo } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, BookOpen, Code2, MousePointer2, Search, Sparkles, X } from 'lucide-react'
import { motion } from 'framer-motion'

import { CircularGallery, type GalleryItem } from '@/components/ui/circular-gallery'
import { Button } from '@/components/ui/button'
import { courseData } from '@/data/courseData'
import { createCourseTopicSlugMap } from '@/lib/course-topic-slugs'

type GalleryCourseItem = GalleryItem & {
  courseId: number
}

type TopicSearchResult = {
  courseAccent: string
  courseId: number
  courseLabel: string
  courseTitle: string
  href: string
  key: string
  lessonId: number
  lessonSummary: string
  lessonTitle: string
  relevance: number
  reasons: string[]
}

type CourseSearchResult = {
  accent: string
  description: string
  href: string
  image: string
  lessonCount: number
  relevance: number
  title: string
}

const visualMap: Record<string, { image: string; accent: string; label: string }> = {
  'html-tutorial': {
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    accent: '#f97316',
    label: 'Web foundations',
  },
  'css-tutorial': {
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    accent: '#38bdf8',
    label: 'Visual design',
  },
  'java-tutorial': {
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
    accent: '#b07219',
    label: 'Object-oriented foundations',
  },
  'python-tutorial': {
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80',
    accent: '#60a5fa',
    label: 'Problem solving',
  },
}

const defaultVisual = {
  image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
  accent: '#38bdf8',
  label: 'Learning path',
}

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getSearchTokens = (value: string) =>
  normalizeSearchText(value)
    .split(' ')
    .filter(Boolean)

const scoreSearchMatch = (query: string, tokens: string[], text: string) => {
  const normalizedText = normalizeSearchText(text)

  if (!query || !normalizedText) {
    return 0
  }

  if (normalizedText === query) {
    return 140
  }

  if (normalizedText.startsWith(query)) {
    return 110
  }

  if (normalizedText.includes(query)) {
    return 80
  }

  const matchedTokens = tokens.filter((token) => normalizedText.includes(token))
  if (!matchedTokens.length) {
    return 0
  }

  return matchedTokens.length * 18
}

const TopicsDashboard = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeIndex, setActiveIndex] = useState(0)
  const searchQuery = searchParams.get('search')?.trim() ?? ''
  const normalizedSearchQuery = useMemo(() => normalizeSearchText(searchQuery), [searchQuery])
  const searchTokens = useMemo(() => getSearchTokens(searchQuery), [searchQuery])

  const galleryItems = useMemo<GalleryCourseItem[]>(() => {
    return courseData.slice(0, 4).map((course) => {
      const visual = visualMap[course.slug] || defaultVisual

      return {
        courseId: course.id,
        common: course.title,
        binomial: `${course.lessons.length} lessons • ${course.difficulty.toLowerCase()} level • ${course.description}`,
        accent: visual.accent,
        photo: {
          url: visual.image,
          text: course.title,
          by: visual.label,
          pos: 'center',
        },
      }
    })
  }, [])

  const activeCourse = galleryItems[activeIndex] || galleryItems[0]

  const topicSearchResults = useMemo<TopicSearchResult[]>(() => {
    if (!normalizedSearchQuery) {
      return []
    }

    return courseData
      .flatMap((course) => {
        const visual = visualMap[course.slug] || defaultVisual
        const topicSlugMap = createCourseTopicSlugMap(course.lessons)

        return course.lessons
          .map((lesson) => {
            const titleScore = scoreSearchMatch(normalizedSearchQuery, searchTokens, lesson.title)
            const summaryScore = scoreSearchMatch(normalizedSearchQuery, searchTokens, lesson.summary)
            const contentScore = scoreSearchMatch(
              normalizedSearchQuery,
              searchTokens,
              lesson.content.slice(0, 900)
            )
            const courseScore = scoreSearchMatch(
              normalizedSearchQuery,
              searchTokens,
              `${course.title} ${course.description}`
            )
            const codeScore = scoreSearchMatch(
              normalizedSearchQuery,
              searchTokens,
              lesson.codeSample.slice(0, 400)
            )

            const relevance =
              titleScore * 5 +
              summaryScore * 3 +
              contentScore * 2 +
              courseScore * 2 +
              codeScore

            if (relevance <= 0) {
              return null
            }

            const reasons = [
              titleScore > 0 ? 'Topic title' : null,
              summaryScore > 0 ? 'Summary' : null,
              contentScore > 0 ? 'Lesson content' : null,
              courseScore > 0 ? course.title : null,
            ].filter(Boolean) as string[]

            return {
              courseAccent: visual.accent,
              courseId: course.id,
              courseLabel: visual.label,
              courseTitle: course.title,
              href: `/courses/${course.id}?topic=${topicSlugMap[lesson.id]}`,
              key: `${course.id}-${lesson.id}`,
              lessonId: lesson.id,
              lessonSummary: lesson.summary,
              lessonTitle: lesson.title,
              relevance,
              reasons,
            }
          })
          .filter((result): result is TopicSearchResult => result !== null)
      })
      .sort((left, right) => right.relevance - left.relevance || left.lessonTitle.localeCompare(right.lessonTitle))
      .slice(0, 16)
  }, [normalizedSearchQuery, searchTokens])

  const courseSearchResults = useMemo<CourseSearchResult[]>(() => {
    if (!normalizedSearchQuery) {
      return []
    }

    return courseData
      .map((course) => {
        const visual = visualMap[course.slug] || defaultVisual
        const titleScore = scoreSearchMatch(normalizedSearchQuery, searchTokens, course.title)
        const descriptionScore = scoreSearchMatch(
          normalizedSearchQuery,
          searchTokens,
          course.description
        )
        const lessonScore = course.lessons.reduce(
          (best, lesson) => Math.max(best, scoreSearchMatch(normalizedSearchQuery, searchTokens, lesson.title)),
          0
        )

        const relevance = titleScore * 5 + descriptionScore * 2 + lessonScore * 2
        if (relevance <= 0) {
          return null
        }

        return {
          accent: visual.accent,
          description: course.description,
          href: `/courses/${course.id}`,
          image: visual.image,
          lessonCount: course.lessons.length,
          relevance,
          title: course.title,
        }
      })
      .filter((result): result is CourseSearchResult => result !== null)
      .sort((left, right) => right.relevance - left.relevance || left.title.localeCompare(right.title))
      .slice(0, 6)
  }, [normalizedSearchQuery, searchTokens])

  const handleOpenCourse = (item: GalleryItem) => {
    const courseItem = item as GalleryCourseItem
    navigate(`/courses/${courseItem.courseId}`)
  }

  const clearSearch = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('search')
    setSearchParams(nextParams)
  }

  if (searchQuery) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_28%),linear-gradient(180deg,#0f172a_0%,#111827_40%,#0b1120_100%)] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 shadow-[0_25px_60px_-30px_rgba(14,165,233,0.75)] backdrop-blur-xl md:p-8"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">
                  <Search className="h-4 w-4" />
                  Topic search
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Results for &quot;{searchQuery}&quot;
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                  DevHub searched your courses and lesson topics, then ranked the closest matches so you can open the exact topic you meant.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  onClick={clearSearch}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear search
                </Button>
                <Button
                  className="rounded-full bg-sky-500 text-white hover:bg-sky-400"
                  onClick={() => navigate('/courses')}
                >
                  Browse all courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {topicSearchResults.length} topic match{topicSearchResults.length === 1 ? '' : 'es'}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                {courseSearchResults.length} related course{courseSearchResults.length === 1 ? '' : 's'}
              </span>
            </div>
          </motion.section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-5 shadow-[0_25px_60px_-30px_rgba(14,165,233,0.75)] backdrop-blur-xl md:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-200">
                    Matching topics
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Open the exact lesson you were trying to find.
                  </h2>
                </div>
              </div>

              {topicSearchResults.length ? (
                <div className="mt-6 grid gap-4">
                  {topicSearchResults.map((result) => (
                    <Link
                      key={result.key}
                      to={result.href}
                      className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition hover:border-sky-300/35 hover:bg-white/10"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                              style={{
                                backgroundColor: `${result.courseAccent}1f`,
                                color: result.courseAccent,
                              }}
                            >
                              {result.courseTitle}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                              {result.courseLabel}
                            </span>
                          </div>

                          <h3 className="mt-4 text-xl font-semibold text-white transition group-hover:text-sky-200">
                            {result.lessonTitle}
                          </h3>
                          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                            {result.lessonSummary}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {result.reasons.slice(0, 3).map((reason) => (
                              <span
                                key={`${result.key}-${reason}`}
                                className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300"
                              >
                                Match: {reason}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_35px_-24px_rgba(56,189,248,0.95)] transition group-hover:bg-sky-400">
                          Open topic
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-8 text-center">
                  <h3 className="text-xl font-semibold text-white">No direct topic match yet.</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Try a course name like Java, Python, CSS, or HTML, or search for a lesson title such as
                    &nbsp;Arrays, Loops, RegEx, or Flexbox.
                  </p>
                </div>
              )}
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="space-y-6"
            >
              <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-5 shadow-[0_25px_60px_-30px_rgba(14,165,233,0.75)] backdrop-blur-xl md:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-200">
                  Related courses
                </p>
                <div className="mt-5 space-y-4">
                  {courseSearchResults.length ? (
                    courseSearchResults.map((course) => (
                      <Link
                        key={course.href}
                        to={course.href}
                        className="group block overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/5 transition hover:border-sky-300/35 hover:bg-white/10"
                      >
                        <div className="h-28 overflow-hidden">
                          <img src={course.image} alt={course.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <div className="p-4">
                          <div
                            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
                            style={{
                              backgroundColor: `${course.accent}1f`,
                              color: course.accent,
                            }}
                          >
                            {course.lessonCount} lessons
                          </div>
                          <h3 className="mt-3 text-lg font-semibold text-white">{course.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{course.description}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-slate-300">
                      No course names matched that search yet, but you can still clear the query and browse all learning paths.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-5 shadow-[0_25px_60px_-30px_rgba(14,165,233,0.75)] backdrop-blur-xl md:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-200">
                  Search tips
                </p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                  <p>Search by course name, topic title, or a concept inside the summary.</p>
                  <p>Specific queries work best, like `Java RegEx`, `Python loops`, or `CSS flexbox`.</p>
                  <p>When you open a result, DevHub jumps into that course and highlights the matching topic.</p>
                </div>
              </section>
            </motion.aside>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_28%),linear-gradient(180deg,#0f172a_0%,#111827_40%,#0b1120_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl text-center"
        >
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-sky-100/85 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            DevHub Tutorials
          </div>
          <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl xl:text-5xl">
            Pick a rotating course path and jump straight into the real lesson page.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            The old placeholder panel is gone. This space now highlights your main learning tracks,
            and every card opens the expected DevHub course page when tapped. Use your mouse wheel or touchpad to rotate the gallery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/55 p-4 shadow-[0_25px_60px_-30px_rgba(14,165,233,0.75)] backdrop-blur-xl sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">
                <MousePointer2 className="h-4 w-4" />
                Scroll inside the gallery to rotate
              </div>
              <div className="text-sm text-slate-300">
                Active course: <span className="font-semibold text-white">{activeCourse?.common}</span>
              </div>
            </div>

            <div
              className="relative h-[360px] overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_60%)] sm:h-[440px] lg:h-[520px]"
            >
              <CircularGallery
                items={galleryItems}
                radius={420}
                autoRotateSpeed={0.015}
                className="h-full"
                onItemClick={handleOpenCourse}
                onActiveIndexChange={setActiveIndex}
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {galleryItems.map((item, index) => (
                <button
                  key={item.courseId}
                  type="button"
                  onClick={() => handleOpenCourse(item)}
                  className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                    index === activeIndex
                      ? 'border-sky-300/45 bg-sky-400/12 text-white shadow-[0_15px_35px_-24px_rgba(56,189,248,0.9)]'
                      : 'border-white/8 bg-slate-950/55 text-slate-300 hover:border-sky-400/25 hover:text-white'
                  }`}
                >
                  <p className="font-semibold">{item.common}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.photo.by}</p>
                </button>
              ))}
            </div>
          </div>

          {activeCourse && (
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/68 p-6 shadow-[0_25px_60px_-30px_rgba(14,165,233,0.75)] backdrop-blur-xl">
              <div
                className="mb-5 h-40 overflow-hidden rounded-[1.5rem]"
                style={{
                  boxShadow: `0 20px 50px -28px ${activeCourse.accent || '#38bdf8'}88`,
                }}
              >
                <img
                  src={activeCourse.photo.url}
                  alt={activeCourse.photo.text}
                  className="h-full w-full object-cover"
                />
              </div>

              <div
                className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
                style={{
                  color: activeCourse.accent || '#38bdf8',
                  backgroundColor: `${activeCourse.accent || '#38bdf8'}1c`,
                }}
              >
                Selected course
              </div>

              <h2 className="text-2xl font-bold text-white">{activeCourse.common}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{activeCourse.binomial}</p>

              <div className="mt-6 grid gap-3">
                {[
                  {
                    icon: <BookOpen className="h-4 w-4" />,
                    text: 'Rotate with your mouse wheel or touchpad until this course is centered.',
                  },
                  {
                    icon: <Code2 className="h-4 w-4" />,
                    text: 'Tap the active gallery card or use the button below to open the course page.',
                  },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3 rounded-2xl bg-white/5 p-3 text-sm text-slate-300">
                    <div className="mt-0.5 text-sky-300">{item.icon}</div>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>

              <Button
                className="mt-6 w-full rounded-full bg-sky-500 text-white hover:bg-sky-400"
                size="lg"
                onClick={() => handleOpenCourse(activeCourse)}
              >
                Open {activeCourse.common}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TopicsDashboard
