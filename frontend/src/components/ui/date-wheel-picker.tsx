import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
} from 'framer-motion'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface DateWheelPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date
  onChange: (date: Date) => void
  minYear?: number
  maxYear?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'inverted'
  disabled?: boolean
  locale?: string
}

const ITEM_HEIGHT = 40
const VISIBLE_ITEMS = 5
const PERSPECTIVE_ORIGIN = ITEM_HEIGHT * 2

function getMonthNames(locale?: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })
  return Array.from({ length: 12 }, (_, index) =>
    formatter.format(new Date(2000, index, 1))
  )
}

const sizeConfig = {
  sm: {
    itemHeight: ITEM_HEIGHT * 0.8,
    fontSize: 'text-sm',
    gap: 'gap-2',
  },
  md: {
    itemHeight: ITEM_HEIGHT,
    fontSize: 'text-base',
    gap: 'gap-4',
  },
  lg: {
    itemHeight: ITEM_HEIGHT * 1.2,
    fontSize: 'text-lg',
    gap: 'gap-6',
  },
}

interface WheelPalette {
  fadeColor: string
  frameBackground: string
  frameBorder: string
  frameShadow: string
  itemTextColor: string
  selectedTextColor: string
  selectedGlow: string
}

const variantConfig: Record<NonNullable<DateWheelPickerProps['variant']>, WheelPalette> = {
  default: {
    fadeColor: 'hsl(var(--background))',
    frameBackground: 'hsl(var(--background) / 0.86)',
    frameBorder: 'hsl(var(--foreground) / 0.14)',
    frameShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
    itemTextColor: 'hsl(var(--foreground) / 0.78)',
    selectedTextColor: 'hsl(var(--foreground))',
    selectedGlow: '0 0 18px rgba(56, 189, 248, 0.22)',
  },
  inverted: {
    fadeColor: 'rgba(5, 7, 15, 0.92)',
    frameBackground: 'rgba(12, 22, 38, 0.96)',
    frameBorder: 'rgba(125, 211, 252, 0.38)',
    frameShadow: '0 14px 36px rgba(8, 145, 178, 0.28)',
    itemTextColor: 'rgba(255, 255, 255, 0.96)',
    selectedTextColor: 'rgba(255, 255, 255, 1)',
    selectedGlow: '0 0 24px rgba(125, 211, 252, 0.62)',
  },
}

interface WheelItemProps {
  item: string | number
  index: number
  y: MotionValue<number>
  itemHeight: number
  visibleItems: number
  centerOffset: number
  isSelected: boolean
  palette: WheelPalette
  disabled?: boolean
  onClick: () => void
}

function WheelItem({
  item,
  index,
  y,
  itemHeight,
  visibleItems,
  centerOffset,
  isSelected,
  palette,
  disabled,
  onClick,
}: WheelItemProps) {
  const itemY = useTransform(y, (latest) => index * itemHeight + latest + centerOffset)

  const rotateX = useTransform(
    itemY,
    [0, centerOffset, itemHeight * visibleItems],
    [45, 0, -45]
  )

  const scale = useTransform(
    itemY,
    [0, centerOffset, itemHeight * visibleItems],
    [0.8, 1, 0.8]
  )

  const opacity = useTransform(
    itemY,
    [0, centerOffset * 0.5, centerOffset, centerOffset * 1.5, itemHeight * visibleItems],
    [0.82, 0.94, 1, 0.94, 0.82]
  )

  return (
    <motion.div
      className="flex select-none items-center justify-center"
      style={{
        height: itemHeight,
        rotateX,
        scale,
        opacity,
        transformStyle: 'preserve-3d',
        transformOrigin: `center center -${PERSPECTIVE_ORIGIN}px`,
      }}
      onClick={() => !disabled && onClick()}
    >
      <span
        className="font-semibold tracking-wide transition-[color,filter] duration-200"
        style={{
          color: isSelected ? palette.selectedTextColor : palette.itemTextColor,
          filter: isSelected ? `drop-shadow(${palette.selectedGlow})` : 'none',
        }}
      >
        {item}
      </span>
    </motion.div>
  )
}

