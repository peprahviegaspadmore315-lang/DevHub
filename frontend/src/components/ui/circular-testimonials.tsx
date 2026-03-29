"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, UserRound } from "lucide-react";

export interface CircularTestimonial {
  quote: string;
  name: string;
  designation: string;
  email: string;
  profileTag: string;
  profileSummary: string;
  src: string;
}

interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}

interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}

interface CircularTestimonialsProps {
  testimonials: CircularTestimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
}

function calculateGap(width: number) {
  const minWidth = 720;
  const maxWidth = 1456;
  const minGap = 56;
  const maxGap = 94;

  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return maxGap;

  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) => {
  const colorName = colors.name ?? "#07111f";
  const colorDesignation = colors.designation ?? "#4b5563";
  const colorTestimony = colors.testimony ?? "#172033";
  const colorArrowBg = colors.arrowBackground ?? "#0f172a";
  const colorArrowFg = colors.arrowForeground ?? "#f8fafc";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#0284c7";
  const fontSizeName = fontSizes.name ?? "2rem";
  const fontSizeDesignation = fontSizes.designation ?? "1rem";
  const fontSizeQuote = fontSizes.quote ?? "1.05rem";

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex, testimonials]
  );

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!autoplay || testimonialsLength <= 1) {
      return undefined;
    }

    autoplayIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    }, 5000);

    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") handlePrev();
      if (event.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handlePrev]);

  const getImageStyle = (index: number): React.CSSProperties => {
    const gap = calculateGap(containerWidth);
    const maxLift = gap * 0.56;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }

    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxLift}px) scale(0.84) rotateY(16deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }

    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxLift}px) scale(0.84) rotateY(-16deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }

    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transform: "translateX(0px) translateY(18px) scale(0.72)",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  };

  const quoteVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -18 },
  };

  return (
    <div className="w-full rounded-[2rem] border border-sky-100 bg-white/92 p-6 shadow-[0_30px_100px_-45px_rgba(14,165,233,0.38)] backdrop-blur-sm md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div
          ref={imageContainerRef}
          className="relative h-[18rem] overflow-hidden rounded-[1.75rem] sm:h-[21rem] lg:h-[26rem]"
          style={{ perspective: "1200px" }}
        >
          <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_44%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)]" />
          {testimonials.map((testimonial, index) => (
            <img
              key={`${testimonial.email}-${testimonial.src}`}
              src={testimonial.src}
              alt={testimonial.name}
              className="absolute inset-x-[18%] bottom-0 h-[86%] w-[64%] rounded-[1.6rem] object-cover shadow-[0_30px_65px_-34px_rgba(15,23,42,0.45)]"
              style={getImageStyle(index)}
            />
          ))}

          <div className="absolute left-5 top-5 inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm backdrop-blur">
            Learner voices
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-5"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
                <UserRound className="h-3.5 w-3.5" />
                Featured testimonial
              </div>

              <div>
                <h3
                  className="font-bold tracking-tight"
                  style={{ color: colorName, fontSize: fontSizeName }}
                >
                  {activeTestimonial.name}
                </h3>
                <p
                  className="mt-1"
                  style={{ color: colorDesignation, fontSize: fontSizeDesignation }}
                >
                  {activeTestimonial.designation}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                  <Mail className="h-4 w-4 text-sky-600" />
                  {activeTestimonial.email}
                </div>
                <div className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700">
                  {activeTestimonial.profileTag}
                </div>
              </div>

              <motion.p
                className="leading-8"
                style={{ color: colorTestimony, fontSize: fontSizeQuote }}
              >
                {activeTestimonial.quote.split(" ").map((word, index) => (
                  <motion.span
                    key={`${activeIndex}-${index}-${word}`}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.22,
                      ease: "easeInOut",
                      delay: 0.025 * index,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Profile snapshot
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {activeTestimonial.profileSummary}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full border-0 transition-colors"
                onClick={handlePrev}
                style={{
                  backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
                }}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
                aria-label="Previous testimonial"
                type="button"
              >
                <FaArrowLeft size={18} color={colorArrowFg} />
              </button>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full border-0 transition-colors"
                onClick={handleNext}
                style={{
                  backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
                }}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                aria-label="Next testimonial"
                type="button"
              >
                <FaArrowRight size={18} color={colorArrowFg} />
              </button>
            </div>

            <Link
              to="/feedback"
              className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
            >
              Share your feedback too
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTestimonials;
