import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, ExternalLink, Newspaper, PlayCircle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsCards } from "@/components/ui/news-cards";
import { courseData } from "@/data/courseData";
import { newsApi } from "@/services/api";
import type { ProgrammingNewsResponse } from "@/types";

const fallbackNews: ProgrammingNewsResponse = {
  title: "Fresh Programming, AI, and Tech Videos",
  subtitle: "Live articles and videos about AI, programming, tools, and developer trends so learners can read, watch, and explore from one place.",
  fetchedAt: new Date().toISOString(),
  sources: [
    { id: "1", category: "Programming News", subcategory: "GitHub Blog", length: 3, opacity: 1 },
    { id: "2", category: "AI Briefing", subcategory: "OpenAI News", length: 2, opacity: 0.72 },
    { id: "3", category: "Programming Videos", subcategory: "freeCodeCamp", length: 1, opacity: 0.45 },
  ],
  articles: [],
};

export default function ProgrammingNewsPage() {
  const [data, setData] = useState<ProgrammingNewsResponse>(fallbackNews);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async (showToast = false) => {
    try {
      setRefreshing(true);
      const response = await newsApi.getProgrammingNews({ limit: 12 });
      setData(response.data);
      setError(null);

      if (showToast) {
        toast.success("Live tech feed refreshed.");
      }
    } catch (fetchError: any) {
      const message =
        fetchError?.response?.data?.message ||
        "DevHub could not load the live articles and videos right now.";
      setError(message);

      if (showToast) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews(false);
  }, [loadNews]);

  const videoStories = useMemo(
    () => data.articles.filter((item) => item.mediaType === "video").slice(0, 6),
    [data.articles]
  );

  const articleStories = useMemo(
    () => data.articles.filter((item) => item.mediaType !== "video"),
    [data.articles]
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef6ff_30%,#ffffff_100%)]">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-sky-100 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_30%),linear-gradient(135deg,#071120_0%,#0c1a35_42%,#13244f_100%)] p-6 text-white shadow-[0_35px_110px_-55px_rgba(14,165,233,0.55)] md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-100">
                <Newspaper className="h-3.5 w-3.5" />
                DevHub news desk
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                Follow what is happening in programming, AI, and developer media right now.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-50/85 md:text-base">
                This section keeps DevHub learners close to current developer stories, AI releases,
                tooling updates, and practical programming videos online. Open an article or a video,
                then jump back into the matching course when you want to study the concept more deeply.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {courseData.map((course) => (
                  <Badge
                    key={course.id}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white hover:bg-white/10"
                  >
                    {course.title}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                to="/topics"
                className="group rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/14"
              >
                <BookOpen className="h-5 w-5 text-sky-200" />
                <div className="mt-4 text-lg font-semibold">Study the topic</div>
                <div className="mt-2 text-sm leading-6 text-sky-50/75">
                  Jump from the headline into DevHub tutorials.
                </div>
              </Link>
              <Link
                to="/videos"
                className="group rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/14"
              >
                <Sparkles className="h-5 w-5 text-violet-200" />
                <div className="mt-4 text-lg font-semibold">Watch a related video</div>
                <div className="mt-2 text-sm leading-6 text-sky-50/75">
                  Open related videos when you want to learn by watching instead of reading.
                </div>
              </Link>
              <button
                type="button"
                onClick={() => loadNews(true)}
                className="group rounded-[1.5rem] border border-white/10 bg-white/10 p-4 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/14"
              >
                <ExternalLink className="h-5 w-5 text-emerald-200" />
                <div className="mt-4 text-lg font-semibold">Refresh the headlines</div>
                <div className="mt-2 text-sm leading-6 text-sky-50/75">
                  Pull the latest articles and videos into DevHub.
                </div>
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em]">
                  Live feed notice
                </div>
                <div className="mt-2 text-sm">{error}</div>
              </div>
              <Button
                onClick={() => loadNews(true)}
                variant="outline"
                className="rounded-full border-amber-300 bg-white text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-transparent dark:text-amber-100 dark:hover:bg-amber-900/30"
              >
                Try again
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-56 animate-pulse rounded-[1.2rem] bg-slate-200 dark:bg-slate-800" />
                <div className="mt-5 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-4 h-7 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-7 w-3/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-6 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-2 h-4 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <section className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_28px_90px_-54px_rgba(15,23,42,0.2)] dark:border-slate-800 dark:bg-slate-900/90 md:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                    <PlayCircle className="h-3.5 w-3.5" />
                    Video section
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                    Watch the latest programming and AI videos inside the same news space.
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                    This video lane pulls the newest developer-focused videos from the live feed so learners can switch from reading to watching without leaving DevHub.
                  </p>
                </div>

                <Button asChild className="rounded-full bg-sky-600 text-white hover:bg-sky-500">
                  <Link to="/videos">
                    Open video hub
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {videoStories.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {videoStories.map((video) => (
                    <a
                      key={video.id}
                      href={video.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-50/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-red-900/40"
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800">
                        <img
                          src={video.image}
                          alt={video.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-sm">
                          <PlayCircle className="h-3.5 w-3.5" />
                          Video
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                          {video.sourceName} • {video.timeAgo}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-950 transition group-hover:text-red-600 dark:text-white dark:group-hover:text-red-300">
                          {video.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {video.content?.[0] || "Watch the full walkthrough from the original source."}
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-300">
                          Watch original video
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300">
                  No live videos arrived in this refresh, but the feed is already configured for them. Refresh again or open the dedicated video hub for broader topic videos.
                </div>
              )}
            </section>

            <NewsCards
              title={articleStories.length > 0 ? "Live programming article feed" : data.title}
              subtitle={
                articleStories.length > 0
                  ? "Read the freshest programming, AI, and tooling stories from the current online sources. Use the filters inside the feed if you want to jump back to mixed content."
                  : data.subtitle
              }
              statusBars={data.sources.length > 0 ? data.sources : undefined}
              newsCards={data.articles.length > 0 ? data.articles : undefined}
              fetchedAt={data.fetchedAt}
              refreshing={refreshing}
              onRefresh={() => loadNews(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}
