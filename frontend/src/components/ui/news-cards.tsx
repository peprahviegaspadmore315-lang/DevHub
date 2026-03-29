"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  BookmarkIcon,
  ExternalLink,
  Newspaper,
  PlayCircle,
  RefreshCw,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NewsCard {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  mediaType?: "article" | "video";
  actionLabel?: string;
  timeAgo: string;
  location: string;
  image: string;
  gradientColors?: string[];
  content?: string[];
  articleUrl: string;
  sourceName: string;
  publishedAt?: string;
}

export interface StatusBar {
  id: string;
  category: string;
  subcategory: string;
  length: number;
  opacity: number;
}

interface NewsCardsProps {
  title?: string;
  subtitle?: string;
  statusBars?: StatusBar[];
  newsCards?: NewsCard[];
  enableAnimations?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  onOpenArticle?: (card: NewsCard) => void;
  fetchedAt?: string;
}

type ContentFilter = "all" | "article" | "video";

const defaultStatusBars: StatusBar[] = [
  {
    id: "1",
    category: "Programming News",
    subcategory: "GitHub Blog",
    length: 3,
    opacity: 1,
  },
  {
    id: "2",
    category: "AI Briefing",
    subcategory: "OpenAI News",
    length: 2,
    opacity: 0.72,
  },
  {
    id: "3",
    category: "Programming Videos",
    subcategory: "freeCodeCamp",
    length: 1,
    opacity: 0.45,
  },
];

const defaultNewsCards: NewsCard[] = [
  {
    id: "fallback-1",
    title: "Programming, AI, and video stories will appear here",
    category: "Programming News",
    subcategory: "DevHub",
    mediaType: "article",
    actionLabel: "Read article",
    timeAgo: "Just now",
    location: "Online",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    gradientColors: ["from-sky-500/20", "to-cyan-500/20"],
    content: [
      "DevHub uses this section for live programming headlines, AI updates, and developer-focused videos from online sources.",
      "Refresh the page or use the filters to load the newest mix and choose the format you want to open.",
    ],
    articleUrl: "https://github.blog/",
    sourceName: "DevHub",
  },
];

