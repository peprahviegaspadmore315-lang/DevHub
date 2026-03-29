'use client'

import React, { useMemo, useState } from 'react'
import { Check, Eye, EyeOff, X } from 'lucide-react'

import { cn } from '@/lib/utils'

export const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[!-\/:-@[-`{-~]/, text: 'At least 1 special character' },
] as const

export type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5

export type Requirement = {
  met: boolean
  text: string
}

export type PasswordStrength = {
  score: StrengthScore
  requirements: Requirement[]
}

const STRENGTH_CONFIG = {
  colors: {
    0: 'bg-border',
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-amber-500',
    4: 'bg-lime-500',
    5: 'bg-emerald-500',
  } satisfies Record<StrengthScore, string>,
  texts: {
    0: 'Add a strong password',
    1: 'Weak password',
    2: 'Needs improvement',
    3: 'Almost there',
    4: 'Strong password',
    5: 'Excellent password',
  } satisfies Record<StrengthScore, string>,
} as const

export const getPasswordStrength = (password: string): PasswordStrength => {
  const requirements = PASSWORD_REQUIREMENTS.map((requirement) => ({
    met: requirement.regex.test(password),
    text: requirement.text,
  }))

  return {
    score: requirements.filter((requirement) => requirement.met).length as StrengthScore,
    requirements,
  }
}

export const isPasswordStrongEnough = (password: string, minimumScore = 4) =>
  getPasswordStrength(password).score >= minimumScore

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  showStrength?: boolean
  strengthTitle?: string
  variant?: 'default' | 'auth-dark'
  wrapperClassName?: string
  inputClassName?: string
}

const toneClasses = {
  default: {
    label: 'text-slate-700',
    input:
      'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15',
    icon: 'text-slate-500 hover:text-sky-600',
    helper: 'text-slate-500',
    unmet: 'text-slate-500',
    met: 'text-emerald-600',
    track: 'bg-slate-200',
  },
  'auth-dark': {
    label: 'text-gray-300',
    input:
      'border-cyan-500/20 bg-[#0a0a10]/80 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20',
    icon: 'text-gray-400 hover:text-cyan-400',
    helper: 'text-gray-400',
    unmet: 'text-gray-400',
    met: 'text-emerald-400',
    track: 'bg-white/10',
  },
} as const

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      value,
      onChange,
      label = 'Password',
      error,
      showStrength = false,
      strengthTitle = 'Must contain:',
      variant = 'default',
      id,
      className,
      wrapperClassName,
      inputClassName,
      placeholder = 'Password',
      onFocus,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false)
    const generatedId = React.useId()
    const inputId = id || generatedId
    const strengthId = `${inputId}-strength`
    const errorId = `${inputId}-error`
    const tone = toneClasses[variant]

    const passwordStrength = useMemo(() => getPasswordStrength(value), [value])
    const hasStartedTyping = value.length > 0
    const unmetRequirements = passwordStrength.requirements.filter(
      (requirement) => !requirement.met
    )
    const showStrengthFeedback = showStrength && hasStartedTyping
    const showRequirementList = showStrengthFeedback && unmetRequirements.length > 0
    const describedBy = [
      showStrengthFeedback ? strengthId : undefined,
      error ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={cn('space-y-2', wrapperClassName)}>
        <label htmlFor={inputId} className={cn('block text-sm font-medium', tone.label)}>
          {label}
        </label>

        <div className="relative">
          <input
            {...props}
            id={inputId}
            ref={ref}
            type={isVisible ? 'text' : 'password'}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={onFocus}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy || undefined}
            className={cn(
              'w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none transition-all duration-300',
              tone.input,
              error &&
                (variant === 'auth-dark'
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                  : 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'),
              inputClassName,
              className
            )}
          />
          <button
            type="button"
            onClick={() => setIsVisible((previous) => !previous)}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className={cn(
              'absolute inset-y-0 right-0 flex w-11 items-center justify-center transition-colors duration-300',
              tone.icon
            )}
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error ? (
          <p id={errorId} className="text-xs text-red-400">
            {error}
          </p>
        ) : null}

        {showStrengthFeedback ? (
          <div className="space-y-3 pt-1">
            <div
              className={cn('h-1 overflow-hidden rounded-full', tone.track)}
              role="progressbar"
              aria-valuenow={passwordStrength.score}
              aria-valuemin={0}
              aria-valuemax={5}
            >
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  STRENGTH_CONFIG.colors[passwordStrength.score]
                )}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>

            <p
              id={strengthId}
              className={cn('flex items-center justify-between text-sm font-medium', tone.helper)}
            >
              {showRequirementList ? (
                <>
                  <span>{strengthTitle}</span>
                  <span>{STRENGTH_CONFIG.texts[passwordStrength.score]}</span>
                </>
              ) : (
                <span className={cn('flex items-center gap-2', tone.met)}>
                  <Check size={16} />
                  Password looks good
                </span>
              )}
            </p>

            {showRequirementList ? (
              <ul className="space-y-1.5" aria-label="Password requirements">
                {unmetRequirements.map((requirement, index) => (
                  <li key={`${requirement.text}-${index}`} className="flex items-center gap-2">
                    <X size={16} className={cn('opacity-80', tone.unmet)} />
                    <span className={cn('text-xs', tone.unmet)}>{requirement.text}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
