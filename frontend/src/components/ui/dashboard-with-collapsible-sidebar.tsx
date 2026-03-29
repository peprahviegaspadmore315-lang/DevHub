"use client"

import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronsRight,
  Code2,
  Compass,
  HelpCircle,
  Home,
  LayoutDashboard,
  MessageSquare,
  Monitor,
  Moon,
  PlayCircle,
  Newspaper,
  ShoppingCart,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  User,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { courseData } from "@/data/courseData"
import { createCourseTopicSlugMap } from "@/lib/course-topic-slugs"
import { cn } from "@/lib/utils"
import { applyThemePreference, isDarkThemeEnabled } from "@/lib/theme"
import { useAuthStore, useSidebarStore } from "@/store"
import DevHubBrandMark from "@/components/ui/devhub-brand-mark"
import DevHubWordmark from "@/components/ui/devhub-wordmark"
import { NotificationsMenu } from "@/components/ui/notifications-menu"

type Tone = "blue" | "emerald" | "violet" | "amber" | "rose"

export interface DashboardStat {
  title: string
  value: string
  helper: string
  href: string
  cta: string
  badgeLabel: string
  icon: LucideIcon
  tone: Tone
}

export interface DashboardActivity {
  title: string
  description: string
  time: string
  icon: LucideIcon
  tone: Tone
  href?: string
}

export interface DashboardTrack {
  title: string
  description: string
  progress: number
  href: string
  meta: string
  completedLabel?: string
  nextStep?: string
  performanceLabel?: string
  performanceDetail?: string
  cta?: string
  tone?: Tone
}

export interface DashboardAction {
  title: string
  description: string
  href: string
  cta: string
  icon: LucideIcon
}

interface DevHubDashboardContentProps {
  userName: string
  subtitle: string
  stats: DashboardStat[]
  activities: DashboardActivity[]
  tracks: DashboardTrack[]
  actions: DashboardAction[]
  notificationCount?: number
}

interface SidebarOptionProps {
  icon: LucideIcon
  title: string
  to: string
  isSelected: boolean
  open: boolean
  notifs?: number
}

const toneClasses: Record<
  Tone,
  {
    badge: string
    iconWrap: string
    iconColor: string
    progress: string
    surface: string
  }
> = {
  blue: {
    badge: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    iconWrap: "bg-sky-50 dark:bg-sky-950/40",
    iconColor: "text-sky-600 dark:text-sky-300",
    progress: "bg-sky-500",
    surface:
      "border-sky-200/80 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f0f9ff_100%)] dark:border-sky-900/60 dark:bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,#0f172a_0%,#082f49_100%)]",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    iconWrap: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-300",
    progress: "bg-emerald-500",
    surface:
      "border-emerald-200/80 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_34%),linear-gradient(180deg,#ffffff_0%,#ecfdf5_100%)] dark:border-emerald-900/60 dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_28%),linear-gradient(180deg,#0f172a_0%,#052e2b_100%)]",
  },
  violet: {
    badge: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    iconWrap: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-300",
    progress: "bg-violet-500",
    surface:
      "border-violet-200/80 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f5f3ff_100%)] dark:border-violet-900/60 dark:bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_28%),linear-gradient(180deg,#0f172a_0%,#2e1065_100%)]",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    iconWrap: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-300",
    progress: "bg-amber-500",
    surface:
      "border-amber-200/80 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_34%),linear-gradient(180deg,#ffffff_0%,#fffbeb_100%)] dark:border-amber-900/60 dark:bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_28%),linear-gradient(180deg,#0f172a_0%,#451a03_100%)]",
  },
  rose: {
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    iconWrap: "bg-rose-50 dark:bg-rose-950/40",
    iconColor: "text-rose-600 dark:text-rose-300",
    progress: "bg-rose-500",
    surface:
      "border-rose-200/80 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.14),transparent_34%),linear-gradient(180deg,#ffffff_0%,#fff1f2_100%)] dark:border-rose-900/60 dark:bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.14),transparent_28%),linear-gradient(180deg,#0f172a_0%,#4c0519_100%)]",
  },
}

const slugifyTopic = (value: string) => value.toLowerCase().replace(/\s+/g, "-")

const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

