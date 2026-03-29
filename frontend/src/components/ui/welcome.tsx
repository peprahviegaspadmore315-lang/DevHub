import * as React from "react"
import { motion } from "framer-motion"
import { PlayCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface ActionItem {
  icon: React.ReactNode
  label: string
  isBeta?: boolean
  onClick?: () => void
  buttonProps?: ButtonProps
}

export interface WorkspaceWelcomeProps {
  userName: string
  videoThumbnail: string
  videoTitle: string
  videoDescription: string
  actions: ActionItem[]
  onPlayVideo?: () => void
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
}

export const WorkspaceWelcome = React.forwardRef<HTMLDivElement, WorkspaceWelcomeProps>(
  (
    {
      userName,
      videoThumbnail,
      videoTitle,
      videoDescription,
      actions,
      onPlayVideo,
      className,
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "flex w-full flex-col items-center gap-8 rounded-[2rem] border border-sky-100/70 bg-white/90 p-6 shadow-[0_24px_90px_-44px_rgba(14,165,233,0.35)] backdrop-blur-sm md:p-8",
          className
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-4 text-center" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-700">
            Recommended video lane
          </div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Welcome back, {userName}.
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Pick a guided video, jump into the related DevHub lesson, or open a YouTube search for a
            specific topic without leaving your learning flow.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          variants={itemVariants}
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex items-center gap-2 rounded-full border-slate-200 bg-white px-4 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              onClick={action.onClick}
              {...action.buttonProps}
            >
              {action.icon}
              <span className="font-medium">{action.label}</span>
              {action.isBeta && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  Beta
                </Badge>
              )}
            </Button>
          ))}
        </motion.div>

        <motion.button
          type="button"
          className="group relative w-full cursor-pointer overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 text-left shadow-[0_24px_80px_-42px_rgba(15,23,42,0.7)]"
          onClick={onPlayVideo}
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <img
            src={videoThumbnail}
            alt={videoTitle}
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-5 text-white md:p-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100">
              DevHub recommendation
            </div>
            <h3 className="text-xl font-bold md:text-2xl">{videoTitle}</h3>
            <p className="max-w-2xl text-sm leading-6 text-white/80 md:text-base">{videoDescription}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/12 p-5 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
              <PlayCircle className="h-16 w-16 text-white transition-all duration-300 group-hover:text-sky-100" />
            </div>
          </div>
        </motion.button>
      </motion.div>
    )
  }
)

WorkspaceWelcome.displayName = "WorkspaceWelcome"
