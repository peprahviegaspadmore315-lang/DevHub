'use client'

import type { ReactNode } from 'react'

import { Award as AwardIcon, Sparkles, Star } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface AwardsComponentProps {
  variant?: 'stamp' | 'award' | 'certificate' | 'badge' | 'sticker' | 'id-card'
  title: string
  subtitle?: string
  description?: string
  date?: string
  recipient?: string
  level?: 'bronze' | 'silver' | 'gold' | 'platinum'
  className?: string
  showIcon?: boolean
  customIcon?: ReactNode
}

const levelThemes = {
  bronze: {
    gradient: 'from-amber-500 to-orange-700',
    soft: 'from-amber-100 via-orange-50 to-white dark:from-amber-950/70 dark:via-orange-950/30 dark:to-slate-950',
    ring: 'ring-amber-300/70 dark:ring-amber-700/60',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-900/60',
  },
  silver: {
    gradient: 'from-slate-300 to-slate-500',
    soft: 'from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950',
    ring: 'ring-slate-300/70 dark:ring-slate-700/60',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-800',
  },
  gold: {
    gradient: 'from-yellow-400 to-amber-600',
    soft: 'from-amber-100 via-yellow-50 to-white dark:from-amber-950/70 dark:via-yellow-950/20 dark:to-slate-950',
    ring: 'ring-yellow-300/70 dark:ring-yellow-700/60',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-yellow-200 dark:border-yellow-900/60',
  },
  platinum: {
    gradient: 'from-sky-300 via-cyan-200 to-slate-400',
    soft: 'from-sky-100 via-cyan-50 to-white dark:from-cyan-950/60 dark:via-sky-950/20 dark:to-slate-950',
    ring: 'ring-cyan-300/70 dark:ring-cyan-700/60',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-900/60',
  },
} as const

const variantDefaults: Record<
  NonNullable<AwardsComponentProps['variant']>,
  { icon: ReactNode; label: string }
> = {
  stamp: { icon: <Star className="h-7 w-7 fill-current" />, label: 'Stamp' },
  award: { icon: <AwardIcon className="h-8 w-8" />, label: 'Award' },
  certificate: { icon: <AwardIcon className="h-6 w-6" />, label: 'Certificate' },
  badge: { icon: <Sparkles className="h-6 w-6" />, label: 'Badge' },
  sticker: { icon: <Star className="h-6 w-6 fill-current" />, label: 'Sticker' },
  'id-card': { icon: <AwardIcon className="h-6 w-6" />, label: 'Credential' },
}

const renderIcon = ({
  customIcon,
  showIcon,
  variant,
  className,
}: {
  customIcon?: ReactNode
  showIcon?: boolean
  variant: NonNullable<AwardsComponentProps['variant']>
  className?: string
}) => {
  if (!showIcon && !customIcon) {
    return null
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {customIcon ?? variantDefaults[variant].icon}
    </div>
  )
}

