import React, { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Code2, Sparkles } from 'lucide-react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LandingAction {
  label: string
  onClick: () => void
  variant?: ButtonProps['variant']
}

interface LandingMetric {
  value: string
  label: string
  icon?: React.ReactNode
}

interface DigitalSerenityProps {
  eyebrow?: string
  headline?: string
  supportingLine?: string
  subtitle?: string
  actions?: LandingAction[]
  metrics?: LandingMetric[]
  className?: string
  fullScreen?: boolean
}

interface Ripple {
  id: number
  x: number
  y: number
}

const defaultActions: LandingAction[] = [
  { label: 'Start Learning', onClick: () => undefined, variant: 'default' },
  { label: 'Open Editor', onClick: () => undefined, variant: 'outline' },
]

const defaultMetrics: LandingMetric[] = [
  {
    value: '50+',
    label: 'Guided lessons',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    value: '50+',
    label: 'Coding exercises',
    icon: <Code2 className="h-4 w-4" />,
  },
  {
    value: 'Live',
    label: 'AI support',
    icon: <Sparkles className="h-4 w-4" />,
  },
]

const splitWords = (text: string, startDelay: number) =>
  text.split(' ').map((word, index) => ({
    id: `${word}-${index}-${startDelay}`,
    word,
    delay: startDelay + index * 140,
  }))

