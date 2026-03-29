import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Bot,
  BrainCircuit,
  Code2,
  Compass,
  GraduationCap,
  Headphones,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

import { cn } from '@/lib/utils'

export type AnimationPhase = 'scatter' | 'line' | 'circle'

export interface HelpCenterHeroCard {
  title: string
  description: string
  actionLabel: string
  href: string
  image: string
  tag: string
  accentClassName: string
  icon: LucideIcon
}

interface FlipCardProps {
  item: HelpCenterHeroCard
  index: number
  target: {
    x: number
    y: number
    rotation: number
    scale: number
    opacity: number
  }
  onSelect?: (item: HelpCenterHeroCard) => void
}

interface ScrollMorphHeroProps {
  cards?: HelpCenterHeroCard[]
  title?: string
  description?: string
  eyebrow?: string
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  onTertiaryAction?: () => void
  onCardSelect?: (item: HelpCenterHeroCard) => void
}

const IMG_WIDTH = 82
const IMG_HEIGHT = 118
const MAX_SCROLL = 3000

export const defaultHelpCenterCards: HelpCenterHeroCard[] = [
  {
    title: 'Ask DevHub AI',
    description: 'Open chat for general help, planning, and coding guidance.',
    actionLabel: 'Open chat',
    href: '/help-center?tool=chat',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    tag: 'AI help',
    accentClassName: 'from-sky-500 to-blue-600',
    icon: Bot,
  },
  {
    title: 'Explain Code',
    description: 'Paste a snippet and get a guided explanation you can read or hear.',
    actionLabel: 'Explain code',
    href: '/help-center?tool=explain',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80',
    tag: 'Code clarity',
    accentClassName: 'from-cyan-500 to-sky-600',
    icon: Code2,
  },
  {
    title: 'Practice Quiz',
    description: 'Turn a topic into short questions for quick revision.',
    actionLabel: 'Start quiz',
    href: '/help-center?tool=quiz',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80',
    tag: 'Revision',
    accentClassName: 'from-amber-500 to-orange-500',
    icon: BrainCircuit,
  },
  {
    title: 'Reading Studio',
    description: 'Listen to lesson text or AI explanations while you keep learning.',
    actionLabel: 'Start reading',
    href: '/help-center?tool=reading',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&q=80',
    tag: 'Audio support',
    accentClassName: 'from-teal-500 to-emerald-500',
    icon: Headphones,
  },
  {
    title: 'Guided Tutorials',
    description: 'Jump back into the topic dashboard without losing your flow.',
    actionLabel: 'Browse topics',
    href: '/topics',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&q=80',
    tag: 'Learning path',
    accentClassName: 'from-indigo-500 to-blue-600',
    icon: Compass,
  },
  {
    title: 'Courses Library',
    description: 'Open your full course catalog and continue structured learning.',
    actionLabel: 'Open courses',
    href: '/courses',
    image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=600&q=80',
    tag: 'Course hub',
    accentClassName: 'from-slate-600 to-slate-800',
    icon: BookOpen,
  },
  {
    title: 'Code Playground',
    description: 'Test ideas in the editor while your lesson stays close by.',
    actionLabel: 'Open editor',
    href: '/editor',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    tag: 'Hands-on',
    accentClassName: 'from-sky-600 to-indigo-600',
    icon: Rocket,
  },
  {
    title: 'Study Momentum',
    description: 'Get nudges for practice, revision, and the next best action.',
    actionLabel: 'Build a plan',
    href: '/dashboard',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80',
    tag: 'Momentum',
    accentClassName: 'from-fuchsia-500 to-rose-500',
    icon: TimerReset,
  },
  {
    title: 'Beginner Boost',
    description: 'Start with simple explanations before moving into deeper lessons.',
    actionLabel: 'Start simple',
    href: '/topics',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    tag: 'Beginner friendly',
    accentClassName: 'from-emerald-500 to-lime-500',
    icon: GraduationCap,
  },
  {
    title: 'Project Ideas',
    description: 'Turn what you learned into something you can actually build.',
    actionLabel: 'Brainstorm',
    href: '/help-center?tool=chat',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80',
    tag: 'Portfolio',
    accentClassName: 'from-violet-500 to-indigo-500',
    icon: Lightbulb,
  },
  {
    title: 'Safe Progress',
    description: 'Find the next lesson, route, or recovery step when you feel stuck.',
    actionLabel: 'Get guidance',
    href: '/dashboard',
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=600&q=80',
    tag: 'Support',
    accentClassName: 'from-slate-700 to-slate-900',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Answers',
    description: 'Move from confusion to action with short, practical responses.',
    actionLabel: 'Ask now',
    href: '/help-center?tool=chat',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
    tag: 'Quick help',
    accentClassName: 'from-blue-500 to-cyan-500',
    icon: Sparkles,
  },
]