const matchesRoute = (pathname: string, route: string) => {
  if (route === "/") {
    return pathname === "/"
  }

  return pathname === route || pathname.startsWith(`${route}/`)
}

const SidebarOption = ({ icon: Icon, title, to, isSelected, open, notifs }: SidebarOptionProps) => (
  <Link
    to={to}
    title={title}
    className={cn(
      "relative flex h-11 w-full items-center rounded-xl transition-all duration-200",
      isSelected
        ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100 dark:bg-sky-950/40 dark:text-sky-200 dark:ring-sky-900"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    )}
  >
    <div className="grid h-full w-12 place-content-center">
      <Icon className="h-4 w-4" />
    </div>

    {open && <span className="text-sm font-medium">{title}</span>}

    {Boolean(notifs) && open && (
      <span className="absolute right-3 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-semibold text-white">
        {notifs}
      </span>
    )}
  </Link>
)

const TitleSection = ({ open, label }: { open: boolean; label: string }) => {
  const { user } = useAuthStore()
  const displayName = user?.firstName || user?.username || "Guest Learner"

  return (
    <div className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-800">
      <Link
        to="/"
        className="flex flex-col items-center justify-center rounded-2xl p-5 transition-all duration-300 hover:bg-gradient-to-br hover:from-sky-50 hover:to-cyan-50 dark:hover:bg-gradient-to-br dark:hover:from-slate-800 dark:hover:to-slate-750"
      >
        <DevHubBrandMark
          size="lg"
          className="mb-4 transition-all duration-300 hover:shadow-xl"
        />
        {open && (
          <div className="w-full text-center space-y-1">
            <DevHubWordmark
              as="span"
              className="block text-lg font-bold"
              devClassName="text-sky-600 dark:text-sky-400"
              hubClassName="text-cyan-600 dark:text-cyan-400"
            />
            <span className="block text-base font-semibold text-slate-700 dark:text-slate-200">
              {displayName}
            </span>
            <span className="block text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              {label}
            </span>
          </div>
        )}
      </Link>
    </div>
  )
}

const ToggleClose = ({ open }: { open: boolean }) => {
  const { setSidebarOpen } = useSidebarStore()

  return (
    <button
      onClick={() => setSidebarOpen(!open)}
      className="border-t border-slate-200 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={cn(
              "h-4 w-4 text-slate-500 transition-transform duration-300 dark:text-slate-400",
              open && "rotate-180"
            )}
          />
        </div>
        {open && (
          <span className="text-sm font-medium text-slate-600 transition-opacity duration-200 dark:text-slate-300">
            Collapse
          </span>
        )}
      </div>
    </button>
  )
}

