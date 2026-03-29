import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DevHubWordmarkTone = 'brand' | 'light' | 'dark'

interface DevHubWordmarkProps {
  as?: ElementType
  className?: string
  devClassName?: string
  hubClassName?: string
  suffix?: ReactNode
  suffixClassName?: string
  tone?: DevHubWordmarkTone
}

const toneClasses: Record<DevHubWordmarkTone, { dev: string; hub: string; suffix: string }> = {
  brand: {
    dev: 'text-sky-500',
    hub: 'text-cyan-600',
    suffix: 'text-slate-900',
  },
  light: {
    dev: 'text-sky-300',
    hub: 'text-cyan-400',
    suffix: 'text-white',
  },
  dark: {
    dev: 'text-sky-600',
    hub: 'text-cyan-700',
    suffix: 'text-slate-900',
  },
}

const DevHubWordmark = ({
  as,
  className,
  devClassName,
  hubClassName,
  suffix,
  suffixClassName,
  tone = 'brand',
}: DevHubWordmarkProps) => {
  const Component = as || 'span'
  const toneConfig = toneClasses[tone]

  return (
    <Component className={cn('inline-flex items-baseline', className)}>
      <span className={cn(toneConfig.dev, devClassName)}>Dev</span>
      <span className={cn(toneConfig.hub, hubClassName)}>Hub</span>
      {suffix ? <span className={cn(toneConfig.suffix, suffixClassName)}>{suffix}</span> : null}
    </Component>
  )
}

export default DevHubWordmark
