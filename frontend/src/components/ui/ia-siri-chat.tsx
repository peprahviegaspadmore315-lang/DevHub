import { Loader2, Mic, MicOff, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/utils'

export type VoiceChatMode =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'paused'

interface VoiceChatProps {
  onStart?: () => void
  onStop?: (duration: number) => void
  onVolumeChange?: (volume: number) => void
  className?: string
  demoMode?: boolean
  mode?: VoiceChatMode
  durationSeconds?: number
  onToggle?: () => void
  disabled?: boolean
  title?: string
  hint?: string
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  velocityX: number
  velocityY: number
}

const STATUS_STYLES: Record<
  VoiceChatMode,
  {
    label: string
    accent: string
    pill: string
    glow: string
    bar: string
  }
> = {
  idle: {
    label: 'Ready',
    accent: 'text-slate-300',
    pill: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
    glow: 'from-sky-500/10 via-cyan-400/5 to-violet-500/10',
    bar: 'bg-slate-500/35',
  },
  listening: {
    label: 'Listening',
    accent: 'text-sky-300',
    pill: 'bg-sky-500/15 text-sky-200 border-sky-400/30',
    glow: 'from-sky-500/25 via-cyan-400/15 to-violet-500/15',
    bar: 'bg-sky-400',
  },
  processing: {
    label: 'Processing',
    accent: 'text-amber-300',
    pill: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
    glow: 'from-amber-400/20 via-orange-400/10 to-violet-500/10',
    bar: 'bg-amber-400',
  },
  speaking: {
    label: 'Reading Aloud',
    accent: 'text-cyan-300',
    pill: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30',
    glow: 'from-cyan-400/20 via-sky-400/15 to-violet-500/18',
    bar: 'bg-cyan-400',
  },
  paused: {
    label: 'Paused',
    accent: 'text-violet-300',
    pill: 'bg-violet-500/15 text-violet-200 border-violet-400/30',
    glow: 'from-violet-500/18 via-sky-500/10 to-cyan-400/12',
    bar: 'bg-violet-400',
  },
}

const createParticles = () =>
  Array.from({ length: 18 }, (_, index) => ({
    id: index,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.35 + 0.08,
    velocityX: (Math.random() - 0.5) * 0.18,
    velocityY: (Math.random() - 0.5) * 0.2,
  }))

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function VoiceChat({
  onStart,
  onStop,
  onVolumeChange,
  className,
  demoMode = false,
  mode,
  durationSeconds = 0,
  onToggle,
  disabled = false,
  title,
  hint,
}: VoiceChatProps) {
  const [internalMode, setInternalMode] = useState<VoiceChatMode>('idle')
  const [internalDuration, setInternalDuration] = useState(0)
  const [volume, setVolume] = useState(0)
  const [particles, setParticles] = useState<Particle[]>(() => createParticles())
  const [waveformData, setWaveformData] = useState<number[]>(Array.from({ length: 24 }, () => 6))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const particleFrameRef = useRef<number | null>(null)
  const demoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resolvedMode = demoMode ? internalMode : mode ?? 'idle'
  const displayDuration = demoMode ? internalDuration : durationSeconds
  const statusStyle = STATUS_STYLES[resolvedMode]

  useEffect(() => {
    const animateParticles = () => {
      setParticles((currentParticles) =>
        currentParticles.map((particle) => ({
          ...particle,
          x: (particle.x + particle.velocityX + 100) % 100,
          y: (particle.y + particle.velocityY + 100) % 100,
          opacity: Math.min(0.42, Math.max(0.06, particle.opacity + (Math.random() - 0.5) * 0.015)),
        })),
      )

      particleFrameRef.current = window.requestAnimationFrame(animateParticles)
    }

    particleFrameRef.current = window.requestAnimationFrame(animateParticles)

    return () => {
      if (particleFrameRef.current) {
        window.cancelAnimationFrame(particleFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!demoMode) {
      return
    }

    let cancelled = false

    const runDemo = async () => {
      setInternalMode('listening')
      onStart?.()

      await new Promise((resolve) => {
        demoTimeoutRef.current = setTimeout(resolve, 2200)
      })
      if (cancelled) return

      setInternalMode('processing')
      onStop?.(internalDuration)

      await new Promise((resolve) => {
        demoTimeoutRef.current = setTimeout(resolve, 1200)
      })
      if (cancelled) return

      setInternalMode('speaking')

      await new Promise((resolve) => {
        demoTimeoutRef.current = setTimeout(resolve, 2600)
      })
      if (cancelled) return

      setInternalMode('idle')
      setInternalDuration(0)

      demoTimeoutRef.current = setTimeout(runDemo, 1600)
    }

    demoTimeoutRef.current = setTimeout(runDemo, 700)

    return () => {
      cancelled = true
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current)
      }
    }
  }, [demoMode, internalDuration, onStart, onStop])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const shouldAnimate =
      resolvedMode === 'listening' ||
      resolvedMode === 'speaking' ||
      resolvedMode === 'processing' ||
      resolvedMode === 'paused'

    if (!shouldAnimate) {
      setWaveformData(Array.from({ length: 24 }, () => 6))
      setVolume(0)
      onVolumeChange?.(0)
      return
    }

    intervalRef.current = setInterval(() => {
      const baseAmplitude =
        resolvedMode === 'processing'
          ? 24
          : resolvedMode === 'paused'
            ? 14
            : resolvedMode === 'listening'
              ? 58
              : 72

      const nextWaveform = Array.from({ length: 24 }, (_, index) => {
        const oscillation = Math.sin((Date.now() / 210) + index * 0.75)
        const randomLift = Math.random() * baseAmplitude * 0.42
        return Math.max(8, baseAmplitude * 0.42 + oscillation * baseAmplitude * 0.22 + randomLift)
      })

      const nextVolume =
        resolvedMode === 'paused'
          ? 18
          : resolvedMode === 'processing'
            ? 34 + Math.random() * 12
            : resolvedMode === 'listening'
              ? 46 + Math.random() * 34
              : 54 + Math.random() * 28

      setWaveformData(nextWaveform)
      setVolume(nextVolume)
      onVolumeChange?.(nextVolume)
    }, 130)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [resolvedMode, onVolumeChange])

  useEffect(() => {
    if (!demoMode) {
      return
    }

    if (resolvedMode === 'listening' || resolvedMode === 'speaking' || resolvedMode === 'processing') {
      const timer = window.setInterval(() => {
        setInternalDuration((current) => current + 1)
      }, 1000)

      return () => {
        window.clearInterval(timer)
      }
    }
  }, [demoMode, resolvedMode])

  const handleToggle = () => {
    if (disabled) {
      return
    }

    if (demoMode) {
      return
    }

    onToggle?.()
  }

  const buttonIcon = useMemo(() => {
    switch (resolvedMode) {
      case 'processing':
        return <Loader2 className="h-9 w-9 animate-spin text-amber-300" />
      case 'speaking':
        return <Volume2 className="h-9 w-9 text-cyan-200" />
      case 'listening':
        return <Mic className="h-9 w-9 text-sky-200" />
      case 'paused':
        return <MicOff className="h-9 w-9 text-violet-200" />
      default:
        return <Mic className="h-9 w-9 text-slate-300" />
    }
  }, [resolvedMode])

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[28px] border border-sky-400/15 bg-[linear-gradient(180deg,rgba(5,10,20,0.96),rgba(6,12,24,0.92))] p-5 text-white shadow-[0_18px_50px_-30px_rgba(14,165,233,0.55)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-cyan-300/35"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
            }}
            animate={{ scale: [1, 1.45, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: particle.id * 0.08 }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className={cn(
            'absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r blur-3xl',
            statusStyle.glow,
          )}
          animate={{
            scale: resolvedMode === 'idle' ? [1, 1.04, 1] : [1, 1.15, 1],
            opacity: resolvedMode === 'idle' ? [0.2, 0.28, 0.2] : [0.34, 0.52, 0.34],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300/85">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            <span>DevHub Voice AI</span>
          </div>
          <span
            className={cn(
              'rounded-full border px-2.5 py-1 text-[11px] font-medium',
              statusStyle.pill,
            )}
          >
            {statusStyle.label}
          </span>
        </div>

        <motion.button
          type="button"
          onClick={handleToggle}
          disabled={disabled || (!onToggle && !demoMode)}
          whileHover={disabled ? undefined : { scale: 1.03 }}
          whileTap={disabled ? undefined : { scale: 0.96 }}
          className={cn(
            'relative flex h-24 w-24 items-center justify-center rounded-full border bg-gradient-to-br from-white/10 to-white/[0.04] backdrop-blur-md transition',
            resolvedMode === 'listening' && 'border-sky-400/60 shadow-[0_0_45px_-12px_rgba(56,189,248,0.7)]',
            resolvedMode === 'processing' && 'border-amber-400/60 shadow-[0_0_45px_-12px_rgba(251,191,36,0.65)]',
            resolvedMode === 'speaking' && 'border-cyan-400/60 shadow-[0_0_45px_-12px_rgba(34,211,238,0.75)]',
            resolvedMode === 'paused' && 'border-violet-400/60 shadow-[0_0_45px_-12px_rgba(167,139,250,0.65)]',
            resolvedMode === 'idle' && 'border-slate-700/80',
            disabled && 'cursor-not-allowed opacity-70',
          )}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={resolvedMode}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
            >
              {buttonIcon}
            </motion.span>
          </AnimatePresence>

          <AnimatePresence>
            {(resolvedMode === 'listening' || resolvedMode === 'speaking') && (
              <>
                <motion.span
                  className={cn(
                    'absolute inset-0 rounded-full border',
                    resolvedMode === 'listening' ? 'border-sky-400/35' : 'border-cyan-400/35',
                  )}
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.55 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.7, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.span
                  className={cn(
                    'absolute inset-0 rounded-full border',
                    resolvedMode === 'listening' ? 'border-sky-400/20' : 'border-cyan-400/20',
                  )}
                  initial={{ opacity: 0.45, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.9 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.7, delay: 0.38, repeat: Infinity, ease: 'easeOut' }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="flex h-16 w-full items-end justify-center gap-1.5 px-2">
          {waveformData.map((height, index) => (
            <motion.span
              key={index}
              className={cn('w-1.5 rounded-full', statusStyle.bar)}
              animate={{
                height,
                opacity: resolvedMode === 'idle' ? 0.25 : 1,
              }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
            />
          ))}
        </div>

        <div className="space-y-1.5 text-center">
          <p className={cn('text-lg font-semibold tracking-tight', statusStyle.accent)}>
            {title ?? (resolvedMode === 'idle' ? 'Tap to use voice commands' : STATUS_STYLES[resolvedMode].label)}
          </p>
          <p className="max-w-xs text-sm leading-6 text-slate-400">
            {hint ??
              (resolvedMode === 'speaking'
                ? 'DevHub is reading your lesson content aloud.'
                : resolvedMode === 'listening'
                  ? 'Listening for commands like "Start reading" or "Stop reading".'
                  : resolvedMode === 'processing'
                    ? 'Preparing your reading assistant response.'
                    : resolvedMode === 'paused'
                      ? 'Reading is paused. Resume whenever you are ready.'
                      : 'Use your voice or the reading controls below to start playback.')}
          </p>
          <p className="font-mono text-xs tracking-[0.28em] text-slate-500">
            {formatTime(displayDuration)}
          </p>
        </div>

        <div className="flex w-full items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2">
          <VolumeX className="h-4 w-4 text-slate-400" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <motion.span
              className={cn('block h-full rounded-full', statusStyle.bar)}
              animate={{ width: `${volume}%` }}
              transition={{ duration: 0.16 }}
            />
          </div>
          <Volume2 className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </div>
  )
}

export default function VoiceChatDemo() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-sm">
        <VoiceChat
          onStart={() => console.log('Voice recording started')}
          onStop={(duration) => console.log(`Voice recording stopped after ${duration}s`)}
          onVolumeChange={(volume) => console.log(`Volume: ${Math.round(volume)}%`)}
          demoMode
        />
      </div>
    </div>
  )
}
