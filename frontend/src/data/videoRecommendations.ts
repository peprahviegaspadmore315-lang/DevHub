import { courseData, type CourseData, type Lesson } from "@/data/courseData"
import { createCourseTopicSlugMap } from "@/lib/course-topic-slugs"

export interface FeaturedVideoRecommendation {
  courseId: number
  courseSlug: string
  language: string
  provider: string
  title: string
  description: string
  videoId: string
  youtubeUrl: string
  embedUrl: string
  thumbnailUrl: string
  sourceUrl: string
  sourceLabel: string
  recommendedFor: string[]
}

export interface TopicVideoRecommendation {
  lessonId: number
  title: string
  slug: string
  description: string
  searchQuery: string
  youtubeSearchUrl: string
  courseUrl: string
}

const youtubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`
const youtubeEmbedUrl = (videoId: string) => `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
const youtubeThumbnailUrl = (videoId: string) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

export const createYouTubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`

const featuredVideoMap: Record<
  string,
  Omit<FeaturedVideoRecommendation, "courseId" | "courseSlug">
> = {
  "html-tutorial": {
    language: "html",
    provider: "freeCodeCamp",
    title: "HTML Full Course - Build a Website Tutorial",
    description:
      "A thorough beginner-friendly HTML walkthrough that pairs well with DevHub’s HTML path when you want a longer guided video session.",
    videoId: "pQN-pnXPaVg",
    youtubeUrl: youtubeWatchUrl("pQN-pnXPaVg"),
    embedUrl: youtubeEmbedUrl("pQN-pnXPaVg"),
    thumbnailUrl: youtubeThumbnailUrl("pQN-pnXPaVg"),
    sourceUrl: "https://www.classcentral.com/course/youtube-html-full-course-build-a-website-tutorial-57866",
    sourceLabel: "Class Central listing for the freeCodeCamp HTML course",
    recommendedFor: ["HTML structure", "basic tags", "forms", "links", "page layout"],
  },
  "css-tutorial": {
    language: "css",
    provider: "Dave Gray via freeCodeCamp",
    title: "CSS Full Course for Beginners - Complete All-in-One Tutorial",
    description:
      "A polished beginner-to-intermediate CSS video that fits DevHub’s styling lessons and gives learners a strong responsive-design reference.",
    videoId: "OXGznpKZ_sA",
    youtubeUrl: youtubeWatchUrl("OXGznpKZ_sA"),
    embedUrl: youtubeEmbedUrl("OXGznpKZ_sA"),
    thumbnailUrl: youtubeThumbnailUrl("OXGznpKZ_sA"),
    sourceUrl: "https://www.classcentral.com/course/youtube-css-full-course-for-beginners-complete-all-in-one-tutorial-112386",
    sourceLabel: "Class Central listing for the Dave Gray CSS course",
    recommendedFor: ["selectors", "layout", "flexbox", "grid", "responsive UI"],
  },
  "java-tutorial": {
    language: "java",
    provider: "Programming with Mosh",
    title: "Java Tutorial for Beginners",
    description:
      "A practical Java beginner video that lines up with DevHub’s Java syntax, classes, OOP, exceptions, and file-handling lessons.",
    videoId: "eIrMbAQSU34",
    youtubeUrl: youtubeWatchUrl("eIrMbAQSU34"),
    embedUrl: youtubeEmbedUrl("eIrMbAQSU34"),
    thumbnailUrl: youtubeThumbnailUrl("eIrMbAQSU34"),
    sourceUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
    sourceLabel: "Programming with Mosh Java beginner tutorial",
    recommendedFor: ["syntax", "methods", "classes", "exceptions", "collections"],
  },
  "python-tutorial": {
    language: "python",
    provider: "freeCodeCamp",
    title: "Learn Python - Full Course for Beginners Tutorial",
    description:
      "A practical Python starter video that lines up with DevHub’s Python tutorial flow and gives learners a long-form coding companion.",
    videoId: "rfscVS0vtbw",
    youtubeUrl: youtubeWatchUrl("rfscVS0vtbw"),
    embedUrl: youtubeEmbedUrl("rfscVS0vtbw"),
    thumbnailUrl: youtubeThumbnailUrl("rfscVS0vtbw"),
    sourceUrl: "https://www.classcentral.com/course/youtube-learn-python-full-course-for-beginners-tutorial-57873",
    sourceLabel: "Class Central listing for the freeCodeCamp Python course",
    recommendedFor: ["syntax", "functions", "lists", "control flow", "modules"],
  },
}

const buildFallbackRecommendation = (course: CourseData): FeaturedVideoRecommendation => {
  const query = `${course.title} full course beginners`
  return {
    courseId: course.id,
    courseSlug: course.slug,
    language: course.slug,
    provider: "YouTube search",
    title: `${course.title} recommended watch`,
    description:
      "This course does not have a custom featured video yet, so DevHub opens a YouTube results page tuned to the course title.",
    videoId: "dQw4w9WgXcQ",
    youtubeUrl: createYouTubeSearchUrl(query),
    embedUrl: youtubeEmbedUrl("dQw4w9WgXcQ"),
    thumbnailUrl: course.image,
    sourceUrl: createYouTubeSearchUrl(query),
    sourceLabel: "YouTube search results",
    recommendedFor: [course.title, course.category, "beginner lessons"],
  }
}

export const featuredCourseVideos: FeaturedVideoRecommendation[] = courseData.map((course) => {
  const featured = featuredVideoMap[course.slug]
  if (!featured) {
    return buildFallbackRecommendation(course)
  }

  return {
    courseId: course.id,
    courseSlug: course.slug,
    ...featured,
  }
})

export const getFeaturedCourseVideo = (course: CourseData) =>
  featuredCourseVideos.find((item) => item.courseId === course.id) || buildFallbackRecommendation(course)

export const getTopicVideoRecommendations = (
  course: CourseData,
  lessons: Lesson[] = course.lessons
): TopicVideoRecommendation[] => {
  const topicSlugs = createCourseTopicSlugMap(lessons)

  return lessons.map((lesson) => {
    const searchQuery = `${course.title} ${lesson.title} tutorial`
    const slug = topicSlugs[lesson.id] || lesson.title.toLowerCase().replace(/\s+/g, "-")

    return {
      lessonId: lesson.id,
      title: lesson.title,
      slug,
      description: lesson.summary,
      searchQuery,
      youtubeSearchUrl: createYouTubeSearchUrl(searchQuery),
      courseUrl: `/courses/${course.id}?topic=${slug}`,
    }
  })
}

export const findCourseForVideoRoute = ({
  courseId,
  courseSlug,
  language,
}: {
  courseId?: number
  courseSlug?: string | null
  language?: string | null
}) => {
  if (courseId) {
    const byId = courseData.find((course) => course.id === courseId)
    if (byId) {
      return byId
    }
  }

  if (courseSlug) {
    const normalizedSlug = courseSlug.trim().toLowerCase()
    const bySlug = courseData.find((course) => course.slug === normalizedSlug)
    if (bySlug) {
      return bySlug
    }
  }

  if (language) {
    const normalizedLanguage = language.trim().toLowerCase() === "javascript"
      ? "java"
      : language.trim().toLowerCase()
    const byLanguage = courseData.find((course) => course.slug.includes(normalizedLanguage))
    if (byLanguage) {
      return byLanguage
    }
  }

  return courseData[0]
}
