"use client"

import { AnimatePresence, motion } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedNumberFlipProps {
  value: number
  className?: string
  valueClassName?: string
  showCard?: boolean
  formatter?: (value: number) => string
}

const numberTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as const,
}

export default function AnimatedNumberFlip({
  value,
  className,
  valueClassName,
  showCard = true,
  formatter,
}: AnimatedNumberFlipProps) {
  const formattedValue = (formatter ?? ((nextValue: number) => nextValue.toLocaleString("en-US")))(value)
  const minWidthCh = Math.max(formattedValue.length, 2)

  const content = (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ minWidth: `${minWidthCh}ch` }}
    >
      <div className="relative h-[1.2em]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formattedValue}
            initial={{ y: -34, opacity: 0, rotateX: -90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 34, opacity: 0, rotateX: 90 }}
            transition={numberTransition}
            className={cn(
              "absolute inset-0 flex items-center justify-center font-bold tabular-nums",
              valueClassName
            )}
          >
            {formattedValue}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )

  if (!showCard) {
    return content
  }

  return (
    <Card
      className={cn(
        "flex h-24 min-w-[6rem] items-center justify-center rounded-2xl border-slate-200 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90",
        className
      )}
    >
      <CardContent className="flex items-center justify-center p-0">
        <div style={{ minWidth: `${minWidthCh}ch` }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={formattedValue}
              initial={{ y: -34, opacity: 0, rotateX: -90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: 34, opacity: 0, rotateX: 90 }}
              transition={numberTransition}
              className={cn(
                "block text-center text-4xl font-bold tabular-nums",
                valueClassName
              )}
            >
              {formattedValue}
            </motion.span>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