export const DevHubSidebar = () => {
  const location = useLocation()
  const { isOpen } = useSidebarStore()
  const [isMobileCoursePanelOpen, setIsMobileCoursePanelOpen] = useState(false)

  const currentCourseId = Number(location.pathname.match(/^\/courses\/(\d+)/)?.[1] || 0)
  const currentLessonId = Number(location.pathname.match(/\/lessons\/(\d+)/)?.[1] || 0)
  const activeTopic = new URLSearchParams(location.search).get("topic")?.toLowerCase() || ""
  const currentCourse = courseData.find((course) => course.id === currentCourseId)
  const isCourseView = Boolean(currentCourse)
  const currentCourseTopicSlugs = currentCourse ? createCourseTopicSlugMap(currentCourse.lessons) : {}

  const mainNavigation = [
    { icon: LayoutDashboard, title: "Dashboard", to: "/dashboard" },
    { icon: Home, title: "Home", to: "/" },
    { icon: BookOpen, title: "Tutorials", to: "/topics" },
    { icon: ShoppingCart, title: "Courses", to: "/courses", notifs: courseData.length },
    { icon: PlayCircle, title: "Videos", to: "/videos" },
    { icon: Newspaper, title: "News", to: "/news" },
    { icon: Monitor, title: "Code Editor", to: "/editor" },
  ]

  const accountNavigation = [
    { icon: User, title: "My Profile", to: "/profile" },
    { icon: HelpCircle, title: "Help Center", to: "/help-center" },
    { icon: MessageSquare, title: "Send Feedback", to: "/feedback" },
  ]

  useEffect(() => {
    setIsMobileCoursePanelOpen(false)
  }, [location.pathname, location.search])

  return (
    <>
      {isCourseView && currentCourse ? (
        <>
          <button
            type="button"
            onClick={() => setIsMobileCoursePanelOpen(true)}
            className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] left-4 z-50 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/95 px-3 py-2 text-sm font-semibold text-sky-700 shadow-lg shadow-sky-100/80 backdrop-blur md:hidden"
          >
            <BookOpen className="h-4 w-4" />
            Topics
          </button>

          {!isOpen ? (
            <button
              type="button"
              onClick={() => setIsMobileCoursePanelOpen(true)}
              className="fixed left-[5.9rem] top-[calc(var(--devhub-navbar-offset,80px)+18px)] z-50 hidden items-center gap-2 rounded-full border border-sky-200 bg-white/96 px-3 py-2 text-sm font-semibold text-sky-700 shadow-lg shadow-sky-100/80 backdrop-blur md:inline-flex"
            >
              <BookOpen className="h-4 w-4" />
              Browse topics
            </button>
          ) : null}

          {isMobileCoursePanelOpen ? (
            <>
              <button
                type="button"
                aria-label="Close topic navigator"
                className="fixed inset-0 z-[65] bg-slate-950/45 backdrop-blur-sm"
                onClick={() => setIsMobileCoursePanelOpen(false)}
              />
              <div className="fixed inset-x-3 bottom-4 top-[calc(var(--devhub-navbar-offset,80px)+12px)] z-[70] flex flex-col rounded-[1.8rem] border border-sky-200 bg-white/98 p-4 shadow-2xl shadow-sky-950/20 backdrop-blur md:left-6 md:right-auto md:w-[23rem] dark:border-sky-900/60 dark:bg-slate-900/96">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
                      Topic Navigator
                    </p>
                    <p className="mt-1 truncate text-base font-semibold text-slate-900 dark:text-white">
                      {currentCourse.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Open any topic quickly, even on smaller screens.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileCoursePanelOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <ChevronsRight className="h-4 w-4 rotate-180" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto rounded-2xl border border-sky-100 bg-sky-50/70 p-3 dark:border-sky-900/60 dark:bg-sky-950/25">
                  <div className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
                    Course Topics
                  </div>
                  <div className="space-y-1">
                    {currentCourse.lessons.map((lesson) => {
                      const lessonSlug =
                        currentCourseTopicSlugs[lesson.id] || slugifyTopic(lesson.title)
                      const isSelected = activeTopic
                        ? activeTopic === lessonSlug
                        : currentLessonId === lesson.id

                      return (
                        <Link
                          key={lesson.id}
                          to={`/courses/${currentCourse.id}?topic=${lessonSlug}`}
                          onClick={() => setIsMobileCoursePanelOpen(false)}
                          className={cn(
                            "flex rounded-xl px-3 py-2.5 text-sm transition-colors",
                            isSelected
                              ? "bg-white text-sky-700 shadow-sm dark:bg-sky-900/50 dark:text-sky-200"
                              : "text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-sky-900/30 dark:hover:text-slate-100"
                          )}
                        >
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : null}

      <aside
        style={{ top: 'var(--devhub-sidebar-top, 80px)' }}
        className={cn(
          "fixed bottom-0 left-0 z-40 hidden border-r border-slate-200 bg-white shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 md:flex md:flex-col",
          isOpen ? "w-72" : "w-20"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden p-2">
          {!isCourseView && (
            <TitleSection open={isOpen} label={currentCourse ? currentCourse.title : "Learning Space"} />
          )}

          <div className="flex-1 overflow-y-auto pb-4">
            {isCourseView && isOpen && currentCourse ? (
              <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-3 dark:border-sky-900/60 dark:bg-sky-950/25">
                <div className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
                  Course Topics
                </div>
                <div className="space-y-1">
                  {currentCourse.lessons.map((lesson) => {
                    const lessonSlug = currentCourseTopicSlugs[lesson.id] || slugifyTopic(lesson.title)
                    const isSelected = activeTopic
                      ? activeTopic === lessonSlug
                      : currentLessonId === lesson.id

                    return (
                      <Link
                        key={lesson.id}
                        to={`/courses/${currentCourse.id}?topic=${lessonSlug}`}
                        className={cn(
                          "flex rounded-xl px-3 py-2 text-sm transition-colors",
                          isSelected
                            ? "bg-white text-sky-700 shadow-sm dark:bg-sky-900/50 dark:text-sky-200"
                            : "text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-sky-900/30 dark:hover:text-slate-100"
                        )}
                      >
                        <span className="truncate">{lesson.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {!isCourseView && (
              <div className="space-y-1">
                {mainNavigation.map((item) => (
                  <SidebarOption
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    to={item.to}
                    isSelected={matchesRoute(location.pathname, item.to)}
                    open={isOpen}
                    notifs={item.notifs}
                  />
                ))}
              </div>
            )}

            {isOpen && !currentCourse && (
              <div className="mt-6">
                <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Learning Paths
                </div>
                <div className="space-y-1">
                  {courseData.slice(0, 4).map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                      <span className="truncate">{course.title}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        {course.difficulty}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {isOpen && !isCourseView && (
              <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Account
                </div>
                <div className="space-y-1">
                  {accountNavigation.map((item) => (
                    <SidebarOption
                      key={item.title}
                      icon={item.icon}
                      title={item.title}
                      to={item.to}
                      isSelected={matchesRoute(location.pathname, item.to)}
                      open={isOpen}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <ToggleClose open={isOpen} />
        </div>
      </aside>
    </>
  )
}

export const DevHubDashboardContent = ({
  userName,
  subtitle,
  stats,
  activities,
  tracks,
  actions,
  notificationCount = 0,
}: DevHubDashboardContentProps) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const syncTheme = () => setIsDark(isDarkThemeEnabled())
    syncTheme()
    window.addEventListener("devhub-theme-change", syncTheme)
    window.addEventListener("storage", syncTheme)
    return () => {
      window.removeEventListener("devhub-theme-change", syncTheme)
      window.removeEventListener("storage", syncTheme)
    }
  }, [])

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600 dark:text-sky-300">
            DevHub Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome back, {userName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 self-start xl:self-auto">
          <NotificationsMenu
            userName={userName}
            triggerClassName={cn(
              "h-11 w-11 rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
              notificationCount > 0 && "ring-2 ring-rose-100 dark:ring-rose-900/40"
            )}
          />

          <button
            onClick={() => applyThemePreference(!isDark)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            to="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Open profile"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <section className="rounded-[1.75rem] border border-sky-500/20 bg-gradient-to-br from-sky-600 via-cyan-600 to-blue-700 p-6 text-white shadow-xl shadow-sky-500/15">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Learning Momentum
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Keep your next lesson, project, and practice session in one place.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-sky-50/90">
              Jump back into courses, open the coding workspace, and follow your progress without leaving the dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              Browse Courses
            </Link>
            <Link
              to="/editor"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const tone = toneClasses[stat.tone]

          return (
            <Link
              key={stat.title}
              to={stat.href}
              className={cn(
                "group relative overflow-hidden rounded-[1.75rem] border p-6 shadow-[0_25px_55px_-45px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_70px_-42px_rgba(14,165,233,0.38)] dark:hover:shadow-[0_35px_70px_-42px_rgba(8,47,73,0.9)]",
                tone.surface
              )}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-75 dark:via-white/20" />
              <div className="mb-5 flex items-center justify-between">
                <div className={cn("rounded-xl p-3", tone.iconWrap)}>
                  <Icon className={cn("h-5 w-5", tone.iconColor)} />
                </div>
                <div className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", tone.badge)}>
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-current/70" />
                  {stat.badgeLabel}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">{stat.value}</p>
              <p className="mt-2 min-h-[3.25rem] text-sm leading-6 text-slate-500 dark:text-slate-400">{stat.helper}</p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-white/10">
                <span className={cn("text-xs font-semibold uppercase tracking-[0.18em]", tone.iconColor)}>
                  {stat.cta}
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/80 text-slate-700 shadow-sm transition-transform duration-300 group-hover:translate-x-1 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          )
        })}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.55fr,1fr]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Continue Learning</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Pick up where you left off and keep moving through your active learning paths.
                </p>
              </div>
              <Link to="/courses" className="text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-300">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {tracks.length > 0 ? (
                tracks.map((track) => {
                  const tone = toneClasses[track.tone || "blue"]

                  return (
                    <div
                      key={track.title}
                      className={cn(
                        "overflow-hidden rounded-[1.6rem] border p-5 shadow-[0_24px_45px_-38px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-0.5",
                        tone.surface
                      )}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="truncate text-lg font-semibold text-slate-950 dark:text-white">
                              {track.title}
                            </h4>
                            {track.performanceLabel && (
                              <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", tone.badge)}>
                                {track.performanceLabel}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {track.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                              {track.meta}
                            </span>
                            {track.completedLabel && (
                              <span className="rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                {track.completedLabel}
                              </span>
                            )}
                          </div>
                        </div>

                        <Link
                          to={track.href}
                          className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500"
                        >
                          {track.cta || "Open"}
                        </Link>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                          <span>Progress</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{track.progress}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white/70 dark:bg-slate-900/70">
                          <div
                            className={cn("h-2.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500", tone.progress)}
                            style={{ width: `${Math.max(0, Math.min(100, track.progress))}%` }}
                          />
                        </div>
                      </div>

                      {(track.nextStep || track.performanceDetail) && (
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {track.nextStep && (
                            <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-300">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Next Up
                              </p>
                              <p className="mt-1 font-medium text-slate-800 dark:text-slate-100">
                                {track.nextStep}
                              </p>
                            </div>
                          )}
                          {track.performanceDetail && (
                            <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-300">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Study Signal
                              </p>
                              <p className="mt-1 font-medium text-slate-800 dark:text-slate-100">
                                {track.performanceDetail}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No active learning paths yet. Start with a beginner-friendly course and your progress will appear here.
                  </p>
                  <Link
                    to="/courses"
                    className="mt-4 inline-flex rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                  >
                    Explore courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Recent Activity</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  See your latest progress, completions, and study milestones.
                </p>
              </div>
              <Activity className="h-5 w-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((item) => {
                  const Icon = item.icon
                  const tone = toneClasses[item.tone]
                  const content = (
                    <div className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80">
                      <div className={cn("rounded-xl p-2.5", tone.iconWrap)}>
                        <Icon className={cn("h-4 w-4", tone.iconColor)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{item.title}</p>
                        <p className="truncate text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                      </div>
                      <div className="text-xs font-medium text-slate-400">{item.time}</div>
                    </div>
                  )

                  return item.href ? (
                    <Link key={`${item.title}-${item.time}`} to={item.href}>
                      {content}
                    </Link>
                  ) : (
                    <div key={`${item.title}-${item.time}`}>{content}</div>
                  )
                })
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your study activity will start filling this section as soon as you work through lessons and exercises.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Quick Actions</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Open the tools and pages you use most in one click.
                </p>
              </div>
              <Compass className="h-5 w-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {actions.map((action) => {
                const Icon = action.icon

                return (
                  <Link
                    key={action.title}
                    to={action.href}
                    className="block rounded-2xl border border-slate-200 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50/40 dark:border-slate-800 dark:hover:border-sky-900 dark:hover:bg-sky-950/20"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-xl bg-slate-100 p-2.5 dark:bg-slate-800">
                        <Icon className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                      </div>
                      <h4 className="font-semibold">{action.title}</h4>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-sky-600 dark:text-sky-300">
                      {action.cta}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Learning Snapshot</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  A quick look at your current focus areas and study momentum.
                </p>
              </div>
              <Target className="h-5 w-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {tracks.slice(0, 3).map((track) => {
                const tone = toneClasses[track.tone || "blue"]

                return (
                  <Link
                    key={track.title}
                    to={track.href}
                    className="block rounded-2xl border border-slate-200 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50/40 dark:border-slate-800 dark:hover:border-sky-900 dark:hover:bg-sky-950/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{track.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                          {track.completedLabel || track.meta}
                        </p>
                      </div>
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", tone.badge)}>
                        {track.progress}%
                      </span>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={cn("h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500", tone.progress)}
                        style={{ width: `${Math.max(0, Math.min(100, track.progress))}%` }}
                      />
                    </div>

                    {track.nextStep && (
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{track.nextStep}</p>
                    )}

                    {track.performanceDetail && (
                      <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                        {track.performanceDetail}
                      </p>
                    )}
                  </Link>
                )
              })}

              {tracks.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Start a tutorial or course to unlock your personalized snapshot.
                </p>
              )}

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
                <p className="text-sm font-semibold">Consistency tip</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Pair one lesson with one editor session each day to build stronger retention and practice habit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export const Example = () => {
  const { isOpen } = useSidebarStore()

  const demoStats: DashboardStat[] = [
    {
      title: "Learning XP",
      value: "1,280",
      helper: "Strong consistency this week",
      href: "/courses/1",
      cta: "Keep earning",
      badgeLabel: "Growing",
      icon: TrendingUp,
      tone: "blue",
    },
    {
      title: "Active Courses",
      value: "4",
      helper: "Two paths close to completion",
      href: "/courses",
      cta: "Continue paths",
      badgeLabel: "Live",
      icon: BookOpen,
      tone: "emerald",
    },
    {
      title: "Certificates",
      value: "2",
      helper: "HTML and CSS foundations earned",
      href: "/profile?tab=certificates",
      cta: "View awards",
      badgeLabel: "Earned",
      icon: Award,
      tone: "violet",
    },
    {
      title: "Practice Sessions",
      value: "17",
      helper: "Editor sessions in the last 30 days",
      href: "/editor",
      cta: "Open editor",
      badgeLabel: "Hands-on",
      icon: Code2,
      tone: "amber",
    },
  ]

  const demoTracks: DashboardTrack[] = [
    {
      title: "HTML Tutorial",
      description: "Continue your structured path through the HTML course topics.",
      progress: 62,
      href: "/courses/1?topic=html-elements",
      meta: "50 lessons · beginner",
    },
    {
      title: "CSS Foundations",
      description: "Keep going with selectors, layouts, and responsive design practice.",
      progress: 38,
      href: "/courses/2",
      meta: "48 lessons · beginner",
    },
    {
      title: "Java Foundations",
      description: "Move into syntax, methods, objects, and core problem-solving with guided examples.",
      progress: 21,
      href: "/courses/3",
      meta: "60 lessons · beginner",
    },
  ]

  const demoActivities: DashboardActivity[] = [
    {
      title: "Completed HTML Headings",
      description: "You finished a core HTML topic and saved notes for review.",
      time: "Today",
      icon: Award,
      tone: "emerald",
      href: "/courses/1?topic=html-headings",
    },
    {
      title: "Opened the code editor",
      description: "Practiced with a live HTML example in the workspace.",
      time: "Yesterday",
      icon: PlayCircle,
      tone: "blue",
      href: "/editor",
    },
    {
      title: "Started CSS course",
      description: "Added a new learning path to your dashboard.",
      time: "2 days ago",
      icon: Compass,
      tone: "violet",
      href: "/courses/2",
    },
  ]

  const demoActions: DashboardAction[] = [
    {
      title: "Browse Courses",
      description: "Pick a new course or continue your current learning path.",
      href: "/courses",
      cta: "Open courses",
      icon: ShoppingCart,
    },
    {
      title: "Explore Tutorials",
      description: "Jump directly into topic-based lessons and references.",
      href: "/topics",
      cta: "Open tutorials",
      icon: Compass,
    },
    {
      title: "Practice in Editor",
      description: "Write code, test snippets, and build confidence with hands-on work.",
      href: "/editor",
      cta: "Launch editor",
      icon: Code2,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DevHubSidebar />
      <main
        className={cn("min-h-screen transition-all duration-300", isOpen ? "md:ml-72" : "md:ml-20")}
        style={{ paddingTop: 'var(--devhub-navbar-offset, 80px)' }}
      >
        <div className="p-4 lg:p-6">
          <DevHubDashboardContent
            userName="DevHub Learner"
            subtitle="Your dashboard combines learning progress, quick actions, and the next steps that matter most."
            stats={demoStats}
            activities={demoActivities}
            tracks={demoTracks}
            actions={demoActions}
            notificationCount={3}
          />
        </div>
      </main>
    </div>
  )
}

export default Example
