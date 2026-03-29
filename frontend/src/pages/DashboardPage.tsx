import { useEffect, useState } from "react"
import {
  Award,
  BookOpen,
  Code2,
  Compass,
  PlayCircle,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react"

import { OrbitalLoader } from "@/components/ui/orbital-loader"
import { courseData } from "@/data/courseData"
import {
  DevHubDashboardContent,
  type DashboardAction,
  type DashboardActivity,
  type DashboardStat,
  type DashboardTrack,
} from "@/components/ui/dashboard-with-collapsible-sidebar"
import { createCourseTopicSlugMap } from "@/lib/course-topic-slugs"
import {
  countStoredNotes,
  getSavedPracticeItemsCount,
  loadStoredCourseCompletedTopics,
  loadStoredCourseTopicNotes,
} from "@/lib/learning-progress"
import { certificatesApi, coursesApi, enrollmentsApi, progressApi } from "@/services/api"
import { useAuthStore } from "@/store"
import type { Certificate, Course, Enrollment, UserProgress } from "@/types"

type DashboardTone = "blue" | "emerald" | "violet" | "amber" | "rose"

interface ProgressStatsSnapshot {
  totalLessonsCompleted: number
  totalTimeSpent: number
  exercisesCompleted: number
  totalPoints: number
  quizzesPassed: number
  averageQuizScore: number
  certificatesEarned: number
}

const EMPTY_PROGRESS_STATS: ProgressStatsSnapshot = {
  totalLessonsCompleted: 0,
  totalTimeSpent: 0,
  exercisesCompleted: 0,
  totalPoints: 0,
  quizzesPassed: 0,
  averageQuizScore: 0,
  certificatesEarned: 0,
}

const buildFallbackCourses = (): Course[] =>
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

const formatShortDate = (value?: string) => {
  if (!value) {
    return "Recently"
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

const clampPercentage = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

const getCourseTone = (slug?: string, title?: string): DashboardTone => {
  const normalized = `${slug || ""} ${title || ""}`.toLowerCase()

  if (normalized.includes("python")) return "violet"
  if (normalized.includes("java")) return "amber"
  if (normalized.includes("css")) return "emerald"
  if (normalized.includes("html")) return "blue"

  return "rose"
}

const getPerformanceSignal = ({
  progress,
  notesCount,
  averageQuizScore,
  exercisesCompleted,
  isComplete,
}: {
  progress: number
  notesCount: number
  averageQuizScore: number
  exercisesCompleted: number
  isComplete: boolean
}) => {
  if (isComplete) {
    return {
      label: "Mastered",
      detail: averageQuizScore > 0 ? `${Math.round(averageQuizScore)}% quiz average` : "All tracked topics completed",
    }
  }

  if (averageQuizScore >= 80 || (progress >= 70 && exercisesCompleted >= 3)) {
    return {
      label: "High mastery",
      detail: averageQuizScore > 0 ? `${Math.round(averageQuizScore)}% quiz average` : "Strong hands-on practice",
    }
  }

  if (progress >= 35 || notesCount >= 2 || exercisesCompleted > 0) {
    return {
      label: "Building momentum",
      detail:
        notesCount > 0
          ? `${notesCount} topic note${notesCount === 1 ? "" : "s"} saved`
          : exercisesCompleted > 0
            ? `${exercisesCompleted} completed exercise${exercisesCompleted === 1 ? "" : "s"}`
            : "Steady learning rhythm",
    }
  }

  if (progress > 0) {
    return {
      label: "Early momentum",
      detail: "The path is started and ready to continue",
    }
  }

  return {
    label: "Ready to start",
    detail: "No tracked performance signal yet",
  }
}

const DashboardPage = () => {
  const { user } = useAuthStore()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [courseProgressByCourseId, setCourseProgressByCourseId] = useState<Record<number, UserProgress[]>>({})
  const [progressStats, setProgressStats] = useState<ProgressStatsSnapshot>(EMPTY_PROGRESS_STATS)
  const [savedPracticeCount, setSavedPracticeCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const [enrollmentsRes, certificatesRes, coursesRes, statsRes] = await Promise.allSettled([
          enrollmentsApi.getUserEnrollments(),
          certificatesApi.getAll(),
          coursesApi.getAll(),
          progressApi.getStats(),
        ])

        const nextEnrollments =
          enrollmentsRes.status === "fulfilled" ? enrollmentsRes.value.data : []
        const nextCertificates =
          certificatesRes.status === "fulfilled" ? certificatesRes.value.data : []
        const nextCourses =
          coursesRes.status === "fulfilled" && coursesRes.value.data.length > 0
            ? coursesRes.value.data
            : buildFallbackCourses()

        setEnrollments(nextEnrollments)
        setCertificates(nextCertificates)
        setCourses(nextCourses)
        setProgressStats(
          statsRes.status === "fulfilled"
            ? { ...EMPTY_PROGRESS_STATS, ...statsRes.value.data }
            : EMPTY_PROGRESS_STATS
        )
        setSavedPracticeCount(getSavedPracticeItemsCount(user?.id))

        const progressResponses = await Promise.allSettled(
          courseData.slice(0, 4).map((course) => progressApi.getCourseProgress(course.id))
        )

        const nextCourseProgress = courseData.slice(0, 4).reduce<Record<number, UserProgress[]>>(
          (acc, course, index) => {
            const response = progressResponses[index]
            acc[course.id] = response?.status === "fulfilled" ? response.value.data : []
            return acc
          },
          {}
        )

        setCourseProgressByCourseId(nextCourseProgress)
      } catch (error) {
        console.error("Failed to fetch dashboard data, using fallback:", error)
        setCourses(buildFallbackCourses())
        setProgressStats(EMPTY_PROGRESS_STATS)
        setCourseProgressByCourseId({})
        setSavedPracticeCount(getSavedPracticeItemsCount(user?.id))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] border border-sky-100 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_42%),linear-gradient(180deg,#f8fbff_0%,#ffffff_58%,#f2f8ff_100%)] px-6 py-16 shadow-[0_30px_70px_-50px_rgba(14,165,233,0.5)] dark:border-sky-900/40 dark:bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_58%,#111827_100%)]">
        <OrbitalLoader
          message="Loading your dashboard, progress signals, and active learning paths..."
          size="lg"
        />
      </div>
    )
  }

  const allCourses = courses.length > 0 ? courses : buildFallbackCourses()
  const courseMap = new Map(allCourses.map((course) => [course.id, course]))
  const activeEnrollments = enrollments.filter((enrollment) => enrollment.completionPercentage < 100)
  const completedEnrollments = enrollments.filter((enrollment) => enrollment.completionPercentage >= 100)

  const tracks: DashboardTrack[] = courseData.slice(0, 4).map((localCourse) => {
    const apiCourse = courseMap.get(localCourse.id)
    const enrollment = enrollments.find((item) => item.courseId === localCourse.id)
    const progressEntries = courseProgressByCourseId[localCourse.id] || []
    const lessonSlugMap = createCourseTopicSlugMap(localCourse.lessons)
    const completedTopics = new Set(
      loadStoredCourseCompletedTopics({
        courseId: localCourse.id,
        lessons: localCourse.lessons,
        userId: user?.id,
      })
    )
    const storedNotes = loadStoredCourseTopicNotes({
      courseId: localCourse.id,
      lessons: localCourse.lessons,
      userId: user?.id,
    })
    const completedLessonIds = new Set(
      progressEntries
        .filter((entry) => entry.status === "COMPLETED" || entry.completionPercentage >= 100)
        .map((entry) => entry.lessonId)
        .filter((lessonId): lessonId is number => typeof lessonId === "number")
    )

    localCourse.lessons.forEach((lesson) => {
      if (completedLessonIds.has(lesson.id)) {
        completedTopics.add(
          lessonSlugMap[lesson.id] || lesson.title.toLowerCase().replace(/\s+/g, "-")
        )
      }
    })

    const totalTopics = localCourse.lessons.length || apiCourse?.lessonsCount || 0
    const approximateCompletedCount =
      totalTopics > 0 && enrollment
        ? Math.round((enrollment.completionPercentage / 100) * totalTopics)
        : 0
    const completedCount = Math.min(
      totalTopics,
      Math.max(completedTopics.size, completedLessonIds.size, approximateCompletedCount)
    )
    const progress = totalTopics > 0 ? clampPercentage((completedCount / totalTopics) * 100) : 0
    const nextLesson = localCourse.lessons.find((lesson) => {
      const lessonSlug = lessonSlugMap[lesson.id] || lesson.title.toLowerCase().replace(/\s+/g, "-")
      return !completedTopics.has(lessonSlug) && !completedLessonIds.has(lesson.id)
    })
    const performance = getPerformanceSignal({
      progress,
      notesCount: countStoredNotes(storedNotes),
      averageQuizScore: progressStats.averageQuizScore,
      exercisesCompleted: progressStats.exercisesCompleted,
      isComplete: totalTopics > 0 && completedCount >= totalTopics,
    })
    const href = nextLesson
      ? `/courses/${localCourse.id}?topic=${lessonSlugMap[nextLesson.id] || nextLesson.title.toLowerCase().replace(/\s+/g, "-")}`
      : `/courses/${localCourse.id}`

    return {
      title: apiCourse?.title || localCourse.title,
      description:
        apiCourse?.description ||
        localCourse.description ||
        "Continue where you left off and keep building your skill path.",
      progress,
      href,
      meta: `${totalTopics} topics · ${localCourse.difficulty.toLowerCase()}`,
      completedLabel: `${completedCount}/${totalTopics} topics covered`,
      nextStep: nextLesson
        ? `Next topic: ${nextLesson.title}`
        : "All tracked topics in this path are covered",
      performanceLabel: performance.label,
      performanceDetail: performance.detail,
      cta: progress >= 100 ? "Review path" : progress > 0 ? "Resume path" : "Start path",
      tone: getCourseTone(apiCourse?.slug || localCourse.slug, apiCourse?.title || localCourse.title),
    }
  })

  const trackedPaths = tracks.filter((track) => track.progress > 0)
  const activePathCount = tracks.filter((track) => track.progress > 0 && track.progress < 100).length
  const averageProgress = trackedPaths.length
    ? Math.round(trackedPaths.reduce((total, track) => total + track.progress, 0) / trackedPaths.length)
    : 0
  const totalTopicsCovered = tracks.reduce((total, track) => {
    const completedCount = Number.parseInt(track.completedLabel?.split("/")[0] || "0", 10)
    return total + (Number.isFinite(completedCount) ? completedCount : 0)
  }, 0)
  const totalXP =
    totalTopicsCovered * 18 +
    progressStats.totalPoints +
    progressStats.quizzesPassed * 35 +
    certificates.length * 120
  const practiceSessions = savedPracticeCount + progressStats.exercisesCompleted
  const primaryActiveCourseHref =
    trackedPaths[0]?.href ||
    (activeEnrollments[0] ? `/courses/${activeEnrollments[0].courseId}` : "/courses")

  const stats: DashboardStat[] = [
    {
      title: "Learning XP",
      value: `${totalXP}`,
      helper:
        totalTopicsCovered > 0
          ? `${totalTopicsCovered} core topics covered, ${progressStats.exercisesCompleted} completed exercise${progressStats.exercisesCompleted === 1 ? "" : "s"}, and ${progressStats.quizzesPassed} quiz pass${progressStats.quizzesPassed === 1 ? "" : "es"}.`
          : "Start a course to begin earning XP and build your DevHub momentum.",
      href: primaryActiveCourseHref,
      cta: totalTopicsCovered > 0 ? "Keep earning XP" : "Start earning",
      badgeLabel: totalTopicsCovered > 0 ? "Growing" : "Starter",
      icon: TrendingUp,
      tone: "blue",
    },
    {
      title: "Active Paths",
      value: `${Math.max(activePathCount, activeEnrollments.length)}`,
      helper:
        Math.max(activePathCount, activeEnrollments.length) > 0
          ? `${Math.max(activePathCount, activeEnrollments.length)} learning path${Math.max(activePathCount, activeEnrollments.length) === 1 ? "" : "s"} are active and ready for the next topic.`
          : "No active courses yet. Browse a path and start learning.",
      href: primaryActiveCourseHref,
      cta: Math.max(activePathCount, activeEnrollments.length) > 0 ? "Continue paths" : "Browse courses",
      badgeLabel: Math.max(activePathCount, activeEnrollments.length) > 0 ? "In Progress" : "Ready",
      icon: BookOpen,
      tone: "emerald",
    },
    {
      title: "Certificates",
      value: `${certificates.length}`,
      helper:
        certificates.length > 0
          ? "Keep building your verified achievements and showcase them on your profile."
          : "Complete a course to unlock your first DevHub certificate.",
      href: "/profile?tab=certificates",
      cta: certificates.length > 0 ? "View certificates" : "See goal",
      badgeLabel: certificates.length > 0 ? "Earned" : "Locked",
      icon: Award,
      tone: "violet",
    },
    {
      title: "Practice Sessions",
      value: `${practiceSessions}`,
      helper:
        practiceSessions > 0
          ? `Built from ${savedPracticeCount} saved editor draft${savedPracticeCount === 1 ? "" : "s"} and ${progressStats.exercisesCompleted} completed exercise${progressStats.exercisesCompleted === 1 ? "" : "s"}.`
          : "Open the editor to start practicing and build hands-on confidence.",
      href: "/editor",
      cta: practiceSessions > 0 ? "Practice now" : "Open editor",
      badgeLabel: practiceSessions > 0 ? "Hands-On" : "Ready",
      icon: Code2,
      tone: "amber",
    },
  ]

  const enrollmentActivities: DashboardActivity[] = [...enrollments]
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 3)
    .map((enrollment) => {
      const course = courseMap.get(enrollment.courseId) || courseData.find((item) => item.id === enrollment.courseId)
      const courseTitle = course?.title || "Course"
      const isCompleted = enrollment.completionPercentage >= 100

      return {
        title: isCompleted ? `Completed ${courseTitle}` : `Progress updated in ${courseTitle}`,
        description: isCompleted
          ? "This learning path is complete and ready for review."
          : `${enrollment.completionPercentage}% complete so far`,
        time: formatShortDate(enrollment.completedAt || enrollment.enrolledAt),
        icon: isCompleted ? Award : PlayCircle,
        tone: isCompleted ? "emerald" : "blue",
        href: `/courses/${enrollment.courseId}`,
      }
    })

  const certificateActivities: DashboardActivity[] = [...certificates]
    .sort((a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime())
    .slice(0, 2)
    .map((certificate) => ({
      title: "Certificate earned",
      description: certificate.courseName,
      time: formatShortDate(certificate.issuedDate),
      icon: Award,
      tone: "amber",
      href: "/profile?tab=certificates",
    }))

  const localProgressActivities: DashboardActivity[] = tracks
    .filter((track) => track.progress > 0)
    .slice(0, 3)
    .map((track) => ({
      title: `Progress saved in ${track.title}`,
      description: track.nextStep || track.completedLabel || "Your next topic is ready.",
      time: `${track.progress}%`,
      icon: track.progress >= 100 ? Award : PlayCircle,
      tone: track.progress >= 100 ? "emerald" : "blue",
      href: track.href,
    }))

  const activities: DashboardActivity[] =
    [...certificateActivities, ...enrollmentActivities].slice(0, 5).length > 0
      ? [...certificateActivities, ...enrollmentActivities].slice(0, 5)
      : localProgressActivities.length > 0
        ? localProgressActivities
        : [
            {
              title: "Explore your first learning path",
              description: "Pick a course and your progress feed will start updating here.",
              time: "Now",
              icon: Compass,
              tone: "blue",
              href: "/courses",
            },
            {
              title: "Practice with the built-in editor",
              description: "Run examples and test your ideas without leaving DevHub.",
              time: "Today",
              icon: Code2,
              tone: "violet",
              href: "/editor",
            },
          ]

  const actions: DashboardAction[] = [
    {
      title: "Explore Tutorials",
      description: "Jump into topic-by-topic lessons, examples, and references.",
      href: "/topics",
      cta: "Open tutorials",
      icon: Compass,
    },
    {
      title: "Browse Courses",
      description: "Choose a course and continue your structured learning path.",
      href: "/courses",
      cta: "View courses",
      icon: BookOpen,
    },
    {
      title: "Practice in Editor",
      description: "Write code, test examples, and build confidence with hands-on work.",
      href: "/editor",
      cta: "Launch editor",
      icon: Code2,
    },
    {
      title: "Update Profile",
      description: "Keep your DevHub learner profile and public page up to date.",
      href: "/profile",
      cta: "Open profile",
      icon: User,
    },
  ]

  const notificationCount = activePathCount + Math.min(certificates.length, 3)
  const learnerName = user?.firstName || user?.username || "Learner"
  const subtitle =
    trackedPaths.length > 0
      ? `You have covered ${totalTopicsCovered} topics across ${trackedPaths.length} core path${trackedPaths.length === 1 ? "" : "s"}, and your current learning average sits at ${averageProgress}%${progressStats.averageQuizScore > 0 ? ` with a ${Math.round(progressStats.averageQuizScore)}% quiz average.` : "."}`
      : completedEnrollments.length > 0
        ? `You have completed ${completedEnrollments.length} course${completedEnrollments.length === 1 ? "" : "s"} already. Keep the momentum going with your next lesson, practice session, or course.`
        : "Track your tutorials, course progress, coding practice, and profile growth from one place."

  return (
    <DevHubDashboardContent
      userName={learnerName}
      subtitle={subtitle}
      stats={stats}
      activities={activities}
      tracks={tracks}
      actions={actions}
      notificationCount={notificationCount}
    />
  )
}

export default DashboardPage