const lerp = (start: number, end: number, progress: number) => start * (1 - progress) + end * progress

function FlipCard({ item, index, onSelect, target }: FlipCardProps) {
  const Icon = item.icon
  const interactive = typeof onSelect === 'function'

  return (
    <motion.button
      type="button"
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: 'spring',
        stiffness: 44,
        damping: 16,
      }}
      style={{
        position: 'absolute',
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: 'preserve-3d',
        perspective: '1100px',
      }}
      className={cn(
        'group rounded-[1.35rem] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
        interactive ? 'cursor-pointer' : 'cursor-default'
      )}
      onClick={() => onSelect?.(item)}
      aria-label={`${item.title}. ${item.actionLabel}`}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180, y: -10 }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-[1.35rem] border border-white/60 bg-slate-200 shadow-[0_22px_50px_-28px_rgba(15,23,42,0.65)]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={item.image}
            alt={`${item.title} support card ${index + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/15 via-transparent to-slate-950/80" />
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
            <span className="rounded-full bg-white/88 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              {item.tag}
            </span>
            <span className="rounded-full bg-slate-950/65 p-1.5 text-white shadow-lg">
              <Icon className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="absolute inset-x-3 bottom-3">
            <p className="text-sm font-semibold leading-tight text-white">{item.title}</p>
          </div>
        </div>

        <div
          className={cn(
            'absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.35rem] border border-slate-200 bg-gradient-to-br p-3 text-white shadow-[0_22px_50px_-28px_rgba(15,23,42,0.65)]',
            item.accentClassName
          )}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-2xl bg-white/18 p-2 backdrop-blur-sm">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-white/80">
              DevHub lane
            </span>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold leading-tight">{item.title}</p>
            <p className="text-[11px] leading-relaxed text-white/86">{item.description}</p>
          </div>
          <div className="rounded-2xl bg-white/18 px-3 py-2 text-[11px] font-semibold tracking-[0.16em] text-white/92 backdrop-blur-sm">
            {item.actionLabel}
          </div>
        </div>
      </motion.div>
    </motion.button>
  )
}

export default function ScrollMorphHero({
  cards = defaultHelpCenterCards,
  title = 'Find the right DevHub help lane.',
  description = 'Scroll through support paths for AI help, explain-code sessions, quizzes, reading mode, and the learning routes that keep your momentum moving.',
  eyebrow = 'DevHub help center',
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  onCardSelect,
}: ScrollMorphHeroProps) {
  const displayCards = useMemo(() => cards.slice(0, 12), [cards])
  const [introPhase, setIntroPhase] = useState<AnimationPhase>('scatter')
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [morphValue, setMorphValue] = useState(0)
  const [rotateValue, setRotateValue] = useState(0)
  const [parallaxValue, setParallaxValue] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const current = containerRef.current
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    observer.observe(current)
    setContainerSize({
      width: current.offsetWidth,
      height: current.offsetHeight,
    })

    return () => observer.disconnect()
  }, [])

  const virtualScroll = useMotionValue(0)
  const scrollRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const updateScroll = (delta: number) => {
      const nextScroll = Math.min(Math.max(scrollRef.current + delta, 0), MAX_SCROLL)
      scrollRef.current = nextScroll
      virtualScroll.set(nextScroll)
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      updateScroll(event.deltaY)
    }

    let touchStartY = 0

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0
    }

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault()
      const currentY = event.touches[0]?.clientY ?? touchStartY
      const deltaY = touchStartY - currentY
      touchStartY = currentY
      updateScroll(deltaY)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [virtualScroll])

  const morphProgress = useTransform(virtualScroll, [0, 650], [0, 1])
  const smoothMorph = useSpring(morphProgress, { stiffness: 42, damping: 20 })
  const scrollRotate = useTransform(virtualScroll, [650, MAX_SCROLL], [0, 360])
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 42, damping: 20 })

  const mouseX = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseX.set(normalizedX * 90)
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX])

  useEffect(() => {
    const timerOne = window.setTimeout(() => setIntroPhase('line'), 450)
    const timerTwo = window.setTimeout(() => setIntroPhase('circle'), 2150)

    return () => {
      window.clearTimeout(timerOne)
      window.clearTimeout(timerTwo)
    }
  }, [])

  const scatterPositions = useMemo(
    () =>
      displayCards.map(() => ({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1100,
        rotation: (Math.random() - 0.5) * 170,
        scale: 0.55,
        opacity: 0,
      })),
    [displayCards]
  )

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on('change', setMorphValue)
    const unsubscribeRotate = smoothScrollRotate.on('change', setRotateValue)
    const unsubscribeParallax = smoothMouseX.on('change', setParallaxValue)

    return () => {
      unsubscribeMorph()
      unsubscribeRotate()
      unsubscribeParallax()
    }
  }, [smoothMorph, smoothMouseX, smoothScrollRotate])

  return (
    <div
      ref={containerRef}
      className="relative isolate overflow-hidden rounded-[2rem] border border-sky-100/80 bg-[#f8fbff]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_38%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(240,249,255,0.98)_44%,_rgba(224,242,254,0.98)_100%)]" />
      <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-sky-200/55 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative flex min-h-[880px] w-full flex-col items-center overflow-hidden px-4 py-8 sm:min-h-[920px] sm:px-6 lg:min-h-[980px] lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.85, delay: 0.12 }}
          className="absolute inset-x-0 top-[7%] z-30 px-4"
        >
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/78 p-6 shadow-[0_30px_90px_-44px_rgba(14,165,233,0.45)] backdrop-blur-xl md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  DevHub support lane
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                  {title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  {description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-700"
                  >
                    Talk to DevHub AI
                  </button>
                  <button
                    type="button"
                    onClick={onSecondaryAction}
                    className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                  >
                    Browse tutorials
                  </button>
                  <button
                    type="button"
                    onClick={onTertiaryAction}
                    className="rounded-full border border-sky-100 bg-sky-50 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                  >
                    Open editor
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { label: 'One place', value: 'AI, code help, quizzes, and learning support' },
                  { label: 'Hands-on', value: 'Move straight from help into editor or tutorials' },
                  { label: 'Built for DevHub', value: 'Matches your course, topic, and assistant flow' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-slate-200/80 bg-slate-50/80 px-4 py-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative mt-[290px] flex h-[560px] w-full items-center justify-center sm:mt-[320px] sm:h-[600px] lg:mt-[360px] lg:h-[640px]">
          {displayCards.map((item, index) => {
            let target = {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
            }

            if (introPhase === 'scatter') {
              target = scatterPositions[index]
            } else if (introPhase === 'line') {
              const spacing = 84
              const totalWidth = displayCards.length * spacing
              const lineX = index * spacing - totalWidth / 2
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 }
            } else {
              const isMobile = containerSize.width < 768
              const minDimension = Math.min(containerSize.width || 1, containerSize.height || 1)
              const circleRadius = Math.min(minDimension * 0.28, 280)
              const circleAngle = (index / displayCards.length) * 360
              const circleRadians = (circleAngle * Math.PI) / 180

              const circlePosition = {
                x: Math.cos(circleRadians) * circleRadius,
                y: Math.sin(circleRadians) * circleRadius,
                rotation: circleAngle + 90,
              }

              const baseRadius = Math.min(
                containerSize.width || 1,
                (containerSize.height || 1) * 1.5
              )
              const arcRadius = baseRadius * (isMobile ? 1.38 : 1.08)
              const arcApexY = (containerSize.height || 720) * (isMobile ? 0.54 : 0.48)
              const arcCenterY = arcApexY + arcRadius
              const spreadAngle = isMobile ? 110 : 138
              const startAngle = -90 - spreadAngle / 2
              const step = spreadAngle / Math.max(displayCards.length - 1, 1)

              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1)
              const boundedRotation = -scrollProgress * (spreadAngle * 0.82)
              const currentArcAngle = startAngle + index * step + boundedRotation
              const arcRadians = (currentArcAngle * Math.PI) / 180

              const arcPosition = {
                x: Math.cos(arcRadians) * arcRadius + parallaxValue,
                y: Math.sin(arcRadians) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.42 : 1.74,
              }

              target = {
                x: lerp(circlePosition.x, arcPosition.x, morphValue),
                y: lerp(circlePosition.y, arcPosition.y, morphValue),
                rotation: lerp(circlePosition.rotation, arcPosition.rotation, morphValue),
                scale: lerp(1, arcPosition.scale, morphValue),
                opacity: 1,
              }
            }

            return (
              <FlipCard
                key={`${item.title}-${index}`}
                item={item}
                index={index}
                target={target}
                onSelect={onCardSelect}
              />
            )
          })}
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <div className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 shadow-lg backdrop-blur-xl">
            Scroll or swipe inside this section
          </div>
        </div>
      </div>
    </div>
  )
}
