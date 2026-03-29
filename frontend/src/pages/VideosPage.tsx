import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  BookOpen,
  ExternalLink,
  Filter,
  PlayCircle,
  Search,
  Sparkles,
  Tv,
  Video,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WorkspaceWelcome, type ActionItem } from "@/components/ui/welcome"
import { courseData } from "@/data/courseData"
import {
  createYouTubeSearchUrl,
  findCourseForVideoRoute,
  getFeaturedCourseVideo,
  getTopicVideoRecommendations,
  type TopicVideoRecommendation,
} from "@/data/videoRecommendations"
import { cn } from "@/lib/utils"
import {
  readVideoResumeSelection,
  saveVideoResumeSelection,
} from "@/lib/video-resume"
import { useAuthStore } from "@/store"

const VideosPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const playerRef = useRef<HTMLDivElement | null>(null)
  const topicsRef = useRef<HTMLDivElement | null>(null)
  const [topicFilter, setTopicFilter] = useState("")
  const [resumeHydrated, setResumeHydrated] = useState(false)

  const userVideoScope = user?.id ? `user-${user.id}` : "guest"

  const selectedCourse = useMemo(
    () =>
      findCourseForVideoRoute({
        courseId: Number(searchParams.get("courseId") || 0),
        courseSlug: searchParams.get("course"),
        language: searchParams.get("language"),
      }),
    [searchParams]
  )

  const featuredVideo = useMemo(() => getFeaturedCourseVideo(selectedCourse), [selectedCourse])
  const topicRecommendations = useMemo(
    () => getTopicVideoRecommendations(selectedCourse),
    [selectedCourse]
  )

  const selectedTopicParam = searchParams.get("topic")?.trim().toLowerCase() || ""
  const selectedTopic = useMemo(
    () =>
      topicRecommendations.find(
        (topic) =>
          topic.slug.toLowerCase() === selectedTopicParam ||
          topic.title.toLowerCase() === selectedTopicParam
      ) || null,
    [selectedTopicParam, topicRecommendations]
  )

  const filteredTopics = useMemo(() => {
    const normalizedFilter = topicFilter.trim().toLowerCase()
    if (!normalizedFilter) {
      return topicRecommendations
    }

    return topicRecommendations.filter((topic) =>
      [topic.title, topic.description, topic.searchQuery].some((value) =>
        value.toLowerCase().includes(normalizedFilter)
      )
    )
  }, [topicFilter, topicRecommendations])

  useEffect(() => {
    setTopicFilter("")
  }, [selectedCourse.id])

  useEffect(() => {
    const hasExplicitSelection = ["courseId", "course", "language", "topic"].some((key) =>
      Boolean(searchParams.get(key))
    )

    if (hasExplicitSelection) {
      setResumeHydrated(true)
      return
    }

    const savedSelection = readVideoResumeSelection(userVideoScope)
    if (!savedSelection) {
      setResumeHydrated(true)
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("courseId", String(savedSelection.courseId))
    nextParams.set("course", savedSelection.courseSlug)
    nextParams.set("language", savedSelection.language)

    if (savedSelection.topicSlug) {
      nextParams.set("topic", savedSelection.topicSlug)
    } else {
      nextParams.delete("topic")
    }

    setSearchParams(nextParams)
  }, [searchParams, setSearchParams, userVideoScope])

  useEffect(() => {
    if (!resumeHydrated) {
      return
    }

    saveVideoResumeSelection(userVideoScope, {
      courseId: selectedCourse.id,
      courseSlug: selectedCourse.slug,
      language: selectedCourse.slug.split("-")[0],
      topicSlug: selectedTopic?.slug,
    })
  }, [resumeHydrated, selectedCourse.id, selectedCourse.slug, selectedTopic?.slug, userVideoScope])

  const syncCourseSelection = (courseId: number) => {
    const nextCourse = courseData.find((course) => course.id === courseId)
    if (!nextCourse) {
      return null
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("courseId", String(nextCourse.id))
    nextParams.set("course", nextCourse.slug)
    nextParams.set("language", nextCourse.slug.split("-")[0])
    nextParams.delete("topic")
    setSearchParams(nextParams)

    saveVideoResumeSelection(userVideoScope, {
      courseId: nextCourse.id,
      courseSlug: nextCourse.slug,
      language: nextCourse.slug.split("-")[0],
    })

    return nextCourse
  }

  const updateRouteForCourse = (courseId: number) => {
    syncCourseSelection(courseId)
  }

  const openCourseVideoLane = (courseId: number) => {
    const nextCourse = syncCourseSelection(courseId)
    if (!nextCourse) {
      return
    }

    window.requestAnimationFrame(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    })
  }

  const highlightTopic = (topicSlug: string) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set("courseId", String(selectedCourse.id))
    nextParams.set("course", selectedCourse.slug)
    nextParams.set("language", selectedCourse.slug.split("-")[0])
    nextParams.set("topic", topicSlug)
    setSearchParams(nextParams)
  }

  const rememberTopicAndOpenSearch = (topic: TopicVideoRecommendation) => {
    highlightTopic(topic.slug)
    saveVideoResumeSelection(userVideoScope, {
      courseId: selectedCourse.id,
      courseSlug: selectedCourse.slug,
      language: selectedCourse.slug.split("-")[0],
      topicSlug: topic.slug,
    })
    openInNewTab(topic.youtubeSearchUrl)
  }

  const playFeaturedVideo = () => {
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    saveVideoResumeSelection(userVideoScope, {
      courseId: selectedCourse.id,
      courseSlug: selectedCourse.slug,
      language: selectedCourse.slug.split("-")[0],
      topicSlug: selectedTopic?.slug,
    })
  }

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const openSelectedTopicSearch = () => {
    if (selectedTopic) {
      openInNewTab(selectedTopic.youtubeSearchUrl)
      return
    }

    topicsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const welcomeActions: ActionItem[] = [
    {
      icon: <BookOpen className="h-4 w-4 text-sky-600" />,
      label: "Open course",
      onClick: () => navigate(`/courses/${selectedCourse.id}`),
    },
    {
      icon: <PlayCircle className="h-4 w-4 text-rose-500" />,
      label: "Watch on YouTube",
      onClick: () => openInNewTab(featuredVideo.youtubeUrl),
    },
    {
      icon: <Search className="h-4 w-4 text-violet-500" />,
      label: selectedTopic ? `Search ${selectedTopic.title}` : "Topic videos",
      onClick: openSelectedTopicSearch,
    },
  ]

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5fbff_0%,#edf6ff_34%,#ffffff_100%)]">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <WorkspaceWelcome
          userName={user?.firstName || user?.username || "DevHub learner"}
          videoThumbnail={featuredVideo.thumbnailUrl}
          videoTitle={featuredVideo.title}
          videoDescription={featuredVideo.description}
          actions={welcomeActions}
          onPlayVideo={playFeaturedVideo}
          className="border-sky-100/80 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]"
        />

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            ref={playerRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-[0_30px_90px_-48px_rgba(15,23,42,0.8)]"
          >
            <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(8,47,73,0.95),rgba(15,23,42,0.96))] px-6 py-5 text-white">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="border-transparent bg-sky-500/15 text-sky-100 hover:bg-sky-500/15">
                  Featured course video
                </Badge>
                <Badge className="border-transparent bg-white/10 text-white/85 hover:bg-white/10">
                  {featuredVideo.provider}
                </Badge>
                {selectedTopic ? (
                  <Badge className="border-transparent bg-violet-500/15 text-violet-100 hover:bg-violet-500/15">
                    Topic focus: {selectedTopic.title}
                  </Badge>
                ) : null}
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">{featuredVideo.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-white/75">
                {featuredVideo.description}
              </p>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                title={featuredVideo.title}
                src={featuredVideo.embedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 px-6 py-5 text-white">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-200">
                  Recommended for
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {featuredVideo.recommendedFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => openInNewTab(featuredVideo.youtubeUrl)}
                  className="rounded-full bg-sky-500 text-white hover:bg-sky-400"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch on YouTube
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openInNewTab(featuredVideo.sourceUrl)}
                  className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Source note
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_-48px_rgba(14,165,233,0.3)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-700">
                    Current lane
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    {selectedCourse.title}
                  </h2>
                </div>
                <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                  <Video className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-600">{selectedCourse.description}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Lessons
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-950">
                    {selectedCourse.lessons.length}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Difficulty
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">
                    {selectedCourse.difficulty}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Category
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">
                    {selectedCourse.category}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                  <Link to={`/courses/${selectedCourse.id}`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Open in DevHub
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => topicsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="rounded-full border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Browse topic videos
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#071224_0%,#0b1930_100%)] p-6 text-white shadow-[0_26px_80px_-48px_rgba(15,23,42,0.7)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-100">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-100/70">
                    DevHub pick
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">
                    Why this video is worth your time
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/75">
                DevHub keeps one personally recommended starter video for each course, then pairs it with
                topic-level YouTube searches so learners can move from a trusted overview into more specific
                explanations when they need them.
              </p>

              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/55">
                  Source reference
                </p>
                <p className="mt-2 text-sm font-medium text-white">{featuredVideo.sourceLabel}</p>
                <Button
                  variant="outline"
                  onClick={() => openInNewTab(featuredVideo.sourceUrl)}
                  className="mt-4 rounded-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open source page
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="rounded-[2rem] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_90px_-52px_rgba(14,165,233,0.28)] md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-700">
                Course video lanes
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Switch courses and keep the recommendations relevant.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Each DevHub course has its own featured YouTube recommendation. Tap any card below and DevHub
              will open that exact video in the player above, then keep topic searches aligned to the same lane.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {courseData.map((course) => {
              const recommendation = getFeaturedCourseVideo(course)
              const isActive = course.id === selectedCourse.id

              return (
                <button
                  type="button"
                  key={course.id}
                  onClick={() => openCourseVideoLane(course.id)}
                  className={cn(
                    "group overflow-hidden rounded-[1.6rem] border text-left transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2",
                    isActive
                      ? "border-sky-300 bg-sky-50 shadow-[0_20px_60px_-34px_rgba(14,165,233,0.35)]"
                      : "border-slate-200 bg-white hover:border-sky-200 hover:shadow-[0_20px_60px_-40px_rgba(15,23,42,0.18)]"
                  )}
                  aria-label={`Open ${recommendation.title}`}
                >
                  <div className="relative">
                    <img
                      src={recommendation.thumbnailUrl}
                      alt={recommendation.title}
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                    <div className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-slate-950/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-sm">
                      <PlayCircle className="h-3.5 w-3.5" />
                      Watch now
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge className="border-transparent bg-sky-50 text-sky-700 hover:bg-sky-50">
                        {course.difficulty}
                      </Badge>
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        {course.lessons.length} topics
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{course.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.title}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      <span>{recommendation.provider}</span>
                      <span className="inline-flex items-center gap-1 text-sky-700">
                        Open video
                        <PlayCircle className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section
          ref={topicsRef}
          className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#051226_0%,#09172e_100%)] p-6 text-white shadow-[0_30px_100px_-58px_rgba(15,23,42,0.85)] md:p-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-100/70">
                Topic video search
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Watch YouTube videos for any {selectedCourse.title} topic.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
                DevHub keeps a direct recommended course video above, then gives every topic its own YouTube
                search action below so users can quickly watch a more specific explanation online.
              </p>
            </div>

            <div className="w-full max-w-md">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                Filter topics
              </label>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3">
                <Search className="h-4 w-4 text-white/50" />
                <input
                  value={topicFilter}
                  onChange={(event) => setTopicFilter(event.target.value)}
                  placeholder={`Search ${selectedCourse.title} topics`}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/70">
                    Topic list
                  </p>
                  <h3 className="mt-1 text-xl font-semibold">
                    {filteredTopics.length} video search{filteredTopics.length === 1 ? "" : "es"} ready
                  </h3>
                </div>
                {selectedTopic ? (
                  <Badge className="border-transparent bg-violet-500/15 text-violet-100 hover:bg-violet-500/15">
                    Selected: {selectedTopic.title}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-4 max-h-[34rem] space-y-3 overflow-y-auto pr-1">
                {filteredTopics.map((topic) => {
                  const isSelected = selectedTopic?.slug === topic.slug

                  return (
                    <div
                      key={topic.lessonId}
                      className={cn(
                        "rounded-[1.4rem] border p-4 transition-all duration-300",
                        isSelected
                          ? "border-sky-300 bg-sky-500/10 shadow-[0_20px_60px_-36px_rgba(14,165,233,0.35)]"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                      )}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <button
                            type="button"
                            onClick={() => highlightTopic(topic.slug)}
                            className="text-left"
                          >
                            <h4 className="text-lg font-semibold text-white">{topic.title}</h4>
                          </button>
                          <p className="mt-2 text-sm leading-6 text-white/70">{topic.description}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/45">
                            Search: {topic.searchQuery}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="outline"
                            onClick={() => highlightTopic(topic.slug)}
                            className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Focus topic
                          </Button>
                          <Button
                            onClick={() => rememberTopicAndOpenSearch(topic)}
                            className="rounded-full bg-sky-500 text-white hover:bg-sky-400"
                          >
                            <Tv className="mr-2 h-4 w-4" />
                            Search YouTube
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/70">
                  Current focus
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {selectedTopic ? selectedTopic.title : "Choose a topic from the list"}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  {selectedTopic
                    ? "Open the course topic in DevHub or jump straight to YouTube search results for that exact lesson."
                    : "Select a topic to keep your YouTube search aligned with the specific lesson you want to study."}
                </p>

                {selectedTopic ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-sky-50">
                      <Link to={selectedTopic.courseUrl}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Open in DevHub
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => openInNewTab(selectedTopic.youtubeSearchUrl)}
                      className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Watch on YouTube
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="rounded-[1.7rem] border border-sky-400/20 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100/80">
                  Quick course search
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Need a broader video list?
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  DevHub can also open a broader YouTube search for the whole course if the single featured
                  recommendation is not enough.
                </p>
                <Button
                  onClick={() =>
                    openInNewTab(
                      createYouTubeSearchUrl(`${selectedCourse.title} full course beginner tutorial`)
                    )
                  }
                  className="mt-5 rounded-full bg-sky-500 text-white hover:bg-sky-400"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search more {selectedCourse.title} videos
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default VideosPage
