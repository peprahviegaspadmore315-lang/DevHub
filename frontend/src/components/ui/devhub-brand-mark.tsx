import { useState } from 'react'

import { cn } from '@/lib/utils'

type DevHubBrandMarkSize = 'sm' | 'md' | 'lg'

interface DevHubBrandMarkProps {
  size?: DevHubBrandMarkSize
  className?: string
}

const containerClasses: Record<DevHubBrandMarkSize, string> = {
  sm: 'size-12 rounded-2xl',
  md: 'size-16 rounded-[1.35rem]',
  lg: 'size-24 rounded-3xl',
}

const imageClasses: Record<DevHubBrandMarkSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
}

const BRAND_MARK_PRIMARY_SRC = '/devhubsymbol.png'
const BRAND_MARK_FALLBACK_SRC = '/devhubsymbolmain.png'

const DevHubBrandMark = ({
  size = 'md',
  className,
}: DevHubBrandMarkProps) => {
  const [brandImageSrc, setBrandImageSrc] = useState(BRAND_MARK_PRIMARY_SRC)
  const [hasImageFailed, setHasImageFailed] = useState(false)

  return (
    <div
      className={cn(
        'grid shrink-0 place-content-center overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-cyan-600 shadow-lg shadow-sky-900/20 ring-1 ring-white/25',
        containerClasses[size],
        className
      )}
    >
      {!hasImageFailed ? (
        <img
          src={brandImageSrc}
          alt="DevHub"
          className={cn('object-contain drop-shadow-sm', imageClasses[size])}
          onError={() => {
            if (brandImageSrc !== BRAND_MARK_FALLBACK_SRC) {
              setBrandImageSrc(BRAND_MARK_FALLBACK_SRC)
              return
            }

            setHasImageFailed(true)
          }}
        />
      ) : (
        <span
          className={cn(
            'select-none font-black uppercase tracking-[0.16em] text-white drop-shadow-sm',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-2xl',
          )}
        >
          DH
        </span>
      )}
    </div>
  )
}

export default DevHubBrandMark
