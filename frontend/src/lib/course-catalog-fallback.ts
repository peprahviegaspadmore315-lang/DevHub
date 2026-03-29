import { courseData, type CourseData } from '@/data/courseData'
import type { Course, PlatformSummary } from '@/types'

const matchesCourseTitle = (left?: string, right?: string) =>
  (left || '').trim().toLowerCase() === (right || '').trim().toLowerCase()

export const buildFallbackCourses = (): Course[] =>
  courseData.map((course, index) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    category: course.category,
    difficulty: course.difficulty,
    iconUrl: course.image,
    bannerUrl: course.image,
    isPremium: false,
    price: 0,
    estimatedHours: Math.max(1, Math.round(course.lessons.length * 0.25 * 10) / 10),
    orderIndex: index + 1,
    isPublished: true,
    isFeatured: index < 3,
    lessonsCount: course.lessons.length,
    exercisesCount: course.lessons.length,
    quizzesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))

export const buildFallbackPlatformSummary = (): PlatformSummary => {
  const fallbackCourses = buildFallbackCourses()

  return {
    courses: fallbackCourses.length,
    tutorials: fallbackCourses.reduce((total, course) => total + (course.lessonsCount || 0), 0),
    exercises: fallbackCourses.reduce((total, course) => total + (course.exercisesCount || 0), 0),
    users: 0,
  }
}

export const findLocalCourseData = ({
  id,
  slug,
  title,
}: {
  id?: number
  slug?: string
  title?: string
}): CourseData | undefined =>
  courseData.find((course) => {
    if (typeof id === 'number' && course.id === id) {
      return true
    }

    if (slug && course.slug === slug) {
      return true
    }

    return matchesCourseTitle(course.title, title)
  })

export const inferCourseLanguage = ({
  id,
  slug,
  title,
}: {
  id?: number
  slug?: string
  title?: string
}) => {
  const normalized = `${slug || ''} ${title || ''}`.toLowerCase()

  if (normalized.includes('html')) return 'html'
  if (normalized.includes('css')) return 'css'
  if (normalized.includes('java')) return 'java'
  if (normalized.includes('python')) return 'python'

  if (id === 1) return 'html'
  if (id === 2) return 'css'
  if (id === 3) return 'java'
  if (id === 4) return 'python'

  return 'html'
}
