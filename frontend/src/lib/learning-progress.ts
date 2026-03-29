import { createCourseTopicSlugMap } from '@/lib/course-topic-slugs'

interface CourseProgressLesson {
  id: number
  title: string
}

interface CourseProgressCourse {
  id: number
  lessons: CourseProgressLesson[]
}

export interface SavedCodeSnippet {
  id: string
  name: string
  language: string
  code: string
  createdAt: number
}

const LEGACY_COURSE_COMPLETION_KEY = 'course_topics_completed'
const LEGACY_COURSE_NOTES_KEY = 'course_topic_notes'
const LEGACY_LESSON_COMPLETION_KEY = 'lesson_completed_topics'
const LEGACY_LESSON_NOTES_KEY = 'lesson_topic_notes'
const SAVED_CODE_SNIPPETS_KEY = 'saved-code-snippets'

const normalizeSlug = (value: string) => value.trim().toLowerCase()
const normalizeTitle = (value: string) => value.trim().toLowerCase()

const safeParseJson = <T>(rawValue: string | null, fallback: T): T => {
  if (!rawValue) {
    return fallback
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

const getUserScope = (userId?: number | null) => (userId ? `user-${userId}` : 'guest')

const getCourseCompletedKey = (courseId: number, userId?: number | null) =>
  `devhub:${getUserScope(userId)}:course:${courseId}:completed-topics`

const getCourseNotesKey = (courseId: number, userId?: number | null) =>
  `devhub:${getUserScope(userId)}:course:${courseId}:topic-notes`

const getSavedCodeSnippetsKey = (userId?: number | null) =>
  `devhub:${getUserScope(userId)}:saved-code-snippets`

const isSavedCodeSnippet = (value: unknown): value is SavedCodeSnippet => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<SavedCodeSnippet>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.language === 'string' &&
    typeof candidate.code === 'string' &&
    typeof candidate.createdAt === 'number'
  )
}

const mergeSavedCodeSnippets = (...snippetGroups: SavedCodeSnippet[][]) => {
  const snippetMap = new Map<string, SavedCodeSnippet>()

  snippetGroups.flat().forEach((snippet) => {
    const dedupeKey = `${snippet.id}:${snippet.language}:${snippet.createdAt}`
    const existingSnippet = snippetMap.get(dedupeKey)

    if (!existingSnippet || snippet.createdAt > existingSnippet.createdAt) {
      snippetMap.set(dedupeKey, snippet)
    }
  })

  return Array.from(snippetMap.values()).sort((left, right) => right.createdAt - left.createdAt)
}

const buildLessonMaps = (lessons: CourseProgressLesson[]) => {
  const slugMap = createCourseTopicSlugMap(lessons)
  const validSlugs = new Set(Object.values(slugMap).map(normalizeSlug))
  const titleToSlug = new Map(
    lessons.map((lesson) => [
      normalizeTitle(lesson.title),
      slugMap[lesson.id] || normalizeSlug(lesson.title),
    ])
  )

  return { slugMap, validSlugs, titleToSlug }
}

const resolveCourseTopicSlug = (
  candidate: string,
  validSlugs: Set<string>,
  titleToSlug: Map<string, string>
) => {
  const normalizedCandidate = normalizeSlug(candidate)
  if (validSlugs.has(normalizedCandidate)) {
    return normalizedCandidate
  }

  return titleToSlug.get(normalizeTitle(candidate)) || null
}

interface StoredCourseProgressOptions {
  courseId: number
  lessons: CourseProgressLesson[]
  userId?: number | null
}

export const loadStoredCourseCompletedTopics = ({
  courseId,
  lessons,
  userId,
}: StoredCourseProgressOptions) => {
  if (typeof window === 'undefined' || lessons.length === 0) {
    return [] as string[]
  }

  const { validSlugs, titleToSlug } = buildLessonMaps(lessons)
  const storedCourseTopics = safeParseJson<string[]>(
    window.localStorage.getItem(getCourseCompletedKey(courseId, userId)),
    []
  )
  const candidateTopics = userId
    ? storedCourseTopics
    : [
        ...storedCourseTopics,
        ...safeParseJson<string[]>(
          window.localStorage.getItem(LEGACY_COURSE_COMPLETION_KEY),
          []
        ),
        ...safeParseJson<string[]>(
          window.localStorage.getItem(LEGACY_LESSON_COMPLETION_KEY),
          []
        ),
      ]

  const mergedTopics = new Set<string>()

  candidateTopics.forEach((topic) => {
    const resolvedTopic = resolveCourseTopicSlug(topic, validSlugs, titleToSlug)
    if (resolvedTopic) {
      mergedTopics.add(resolvedTopic)
    }
  })

  return Array.from(mergedTopics)
}

export const saveStoredCourseCompletedTopics = ({
  courseId,
  lessons,
  topicSlugs,
  userId,
}: StoredCourseProgressOptions & { topicSlugs: string[] }) => {
  if (typeof window === 'undefined' || lessons.length === 0) {
    return
  }

  const { validSlugs, titleToSlug } = buildLessonMaps(lessons)
  const cleanTopics = Array.from(
    new Set(
      topicSlugs
        .map((topic) => resolveCourseTopicSlug(topic, validSlugs, titleToSlug))
        .filter((topic): topic is string => Boolean(topic))
    )
  )

  window.localStorage.setItem(
    getCourseCompletedKey(courseId, userId),
    JSON.stringify(cleanTopics)
  )
}