const formatFetchedAt = (value?: string) => {
  if (!value) return "Just updated";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Live sources";
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getMediaType = (card: NewsCard): "article" | "video" =>
  card.mediaType === "video" ? "video" : "article";

const getActionLabel = (card: NewsCard) =>
  card.actionLabel || (getMediaType(card) === "video" ? "Watch video" : "Read article");

const getFilterLabel = (filter: ContentFilter) => {
  switch (filter) {
    case "article":
      return "Articles";
    case "video":
      return "Videos";
    default:
      return "Everything";
  }
};

export function NewsCards({
  title = "Programming News",
  subtitle = "Current stories, tooling releases, and developer updates from online sources.",
  statusBars = defaultStatusBars,
  newsCards = defaultNewsCards,
  enableAnimations = true,
  onRefresh,
  refreshing = false,
  onOpenArticle,
  fetchedAt,
}: NewsCardsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCard, setSelectedCard] = useState<NewsCard | null>(null);
  const [bookmarkedCards, setBookmarkedCards] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<ContentFilter>("all");
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => setIsLoaded(true), 80);
      return () => clearTimeout(timer);
    }

    setIsLoaded(true);
  }, [shouldAnimate]);

  const statusSummary = useMemo(
    () => statusBars.map((bar) => `${bar.subcategory}`).join(" • "),
    [statusBars]
  );

  const maxStatusLength = useMemo(
    () => Math.max(...statusBars.map((bar) => bar.length), 1),
    [statusBars]
  );

  const availableFilters = useMemo(() => {
    const filters: ContentFilter[] = ["all"];

    if (newsCards.some((card) => getMediaType(card) === "article")) {
      filters.push("article");
    }
    if (newsCards.some((card) => getMediaType(card) === "video")) {
      filters.push("video");
    }

    return filters;
  }, [newsCards]);

  const visibleCards = useMemo(() => {
    if (activeFilter === "all") {
      return newsCards;
    }

    return newsCards.filter((card) => getMediaType(card) === activeFilter);
  }, [activeFilter, newsCards]);

  useEffect(() => {
    if (!availableFilters.includes(activeFilter)) {
      setActiveFilter("all");
    }
  }, [activeFilter, availableFilters]);

  const toggleBookmark = (cardId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setBookmarkedCards((previous) => {
      const next = new Set(previous);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const openCard = (card: NewsCard) => {
    setSelectedCard(card);
  };

  const closeCard = () => {
    setSelectedCard(null);
  };

  const openExternal = (card: NewsCard, event?: React.MouseEvent) => {
    event?.stopPropagation();
    onOpenArticle?.(card);
    window.open(card.articleUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      className="w-full"
      initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
      animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-6 shadow-[0_28px_90px_-54px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_30%),linear-gradient(180deg,#081121_0%,#020817_100%)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-700 shadow-sm dark:border-sky-900/70 dark:bg-slate-900/70 dark:text-sky-200">
              Live mixed feed
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
              {subtitle}
            </p>

            {availableFilters.length > 1 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {availableFilters.map((filter) => {
                  const isActive = activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                        isActive
                          ? "border-sky-300 bg-sky-500 text-white shadow-[0_12px_30px_-18px_rgba(14,165,233,0.7)] dark:border-sky-400 dark:bg-sky-500"
                          : "border-slate-200 bg-white/85 text-slate-600 hover:border-sky-200 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:text-sky-200"
                      )}
                    >
                      {getFilterLabel(filter)}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 rounded-[1.4rem] border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Active sources
            </div>
            <div className="flex flex-wrap gap-2">
              {statusBars.map((bar) => (
                <Badge
                  key={bar.id}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {bar.subcategory}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Updated {formatFetchedAt(fetchedAt)}
            </div>
            {onRefresh ? (
              <Button
                onClick={onRefresh}
                variant="outline"
                className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                disabled={refreshing}
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", refreshing && "animate-spin")} />
                {refreshing ? "Refreshing..." : "Refresh feed"}
              </Button>
            ) : null}
          </div>
        </div>

        <motion.div
          className="mt-6 space-y-2"
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
        >
          {statusBars.map((bar, index) => (
            <motion.div
              key={bar.id}
              className="h-0.5 rounded-full bg-slate-900/70 dark:bg-white/70"
              style={{
                opacity: bar.opacity,
                width: `${(bar.length / maxStatusLength) * 100}%`,
              }}
              initial={shouldAnimate ? { scaleX: 0, transformOrigin: "left center" } : false}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.08 * index, duration: 0.35, ease: "easeOut" }}
            />
          ))}
          <p className="pt-2 text-xs text-slate-500 dark:text-slate-400">{statusSummary}</p>
        </motion.div>
      </div>

      <LayoutGroup>
        {visibleCards.length === 0 ? (
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            No {getFilterLabel(activeFilter).toLowerCase()} are available in the current refresh yet.
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            initial={shouldAnimate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08 }}
          >
            {visibleCards.map((card, index) => {
              if (selectedCard?.id === card.id) {
                return null;
              }

              const mediaType = getMediaType(card);
              const actionLabel = getActionLabel(card);

              return (
                <motion.article
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  className="group cursor-pointer overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.38)] transition-all duration-300 dark:border-slate-800 dark:bg-slate-900"
                  initial={shouldAnimate ? { opacity: 0, y: 18, scale: 0.98 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.08 * index, duration: 0.35, ease: "easeOut" }}
                  whileHover={
                    shouldAnimate
                      ? {
                          y: -6,
                          scale: 1.01,
                          transition: { type: "spring", stiffness: 360, damping: 24 },
                        }
                      : undefined
                  }
                  onClick={() => openCard(card)}
                >
                  <motion.div
                    layoutId={`card-image-${card.id}`}
                    className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800"
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />
                    {card.gradientColors && card.gradientColors.length >= 2 ? (
                      <div
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t to-transparent",
                          card.gradientColors[0],
                          card.gradientColors[1]
                        )}
                      />
                    ) : null}

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <Badge className="rounded-full border-transparent bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-800 hover:bg-white/90">
                        {card.category}
                      </Badge>
                      <Badge className="rounded-full border-transparent bg-slate-900/70 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-900/70">
                        {mediaType === "video" ? "Video" : "Article"}
                      </Badge>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => toggleBookmark(card.id, event)}
                      className="absolute right-4 top-4 rounded-full bg-slate-950/55 p-2 text-white transition hover:bg-slate-950/80"
                      aria-label={bookmarkedCards.has(card.id) ? "Remove bookmark" : "Bookmark item"}
                    >
                      <BookmarkIcon
                        className={cn(
                          "h-4 w-4",
                          bookmarkedCards.has(card.id) && "fill-amber-300 text-amber-300"
                        )}
                      />
                    </button>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.2em] text-white/75">
                        <span>{card.timeAgo}</span>
                        <span>{card.location}</span>
                      </div>
                      <h3 className="text-lg font-semibold leading-tight">{card.title}</h3>
                    </div>
                  </motion.div>

                  <motion.div layoutId={`card-content-${card.id}`} className="p-5">
                    <div className="mb-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {card.content?.[0] || "Open this item to read or watch more from the source."}
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Source
                        </div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-100">
                          {card.sourceName}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                        onClick={(event) => openExternal(card, event)}
                      >
                        {actionLabel}
                      </Button>
                    </div>
                  </motion.div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedCard ? (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeCard}
              />

              <motion.div
                layoutId={`card-${selectedCard.id}`}
                className="fixed inset-4 z-50 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_40px_110px_-40px_rgba(15,23,42,0.65)] dark:border-slate-800 dark:bg-slate-950 md:inset-10 lg:inset-x-[10%] lg:inset-y-12"
              >
                <button
                  type="button"
                  onClick={closeCard}
                  className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-900 shadow-sm transition hover:bg-white dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-900"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="h-full overflow-y-auto">
                  <motion.div
                    layoutId={`card-image-${selectedCard.id}`}
                    className="relative h-72 overflow-hidden bg-slate-100 dark:bg-slate-900 md:h-96"
                  >
                            <img
                              src={selectedCard.image}
                              alt={selectedCard.title}
                              loading="eager"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-20">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge className="rounded-full border-transparent bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-800 hover:bg-white/90">
                          {selectedCard.category}
                        </Badge>
                        <Badge className="rounded-full border-transparent bg-slate-900/70 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-900/70">
                          {getMediaType(selectedCard) === "video" ? "Video" : "Article"}
                        </Badge>
                      </div>
                      <motion.h2
                        layoutId={`card-title-${selectedCard.id}`}
                        className="text-2xl font-bold tracking-tight text-white md:text-4xl"
                      >
                        {selectedCard.title}
                      </motion.h2>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
                        <span>{selectedCard.timeAgo}</span>
                        <span className="h-1 w-1 rounded-full bg-white/60" />
                        <span>{selectedCard.location}</span>
                        <span className="h-1 w-1 rounded-full bg-white/60" />
                        <span>{selectedCard.sourceName}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    layoutId={`card-content-${selectedCard.id}`}
                    className="p-6 md:p-8"
                  >
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {getMediaType(selectedCard) === "video"
                          ? "Open the original video to watch the full walkthrough, then come back to DevHub for the related learning path."
                          : "Open the original article for the full story, then come back to DevHub for the related learning path."}
                      </div>
                      <Button
                        onClick={() => openExternal(selectedCard)}
                        className="rounded-full bg-sky-500 text-white hover:bg-sky-400"
                      >
                        {getMediaType(selectedCard) === "video" ? (
                          <PlayCircle className="mr-2 h-4 w-4" />
                        ) : (
                          <Newspaper className="mr-2 h-4 w-4" />
                        )}
                        {getActionLabel(selectedCard)}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4 text-base leading-8 text-slate-700 dark:text-slate-200">
                      {(selectedCard.content || []).map((paragraph, index) => (
                        <p key={`${selectedCard.id}-paragraph-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </LayoutGroup>
    </motion.div>
  );
}

export default NewsCards;
