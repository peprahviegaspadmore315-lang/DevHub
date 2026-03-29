import React, { type HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

export interface GalleryItem {
  common: string
  binomial: string
  photo: {
    url: string
    text: string
    pos?: string
    by: string
  }
  accent?: string
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[]
  radius?: number
  autoRotateSpeed?: number
  onItemClick?: (item: GalleryItem, index: number) => void
  onActiveIndexChange?: (index: number) => void
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius = 460,
      autoRotateSpeed = 0.03,
      onItemClick,
      onActiveIndexChange,
      ...props
    },
    ref
  ) => {
    const [rotation, setRotation] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [viewportWidth, setViewportWidth] = useState(() =>
      typeof window === 'undefined' ? 1280 : window.innerWidth
    )
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    useEffect(() => {
      const updateViewport = () => setViewportWidth(window.innerWidth)

      updateViewport()
      window.addEventListener('resize', updateViewport)

      return () => window.removeEventListener('resize', updateViewport)
    }, [])

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
        setRotation(scrollProgress * 360)

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false)
        }, 150)
      }

      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }
    }, [])

    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && !isHovered) {
          setRotation((previous) => previous + autoRotateSpeed)
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate)
      }

      animationFrameRef.current = requestAnimationFrame(autoRotate)

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [autoRotateSpeed, isHovered, isScrolling])

    const { cardWidth, cardHeight, resolvedRadius } = useMemo(() => {
      if (viewportWidth < 640) {
        return { cardWidth: 160, cardHeight: 214, resolvedRadius: Math.min(radius, 210) }
      }

      if (viewportWidth < 1024) {
        return { cardWidth: 210, cardHeight: 280, resolvedRadius: Math.min(radius, 300) }
      }

      if (viewportWidth < 1440) {
        return { cardWidth: 240, cardHeight: 320, resolvedRadius: Math.min(radius, 380) }
      }

      return { cardWidth: 280, cardHeight: 360, resolvedRadius: radius }
    }, [radius, viewportWidth])

    const anglePerItem = items.length > 0 ? 360 / items.length : 0
    const activeIndex = useMemo(() => {
      if (items.length === 0) return 0

      let closestIndex = 0
      let smallestAngle = Number.POSITIVE_INFINITY

      items.forEach((_, index) => {
        const itemAngle = index * anglePerItem
        const relativeAngle = (itemAngle + rotation + 360) % 360
        const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle)

        if (normalizedAngle < smallestAngle) {
          smallestAngle = normalizedAngle
          closestIndex = index
        }
      })

      return closestIndex
    }, [anglePerItem, items, rotation])

    useEffect(() => {
      onActiveIndexChange?.(activeIndex)
    }, [activeIndex, onActiveIndexChange])

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
      if (items.length === 0) return

      event.preventDefault()
      setIsScrolling(true)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      setRotation((previous) => previous - event.deltaY * 0.12)

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 140)
    }

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular course gallery"
        className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}
        style={{ perspective: '2000px' }}
        onWheel={handleWheel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, index) => {
            const itemAngle = index * anglePerItem
            const totalRotation = rotation % 360
            const relativeAngle = (itemAngle + totalRotation + 360) % 360
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle)
            const opacity = Math.max(0.35, 1 - normalizedAngle / 190)
            const scale = 0.9 + (1 - normalizedAngle / 180) * 0.18
            const accent = item.accent || '#38bdf8'

            return (
              <div
                key={`${item.common}-${item.photo.url}`}
                role="group"
                aria-label={item.common}
                className="absolute"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${resolvedRadius}px) scale(${scale})`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: `-${cardHeight / 2}px`,
                  opacity,
                  transition: 'opacity 0.3s linear, transform 0.35s ease',
                }}
              >
                <button
                  type="button"
                  className="group relative h-full w-full overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/70 text-left shadow-[0_25px_50px_-20px_rgba(15,23,42,0.8)] backdrop-blur-xl"
                  onClick={() => onItemClick?.(item, index)}
                >
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div
                    className="absolute inset-x-5 top-5 h-20 rounded-full blur-3xl"
                    style={{ backgroundColor: `${accent}45` }}
                  />

                  <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                    <span
                      className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/90"
                      style={{ borderColor: `${accent}55`, backgroundColor: `${accent}1c` }}
                    >
                      {item.photo.by}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-sky-50">
                      Open
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div
                      className="mb-3 h-1.5 w-16 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                    <h2 className="text-2xl font-bold text-white">{item.common}</h2>
                    <p className="mt-2 text-sm text-slate-200/85">{item.binomial}</p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.24em] text-sky-100/75">
                      Scroll to rotate • tap to open
                    </p>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

CircularGallery.displayName = 'CircularGallery'

export { CircularGallery }