export const loadStoredCourseTopicNotes = ({
  courseId,
  lessons,
  userId,
}: StoredCourseProgressOptions) => {
  if (typeof window === 'undefined' || lessons.length === 0) {
    return {} as Record<string, string>
  }

  const { validSlugs, titleToSlug } = buildLessonMaps(lessons)
  const storedCourseNotes = safeParseJson<Record<string, string>>(
    window.localStorage.getItem(getCourseNotesKey(courseId, userId)),
    {}
  )
  const candidateNoteMaps = userId
    ? [storedCourseNotes]
    : [
        storedCourseNotes,
        safeParseJson<Record<string, string>>(
          window.localStorage.getItem(LEGACY_COURSE_NOTES_KEY),
          {}
        ),
        safeParseJson<Record<string, string>>(
          window.localStorage.getItem(LEGACY_LESSON_NOTES_KEY),
          {}
        ),
      ]

  const mergedNotes: Record<string, string> = {}

  candidateNoteMaps.forEach((noteMap) => {
    Object.entries(noteMap).forEach(([candidateKey, noteValue]) => {
      if (!noteValue?.trim()) {
        return
      }

      const resolvedTopic = resolveCourseTopicSlug(candidateKey, validSlugs, titleToSlug)
      if (resolvedTopic) {
        mergedNotes[resolvedTopic] = noteValue.trim()
      }
    })
  })

  return mergedNotes
}

export const saveStoredCourseTopicNotes = ({
  courseId,
  lessons,
  notes,
  userId,
}: StoredCourseProgressOptions & { notes: Record<string, string> }) => {
  if (typeof window === 'undefined' || lessons.length === 0) {
    return
  }

  const { validSlugs, titleToSlug } = buildLessonMaps(lessons)
  const cleanNotes = Object.entries(notes).reduce<Record<string, string>>((acc, [topicKey, noteValue]) => {
    const resolvedTopic = resolveCourseTopicSlug(topicKey, validSlugs, titleToSlug)
    if (resolvedTopic && noteValue.trim()) {
      acc[resolvedTopic] = noteValue.trim()
    }
    return acc
  }, {})

  window.localStorage.setItem(
    getCourseNotesKey(courseId, userId),
    JSON.stringify(cleanNotes)
  )
}

export const getSavedPracticeItemsCount = (userId?: number | null) => {
  if (typeof window === 'undefined') {
    return 0
  }

  return loadSavedCodeSnippets(userId).length
}

export const loadSavedCodeSnippets = (userId?: number | null) => {
  if (typeof window === 'undefined') {
    return [] as SavedCodeSnippet[]
  }

  const scopedSnippets = safeParseJson<unknown[]>(
    window.localStorage.getItem(getSavedCodeSnippetsKey(userId)),
    []
  ).filter(isSavedCodeSnippet)

  if (userId) {
    return mergeSavedCodeSnippets(scopedSnippets)
  }

  const legacySnippets = safeParseJson<unknown[]>(
    window.localStorage.getItem(SAVED_CODE_SNIPPETS_KEY),
    []
  ).filter(isSavedCodeSnippet)

  return mergeSavedCodeSnippets(scopedSnippets, legacySnippets)
}

export const saveSavedCodeSnippets = (
  snippets: SavedCodeSnippet[],
  userId?: number | null
) => {
  if (typeof window === 'undefined') {
    return
  }

  const cleanSnippets = snippets.filter(isSavedCodeSnippet)
  window.localStorage.setItem(
    getSavedCodeSnippetsKey(userId),
    JSON.stringify(cleanSnippets)
  )
}

export const migrateGuestLearningStateToUser = ({
  userId,
  courses,
}: {
  userId?: number | null
  courses: CourseProgressCourse[]
}) => {
  if (typeof window === 'undefined' || !userId) {
    return
  }

  courses.forEach((course) => {
    if (!course.lessons.length) {
      return
    }

    const guestCompletedTopics = loadStoredCourseCompletedTopics({
      courseId: course.id,
      lessons: course.lessons,
    })
    const userCompletedTopics = loadStoredCourseCompletedTopics({
      courseId: course.id,
      lessons: course.lessons,
      userId,
    })

    if (guestCompletedTopics.length > 0) {
      saveStoredCourseCompletedTopics({
        courseId: course.id,
        lessons: course.lessons,
        topicSlugs: Array.from(new Set([...userCompletedTopics, ...guestCompletedTopics])),
        userId,
      })
    }

    const guestNotes = loadStoredCourseTopicNotes({
      courseId: course.id,
      lessons: course.lessons,
    })
    const userNotes = loadStoredCourseTopicNotes({
      courseId: course.id,
      lessons: course.lessons,
      userId,
    })

    if (Object.keys(guestNotes).length > 0) {
      saveStoredCourseTopicNotes({
        courseId: course.id,
        lessons: course.lessons,
        notes: { ...guestNotes, ...userNotes },
        userId,
      })
    }
  })

  const guestSnippets = loadSavedCodeSnippets()
  if (guestSnippets.length > 0) {
    const userSnippets = loadSavedCodeSnippets(userId)
    saveSavedCodeSnippets(
      mergeSavedCodeSnippets(userSnippets, guestSnippets),
      userId
    )
  }
}

export const countStoredNotes = (notes: Record<string, string>) =>
  Object.values(notes).filter((note) => note.trim().length > 0).length