export function Awards({
  variant = 'badge',
  title,
  subtitle,
  description,
  date,
  recipient,
  level = 'gold',
  className,
  showIcon = true,
  customIcon,
}: AwardsComponentProps) {
  const theme = levelThemes[level]

  if (variant === 'stamp') {
    return (
      <div className={cn('mx-auto flex items-center justify-center', className)}>
        <div
          className={cn(
            'relative flex h-52 w-52 items-center justify-center rounded-full border-[10px] border-dashed bg-gradient-to-br p-6 text-center shadow-[0_30px_90px_-50px_rgba(15,23,42,0.55)]',
            theme.soft,
            theme.border,
            theme.ring,
            'ring-4',
          )}
        >
          <div className="absolute inset-3 rounded-full border border-dashed border-current/25" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            {renderIcon({
              customIcon,
              showIcon,
              variant,
              className: cn(
                'h-14 w-14 rounded-full bg-gradient-to-br text-white shadow-lg',
                theme.gradient,
              ),
            })}
            <p className={cn('text-[11px] font-semibold uppercase tracking-[0.28em]', theme.text)}>
              {variantDefaults[variant].label}
            </p>
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h3>
            {subtitle ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
            ) : null}
            {recipient ? (
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {recipient}
              </p>
            ) : null}
            {date ? (
              <p className="text-xs italic text-slate-500 dark:text-slate-400">{date}</p>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'award') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-[32px] border bg-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.55)] dark:bg-slate-950',
          theme.border,
          className,
        )}
      >
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-90', theme.soft)} />
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/50 blur-3xl dark:bg-white/5" />
        <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  'inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white',
                  theme.gradient,
                )}
              >
                {level}
              </span>
              {date ? (
                <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {date}
                </span>
              ) : null}
            </div>

            <h3 className="mt-5 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-3 text-lg font-medium text-slate-700 dark:text-slate-200">
                {subtitle}
              </p>
            ) : null}
            {description ? (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              {recipient ? (
                <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
                  Awarded to {recipient}
                </span>
              ) : null}
              <span className="text-slate-500 dark:text-slate-400">
                DevHub verified achievement
              </span>
            </div>
          </div>

          {renderIcon({
            customIcon,
            showIcon,
            variant,
            className: cn(
              'h-24 w-24 shrink-0 rounded-[28px] bg-gradient-to-br text-white shadow-xl sm:h-28 sm:w-28',
              theme.gradient,
            ),
          })}
        </div>
      </div>
    )
  }

  if (variant === 'certificate') {
    return (
      <div
        className={cn(
          'rounded-[30px] border-2 border-dashed bg-gradient-to-br p-3 shadow-[0_24px_80px_-55px_rgba(15,23,42,0.45)]',
          theme.soft,
          theme.border,
          className,
        )}
      >
        <div className="rounded-[24px] border border-slate-200 bg-white/95 p-6 text-center dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mb-4 flex items-center justify-center gap-3">
            {renderIcon({
              customIcon,
              showIcon,
              variant,
              className: cn(
                'h-12 w-12 rounded-2xl bg-gradient-to-br text-white shadow-lg',
                theme.gradient,
              ),
            })}
            <div className="text-left">
              <p className={cn('text-xs font-semibold uppercase tracking-[0.24em]', theme.text)}>
                DevHub certificate
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{level} tier</p>
            </div>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          ) : null}

          {recipient ? (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Issued to
              </p>
              <p className="mt-2 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
                {recipient}
              </p>
            </div>
          ) : null}

          {description ? (
            <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          ) : null}

          <div className="mt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Verified by DevHub</span>
            {date ? <span>{date}</span> : null}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'badge') {
    return (
      <div
        className={cn(
          'overflow-hidden rounded-[28px] border bg-white/95 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-950/95',
          theme.border,
          className,
        )}
      >
        <div className="flex gap-4 p-5">
          {renderIcon({
            customIcon,
            showIcon,
            variant,
            className: cn(
              'h-16 w-16 shrink-0 rounded-3xl bg-gradient-to-br text-white shadow-lg',
              theme.gradient,
            ),
          })}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]',
                  theme.text,
                  'bg-slate-100 dark:bg-slate-900',
                )}
              >
                {level}
              </span>
              {date ? (
                <span className="text-xs text-slate-500 dark:text-slate-400">{date}</span>
              ) : null}
            </div>

            <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                {subtitle}
              </p>
            ) : null}
            {description ? (
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            ) : null}
            {recipient ? (
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {recipient}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'sticker') {
    return (
      <div className={cn('inline-flex -rotate-3 transform', className)}>
        <div
          className={cn(
            'rounded-[32px] border-4 border-white bg-gradient-to-br px-6 py-5 text-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.65)] dark:border-slate-950',
            theme.gradient,
          )}
        >
          <div className="flex items-center gap-3">
            {renderIcon({
              customIcon,
              showIcon,
              variant,
              className: 'h-12 w-12 rounded-2xl bg-white/15',
            })}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/75">
                DevHub sticker
              </p>
              <h3 className="text-3xl font-black tracking-tight">{title}</h3>
              {subtitle ? <p className="mt-1 text-sm text-white/80">{subtitle}</p> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'id-card') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-[30px] border bg-slate-950 text-white shadow-[0_28px_80px_-50px_rgba(15,23,42,0.75)]',
          theme.border,
          className,
        )}
      >
        <div className={cn('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', theme.gradient)} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,1))]" />
        <div className="relative flex min-h-[20rem] flex-col justify-between p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/80">
                DevHub credential
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-tight">{title}</h3>
              {subtitle ? (
                <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
              ) : null}
            </div>
            {renderIcon({
              customIcon,
              showIcon,
              variant,
              className: cn(
                'h-14 w-14 rounded-2xl bg-gradient-to-br text-white shadow-lg',
                theme.gradient,
              ),
            })}
          </div>

          <div className="space-y-4">
            {description ? (
              <p className="max-w-xs text-sm leading-6 text-slate-300">{description}</p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              {recipient ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Recipient</p>
                  <p className="mt-2 text-sm font-semibold text-white">{recipient}</p>
                </div>
              ) : null}
              {date ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Issued</p>
                  <p className="mt-2 text-sm font-semibold text-white">{date}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Awards
