import * as React from 'react'
import { PinInput } from '@ark-ui/react/pin-input'
import { Loader2, MailCheck, RotateCcw } from 'lucide-react'

import { cn } from '@/lib/utils'

interface OtpInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  length?: number
  title?: string
  description?: string
  hint?: React.ReactNode
  resendLabel?: string
  onValueChange?: (value: string) => void
  onValueComplete?: (value: string) => void
  onResend?: () => void
  resendDisabled?: boolean
  showCard?: boolean
}

export function OtpInput({
  value = '',
  length = 4,
  title = 'Enter Your Verification Code',
  description = 'We sent a secure verification code to your email. Enter it below to continue.',
  hint,
  resendLabel = 'Resend code',
  onValueChange,
  onValueComplete,
  onResend,
  resendDisabled = false,
  showCard = true,
  className,
  ...props
}: OtpInputProps) {
  const normalizedValue = React.useMemo(
    () => value.replace(/\D/g, '').slice(0, length),
    [length, value]
  )
  const paddedValue = React.useMemo(
    () => Array.from({ length }, (_, index) => normalizedValue[index] ?? ''),
    [length, normalizedValue]
  )

  return (
    <div
      className={cn(
        'w-full',
        showCard &&
          'space-y-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg dark:border-slate-700/60 dark:bg-slate-900/80',
        !showCard && 'space-y-5',
        className
      )}
      {...props}
    >
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 shadow-[0_12px_30px_-20px_rgba(14,165,233,0.9)]">
          <MailCheck className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="mx-auto max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <PinInput.Root
        otp
        value={paddedValue}
        onValueChange={(details) => onValueChange?.(details.valueAsString)}
        onValueComplete={(details) => onValueComplete?.(details.valueAsString)}
      >
        <PinInput.Label className="sr-only">Verification Code</PinInput.Label>
        <PinInput.Control className="flex justify-center gap-3 sm:gap-4">
          {Array.from({ length }, (_, index) => (
            <PinInput.Input
              key={index}
              index={index}
              className={cn(
                'h-14 w-12 rounded-2xl border border-slate-200 bg-white text-center text-lg font-semibold text-slate-900 outline-none transition-all duration-200',
                'focus:border-sky-400 focus:bg-sky-50 focus:ring-4 focus:ring-sky-500/15',
                'dark:border-slate-700 dark:bg-slate-950/70 dark:text-white dark:focus:border-sky-400 dark:focus:bg-sky-950/40'
              )}
            />
          ))}
        </PinInput.Control>
        <PinInput.HiddenInput />
      </PinInput.Root>

      <div className="space-y-2 text-center">
        {hint ? <div className="text-sm text-slate-500 dark:text-slate-400">{hint}</div> : null}
        {onResend ? (
          <button
            type="button"
            onClick={onResend}
            disabled={resendDisabled}
            className="inline-flex items-center gap-2 text-sm font-medium text-sky-600 transition hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-sky-300 dark:hover:text-sky-200"
          >
            {resendDisabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            {resendLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default OtpInput
