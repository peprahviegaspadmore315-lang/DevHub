import React, { useEffect, useState } from 'react'
import { ArrowRight, Award, BookOpen, Code2, Lightbulb, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface InteractiveSelectorItem {
  title: string
  description: string
  image: string
  icon: React.ReactNode
  link: string
  meta?: string
}

interface InteractiveSelectorProps {
  heading?: string
  description?: string
  items?: InteractiveSelectorItem[]
}

const defaultItems: InteractiveSelectorItem[] = [
  {
    title: 'HTML Foundations',
    description: 'Build strong markup habits with beginner-friendly lessons and hands-on examples.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    icon: <BookOpen className="h-6 w-6 text-white" />,
    link: '/courses',
    meta: 'Beginner path',
  },
  {
    title: 'CSS Styling',
    description: 'Learn modern layout, spacing, and visual polish for interfaces that feel intentional.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    icon: <Lightbulb className="h-6 w-6 text-white" />,
    link: '/courses',
    meta: 'Design skills',
  },
  {
    title: 'JavaScript Motion',
    description: 'Move from static pages to interactive behavior with practical exercises and examples.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    icon: <Code2 className="h-6 w-6 text-white" />,
    link: '/courses',
    meta: 'Interactive web',
  },
  {
    title: 'Python Practice',
    description: 'Strengthen problem-solving with readable code, guided lessons, and repeatable drills.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    icon: <Sparkles className="h-6 w-6 text-white" />,
    link: '/courses',
    meta: 'Programming track',
  },
  {
    title: 'Project Momentum',
    description: 'Jump between paths, keep your progress visible, and stay moving through the catalog.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    icon: <Award className="h-6 w-6 text-white" />,
    link: '/courses',
    meta: 'Build confidence',
  },
]

const InteractiveSelector = ({
  heading = 'Choose your next learning path',
  description = 'Preview a few standout tracks before you dive into the full DevHub course library.',
  items = defaultItems,
}: InteractiveSelectorProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([])

  useEffect(() => {
    setAnimatedOptions([])

    const timers = items.map((_, index) =>
      window.setTimeout(() => {
        setAnimatedOptions((prev) => [...prev, index])
      }, 160 * index)
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [items.length])

  useEffect(() => {
    if (!items.length) {
      return
    }

    if (activeIndex > items.length - 1) {
      setActiveIndex(0)
    }
  }, [activeIndex, items.length])

  if (!items.length) {
    return null
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#172554_55%,#0f766e_100%)] px-4 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.18),transparent_40%)]" />
      <div className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
            Course Spotlight
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            {heading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-8 overflow-x-auto pb-2">
          <div className="flex min-h-[420px] min-w-[720px] items-stretch gap-2 rounded-[1.75rem] border border-white/10 bg-white/5 p-2 backdrop-blur-sm md:min-w-0 md:gap-3">
            {items.map((item, index) => {
              const isActive = activeIndex === index
              const isVisible = animatedOptions.includes(index)

              return (
                <div
                  key={`${item.title}-${index}`}
                  className={cn(
                    'relative flex cursor-pointer flex-col justify-end overflow-hidden rounded-[1.35rem] border transition-all duration-700 ease-out',
                    isActive ? 'border-white/50' : 'border-white/10'
                  )}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.05) 0%, rgba(2,6,23,0.16) 34%, rgba(2,6,23,0.92) 100%), url('${item.image}')`,
                    backgroundSize: isActive ? 'cover' : 'auto 135%',
                    backgroundPosition: isActive ? 'center' : '60% center',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-56px)',
                    minWidth: '72px',
                    boxShadow: isActive
                      ? '0 25px 65px rgba(2, 6, 23, 0.42)'
                      : '0 12px 30px rgba(2, 6, 23, 0.2)',
                    flex: isActive ? '6 1 0%' : '1.15 1 0%',
                    zIndex: isActive ? 10 : 1,
                  }}
                  onClick={() => setActiveIndex(index)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setActiveIndex(index)
                    }
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30" />

                  <div
                    className="absolute left-4 right-4 top-4 flex items-center justify-between transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0.72,
                      transform: isActive ? 'translateY(0)' : 'translateY(-6px)',
                    }}
                  >
                    <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                      {item.meta ?? 'Featured'}
                    </span>
                  </div>

                  <div className="absolute inset-x-4 bottom-4 z-10">
                    <div className="flex items-end gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/35 backdrop-blur-md">
                        {item.icon}
                      </div>

                      <div className="min-w-0">
                        <div
                          className="text-lg font-bold transition-all duration-700 ease-out md:text-2xl"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'translateX(0)' : 'translateX(24px)',
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          className="mt-1 max-w-xl text-sm text-slate-200 transition-all duration-700 ease-out md:text-base"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'translateX(0)' : 'translateX(24px)',
                          }}
                        >
                          {item.description}
                        </div>
                        <div
                          className="mt-4 transition-all duration-700 ease-out"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'translateX(0)' : 'translateX(24px)',
                            pointerEvents: isActive ? 'auto' : 'none',
                          }}
                        >
                          <Button
                            asChild
                            variant="secondary"
                            className="border-0 bg-white text-slate-900 hover:bg-slate-100"
                          >
                            <Link to={item.link} className="inline-flex items-center gap-2">
                              <span>Open course</span>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-slate-300 md:hidden">
          Swipe horizontally to preview more learning paths.
        </p>
      </div>
    </section>
  )
}

export default InteractiveSelector