const DigitalSerenity = ({
  eyebrow = 'DevHub first look',
  headline = 'Build with focus.',
  supportingLine = 'Learn with clarity.',
  subtitle = 'After the splash, DevHub should feel calm, guided, and ready for action. Start learning, open the editor, and move straight into practical progress.',
  actions = defaultActions,
  metrics = defaultMetrics,
  className,
  fullScreen = false,
}: DigitalSerenityProps) => {
  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: '50%',
    top: '50%',
    opacity: 0,
  })
  const [ripples, setRipples] = useState<Ripple[]>([])

  const headlineWords = useMemo(() => splitWords(headline, 250), [headline])
  const supportingWords = useMemo(() => splitWords(supportingLine, 900), [supportingLine])
  const eyebrowWords = useMemo(() => splitWords(eyebrow, 0), [eyebrow])

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()

    setMouseGradientStyle({
      left: `${event.clientX - bounds.left}px`,
      top: `${event.clientY - bounds.top}px`,
      opacity: 1,
    })
  }

  const handleMouseLeave = () => {
    setMouseGradientStyle((current) => ({ ...current, opacity: 0 }))
  }

  const handleRipple = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const ripple = {
      id: Date.now() + Math.random(),
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    }

    setRipples((current) => [...current, ripple])

    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== ripple.id))
    }, 900)
  }

  const pageStyles = `
    @keyframes devhubSerenityWord {
      0% {
        opacity: 0;
        transform: translateY(24px) scale(0.92);
        filter: blur(10px);
      }
      60% {
        opacity: 0.85;
        transform: translateY(8px) scale(0.98);
        filter: blur(2px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes devhubSerenityGrid {
      0% {
        opacity: 0;
        stroke-dashoffset: 800;
      }
      100% {
        opacity: 0.18;
        stroke-dashoffset: 0;
      }
    }

    @keyframes devhubSerenityFloat {
      0%, 100% {
        transform: translate3d(0, 0, 0);
        opacity: 0.18;
      }
      50% {
        transform: translate3d(10px, -18px, 0);
        opacity: 0.55;
      }
    }

    @keyframes devhubSerenityRipple {
      0% {
        opacity: 0.55;
        transform: translate(-50%, -50%) scale(0.2);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(18);
      }
    }

    @keyframes devhubSerenityPulse {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.65;
        transform: scale(1.08);
      }
    }

    .devhub-serenity-word {
      display: inline-block;
      opacity: 0;
      margin-right: 0.24em;
      animation: devhubSerenityWord 0.78s ease-out forwards;
      transition: transform 180ms ease, color 180ms ease, text-shadow 180ms ease;
    }

    .devhub-serenity-word:hover {
      color: #eff6ff;
      transform: translateY(-2px);
      text-shadow: 0 0 18px rgba(125, 211, 252, 0.28);
    }

    .devhub-serenity-grid-line {
      stroke: rgba(56, 189, 248, 0.34);
      stroke-width: 0.8;
      stroke-dasharray: 10 10;
      stroke-dashoffset: 800;
      animation: devhubSerenityGrid 1.8s ease-out forwards;
    }

    .devhub-serenity-detail-dot {
      fill: rgba(125, 211, 252, 0.7);
      animation: devhubSerenityPulse 3s ease-in-out infinite;
    }

    .devhub-serenity-floating {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: rgba(125, 211, 252, 0.8);
      box-shadow: 0 0 22px rgba(14, 165, 233, 0.45);
      animation: devhubSerenityFloat 4.6s ease-in-out infinite;
    }

    .devhub-serenity-ripple {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.35);
      border: 1px solid rgba(186, 230, 253, 0.55);
      pointer-events: none;
      animation: devhubSerenityRipple 0.9s ease-out forwards;
      z-index: 3;
    }
  `

  return (
    <>
      <style>{pageStyles}</style>
      <section
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-slate-100',
          fullScreen
            ? 'min-h-screen border-0 shadow-none'
            : 'min-h-[calc(100vh-8rem)] rounded-[2rem] border border-slate-200/80 shadow-[0_30px_90px_-40px_rgba(2,132,199,0.55)]',
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleRipple}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_36%),linear-gradient(135deg,rgba(2,6,23,0.92),rgba(3,7,18,0.96))]" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(125,211,252,0.06),transparent)]" />

        <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="devhub-serenity-grid" width="74" height="74" patternUnits="userSpaceOnUse">
              <path d="M 74 0 L 0 0 0 74" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#devhub-serenity-grid)" />
          <line x1="0" y1="18%" x2="100%" y2="18%" className="devhub-serenity-grid-line" style={{ animationDelay: '0.35s' }} />
          <line x1="0" y1="78%" x2="100%" y2="78%" className="devhub-serenity-grid-line" style={{ animationDelay: '0.7s' }} />
          <line x1="16%" y1="0" x2="16%" y2="100%" className="devhub-serenity-grid-line" style={{ animationDelay: '1.05s' }} />
          <line x1="84%" y1="0" x2="84%" y2="100%" className="devhub-serenity-grid-line" style={{ animationDelay: '1.4s' }} />
          <line x1="50%" y1="0" x2="50%" y2="100%" className="devhub-serenity-grid-line" style={{ animationDelay: '1.75s', opacity: 0.08 }} />
          <circle cx="16%" cy="18%" r="3" className="devhub-serenity-detail-dot" style={{ animationDelay: '1.8s' }} />
          <circle cx="84%" cy="18%" r="3" className="devhub-serenity-detail-dot" style={{ animationDelay: '2s' }} />
          <circle cx="16%" cy="78%" r="3" className="devhub-serenity-detail-dot" style={{ animationDelay: '2.2s' }} />
          <circle cx="84%" cy="78%" r="3" className="devhub-serenity-detail-dot" style={{ animationDelay: '2.4s' }} />
          <circle cx="50%" cy="50%" r="2.5" className="devhub-serenity-detail-dot" style={{ animationDelay: '2.6s' }} />
        </svg>

        <div className="devhub-serenity-floating left-[12%] top-[22%]" style={{ animationDelay: '0s' }} />
        <div className="devhub-serenity-floating left-[88%] top-[26%]" style={{ animationDelay: '0.6s' }} />
        <div className="devhub-serenity-floating left-[18%] top-[72%]" style={{ animationDelay: '1.2s' }} />
        <div className="devhub-serenity-floating left-[82%] top-[76%]" style={{ animationDelay: '1.8s' }} />

        <div
          className="pointer-events-none absolute h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18),rgba(14,165,233,0.1),transparent_68%)] blur-3xl transition-opacity duration-300 md:h-96 md:w-96"
          style={{
            left: mouseGradientStyle.left,
            top: mouseGradientStyle.top,
            opacity: mouseGradientStyle.opacity,
          }}
        />

        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="devhub-serenity-ripple"
            style={{ left: ripple.x, top: ripple.y }}
          />
        ))}

        <div
          className={cn(
            'relative z-10 flex flex-col justify-between px-6 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16',
            fullScreen ? 'min-h-screen' : 'min-h-[calc(100vh-8rem)]'
          )}
        >
          <div className="text-center">
            <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-y-2 text-[11px] uppercase tracking-[0.28em] text-sky-100/78 sm:text-xs">
              {eyebrowWords.map((item) => (
                <span
                  key={item.id}
                  className="devhub-serenity-word"
                  style={{ animationDelay: `${item.delay}ms` }}
                >
                  {item.word}
                </span>
              ))}
            </div>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-sky-200/70 to-transparent" />
          </div>

          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center">
            <div className="inline-flex items-center rounded-full border border-sky-300/18 bg-white/8 px-4 py-2 text-sm font-medium text-sky-100/88 backdrop-blur">
              The splash fades. Your next lesson is ready.
            </div>

            <div className="max-w-5xl space-y-6">
              <h1 className="text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
                {headlineWords.map((item) => (
                  <span
                    key={item.id}
                    className="devhub-serenity-word"
                    style={{ animationDelay: `${item.delay}ms` }}
                  >
                    {item.word}
                  </span>
                ))}
              </h1>

              <p className="text-xl font-light leading-relaxed tracking-[0.16em] text-sky-100/82 sm:text-2xl md:text-3xl">
                {supportingWords.map((item) => (
                  <span
                    key={item.id}
                    className="devhub-serenity-word"
                    style={{ animationDelay: `${item.delay}ms` }}
                  >
                    {item.word}
                  </span>
                ))}
              </p>

              <p className="mx-auto max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {actions.map((action, index) => (
                <Button
                  key={`${action.label}-${index}`}
                  onClick={action.onClick}
                  variant={action.variant}
                  size="lg"
                  className={cn(
                    'group rounded-full px-7 shadow-lg transition-all duration-300',
                    action.variant === 'outline'
                      ? 'border-sky-300/30 bg-slate-900/80 text-sky-100 shadow-[0_12px_35px_-22px_rgba(14,165,233,0.7)] backdrop-blur hover:border-sky-200/55 hover:bg-sky-500/16 hover:text-white'
                      : 'bg-sky-500 text-white hover:bg-sky-400'
                  )}
                >
                  <span>{action.label}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              ))}
            </div>

            <div className="grid w-full gap-4 md:grid-cols-3">
              {metrics.map((metric, index) => (
                <div
                  key={`${metric.label}-${index}`}
                  className="rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-5 text-left shadow-[0_12px_40px_-28px_rgba(56,189,248,0.65)] backdrop-blur"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/12 text-sky-200">
                    {metric.icon}
                  </div>
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 h-px w-20 bg-gradient-to-r from-transparent via-sky-200/70 to-transparent" />
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] uppercase tracking-[0.28em] text-slate-300/88 sm:text-xs">
              {splitWords('Learn. Build. Design. Keep going.', 1700).map((item) => (
                <span
                  key={item.id}
                  className="devhub-serenity-word"
                  style={{ animationDelay: `${item.delay}ms` }}
                >
                  {item.word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DigitalSerenity