interface WheelColumnProps {
  items: (string | number)[]
  value: number
  onChange: (index: number) => void
  itemHeight: number
  visibleItems: number
  palette: WheelPalette
  disabled?: boolean
  className?: string
  ariaLabel: string
}

function WheelColumn({
  items,
  value,
  onChange,
  itemHeight,
  visibleItems,
  palette,
  disabled,
  className,
  ariaLabel,
}: WheelColumnProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const y = useMotionValue(-value * itemHeight)
  const centerOffset = Math.floor(visibleItems / 2) * itemHeight

  const valueRef = React.useRef(value)
  const onChangeRef = React.useRef(onChange)
  const itemsLengthRef = React.useRef(items.length)

  React.useEffect(() => {
    valueRef.current = value
    onChangeRef.current = onChange
    itemsLengthRef.current = items.length
  })

  React.useEffect(() => {
    animate(y, -value * itemHeight, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    })
  }, [value, itemHeight, y])

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (disabled) return

    const currentY = y.get()
    const velocity = info.velocity.y
    const projectedY = currentY + velocity * 0.2

    let newIndex = Math.round(-projectedY / itemHeight)
    newIndex = Math.max(0, Math.min(items.length - 1, newIndex))
    onChange(newIndex)
  }

  React.useEffect(() => {
    const container = containerRef.current
    if (!container || disabled) return

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const direction = event.deltaY > 0 ? 1 : -1
      const currentValue = valueRef.current
      const maxIndex = itemsLengthRef.current - 1
      const nextIndex = Math.max(0, Math.min(maxIndex, currentValue + direction))

      if (nextIndex !== currentValue) {
        onChangeRef.current(nextIndex)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [disabled])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    const maxIndex = items.length - 1
    let nextIndex = value

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        nextIndex = Math.max(0, value - 1)
        break
      case 'ArrowDown':
        event.preventDefault()
        nextIndex = Math.min(maxIndex, value + 1)
        break
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = maxIndex
        break
      case 'PageUp':
        event.preventDefault()
        nextIndex = Math.max(0, value - 5)
        break
      case 'PageDown':
        event.preventDefault()
        nextIndex = Math.min(maxIndex, value + 5)
        break
      default:
        return
    }

    if (nextIndex !== value) {
      onChange(nextIndex)
    }
  }

  const dragConstraints = React.useMemo(
    () => ({
      top: -(items.length - 1) * itemHeight,
      bottom: 0,
    }),
    [items.length, itemHeight]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-xl',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      style={{ height: itemHeight * visibleItems }}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={items.length - 1}
      aria-valuetext={String(items[value])}
      aria-disabled={disabled}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{
          height: centerOffset,
          background: `linear-gradient(to bottom, ${palette.fadeColor} 0%, transparent 100%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: centerOffset,
          background: `linear-gradient(to top, ${palette.fadeColor} 0%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-x-0 z-[5] rounded-lg backdrop-blur-sm"
        style={{
          top: centerOffset,
          height: itemHeight,
          border: `1px solid ${palette.frameBorder}`,
          background: palette.frameBackground,
          boxShadow: palette.frameShadow,
        }}
        aria-hidden="true"
      />

      <motion.div
        className="cursor-grab active:cursor-grabbing"
        style={{
          y,
          paddingTop: centerOffset,
          paddingBottom: centerOffset,
        }}
        drag="y"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {items.map((item, index) => (
          <WheelItem
            key={`${item}-${index}`}
            item={item}
            index={index}
            y={y}
            itemHeight={itemHeight}
            visibleItems={visibleItems}
            centerOffset={centerOffset}
            isSelected={index === value}
            palette={palette}
            disabled={disabled}
            onClick={() => onChange(index)}
          />
        ))}
      </motion.div>
    </div>
  )
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

const DateWheelPicker = React.forwardRef<HTMLDivElement, DateWheelPickerProps>(
  (
    {
      value,
      onChange,
      minYear = 1920,
      maxYear = new Date().getFullYear(),
      size = 'md',
      variant = 'default',
      disabled = false,
      locale,
      className,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size]
    const palette = variantConfig[variant]
    const months = React.useMemo(() => getMonthNames(locale), [locale])

    const years = React.useMemo(() => {
      const items: number[] = []
      for (let year = maxYear; year >= minYear; year -= 1) {
        items.push(year)
      }
      return items
    }, [maxYear, minYear])

    const [dateState, setDateState] = React.useState(() => {
      const currentDate = value || new Date()
      return {
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
      }
    })

    const isInternalChange = React.useRef(false)

    const days = React.useMemo(() => {
      const daysInMonth = getDaysInMonth(dateState.year, dateState.month)
      return Array.from({ length: daysInMonth }, (_, index) => index + 1)
    }, [dateState.month, dateState.year])

    const handleDayChange = React.useCallback((dayIndex: number) => {
      isInternalChange.current = true
      setDateState((previous) => ({ ...previous, day: dayIndex + 1 }))
    }, [])

    const handleMonthChange = React.useCallback((monthIndex: number) => {
      isInternalChange.current = true
      setDateState((previous) => {
        const daysInNewMonth = getDaysInMonth(previous.year, monthIndex)
        return {
          ...previous,
          month: monthIndex,
          day: Math.min(previous.day, daysInNewMonth),
        }
      })
    }, [])

    const handleYearChange = React.useCallback(
      (yearIndex: number) => {
        isInternalChange.current = true
        setDateState((previous) => {
          const nextYear = years[yearIndex] ?? previous.year
          const daysInNewMonth = getDaysInMonth(nextYear, previous.month)
          return {
            ...previous,
            year: nextYear,
            day: Math.min(previous.day, daysInNewMonth),
          }
        })
      },
      [years]
    )

    React.useEffect(() => {
      if (isInternalChange.current) {
        onChange(new Date(dateState.year, dateState.month, dateState.day))
        isInternalChange.current = false
      }
    }, [dateState, onChange])

    React.useEffect(() => {
      if (!value || isInternalChange.current) return

      const valueDay = value.getDate()
      const valueMonth = value.getMonth()
      const valueYear = value.getFullYear()

      if (
        valueDay !== dateState.day ||
        valueMonth !== dateState.month ||
        valueYear !== dateState.year
      ) {
        setDateState({
          day: valueDay,
          month: valueMonth,
          year: valueYear,
        })
      }
    }, [value, dateState.day, dateState.month, dateState.year])

    const yearIndex = years.indexOf(dateState.year)

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center rounded-2xl',
          config.gap,
          config.fontSize,
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        style={{ perspective: '1000px' }}
        role="group"
        aria-label="Date picker"
        {...props}
      >
        <WheelColumn
          items={days}
          value={dateState.day - 1}
          onChange={handleDayChange}
          itemHeight={config.itemHeight}
          visibleItems={VISIBLE_ITEMS}
          palette={palette}
          disabled={disabled}
          className="w-16"
          ariaLabel="Select day"
        />
        <WheelColumn
          items={months}
          value={dateState.month}
          onChange={handleMonthChange}
          itemHeight={config.itemHeight}
          visibleItems={VISIBLE_ITEMS}
          palette={palette}
          disabled={disabled}
          className="w-28 sm:w-32"
          ariaLabel="Select month"
        />
        <WheelColumn
          items={years}
          value={yearIndex >= 0 ? yearIndex : 0}
          onChange={handleYearChange}
          itemHeight={config.itemHeight}
          visibleItems={VISIBLE_ITEMS}
          palette={palette}
          disabled={disabled}
          className="w-20 sm:w-24"
          ariaLabel="Select year"
        />
      </div>
    )
  }
)

DateWheelPicker.displayName = 'DateWheelPicker'

export { DateWheelPicker }
