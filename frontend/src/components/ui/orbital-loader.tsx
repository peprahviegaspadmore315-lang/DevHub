"use client"

import React from "react"
import { cva } from "class-variance-authority"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const orbitalLoaderVariants = cva("flex items-center justify-center gap-3", {
  variants: {
    messagePlacement: {
      bottom: "flex-col",
      top: "flex-col-reverse",
      right: "flex-row",
      left: "flex-row-reverse",
    },
    size: {
      sm: "[--orbital-size:2.75rem] [--orbital-gap:0.4rem] [--orbital-border:2px]",
      md: "[--orbital-size:4rem] [--orbital-gap:0.5rem] [--orbital-border:2px]",
      lg: "[--orbital-size:5rem] [--orbital-gap:0.625rem] [--orbital-border:2px]",
    },
  },
  defaultVariants: {
    messagePlacement: "bottom",
    size: "md",
  },
})

const messageVariants = cva(
  "max-w-xs text-center text-sm font-medium leading-6 text-slate-600 dark:text-slate-300",
  {
    variants: {
      messagePlacement: {
        bottom: "text-center",
        top: "text-center",
        right: "text-left",
        left: "text-right",
      },
      tone: {
        brand: "text-sky-700 dark:text-sky-200",
        muted: "text-slate-600 dark:text-slate-300",
        light: "text-white/90",
      },
    },
    defaultVariants: {
      messagePlacement: "bottom",
      tone: "brand",
    },
  }
)

export interface OrbitalLoaderProps {
  message?: string
  messagePlacement?: "top" | "bottom" | "left" | "right"
  size?: "sm" | "md" | "lg"
  tone?: "brand" | "muted" | "light"
}

export function OrbitalLoader({
  className,
  message,
  messagePlacement,
  size,
  tone = "brand",
  ...props
}: React.ComponentProps<"div"> & OrbitalLoaderProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(orbitalLoaderVariants({ messagePlacement, size }))}
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full",
          "h-[var(--orbital-size)] w-[var(--orbital-size)]",
          className
        )}
        role="status"
        {...props}
      >
        <div className="absolute inset-[18%] rounded-full bg-sky-400/10 blur-md dark:bg-cyan-400/15" />
        <motion.div
          className="absolute inset-0 rounded-full border-[length:var(--orbital-border)] border-transparent border-t-sky-500/90 border-r-cyan-400/50"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-[var(--orbital-gap)] rounded-full border-[length:var(--orbital-border)] border-transparent border-t-sky-300/80 border-l-blue-500/40"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.55,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-[calc(var(--orbital-gap)*2)] rounded-full border-[length:var(--orbital-border)] border-transparent border-t-cyan-300/90 border-r-sky-500/35"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.85,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-[34%] rounded-full bg-gradient-to-br from-sky-500 via-cyan-400 to-sky-300 shadow-[0_0_28px_rgba(14,165,233,0.4)]"
          animate={{
            scale: [0.94, 1.06, 0.94],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            duration: 1.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <span className="sr-only">{message || "Loading content"}</span>
      </div>
      {message ? (
        <div className={cn(messageVariants({ messagePlacement, tone }))}>
          {message}
        </div>
      ) : null}
    </div>
  )
}

export default OrbitalLoader
