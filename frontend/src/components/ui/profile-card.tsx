"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Code2,
  Globe,
  LayoutDashboard,
  Mail,
  type LucideIcon,
  Pencil,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProfileLink {
  icon: LucideIcon
  label: string
  href: string
  external?: boolean
}

interface ComponentProps {
  name?: string
  role?: string
  email?: string
  avatarSrc?: string
  statusText?: string
  statusColor?: string
  bio?: string
  skills?: string[]
  className?: string
  primaryActionLabel?: string
  primaryActionIcon?: LucideIcon
  onPrimaryAction?: () => void
  profileLinks?: ProfileLink[]
}

const fallbackLinks: ProfileLink[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: Code2, label: "Editor", href: "/editor" },
  { icon: Globe, label: "Website", href: "/" },
]

export default function Component({
  name = "Sarah Chen",
  role = "Product Designer",
  email = "sarah.chen@design.co",
  avatarSrc = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  statusText = "Available",
  statusColor = "bg-emerald-500",
  bio = "Crafting intuitive experiences that delight users",
  skills = ["Figma", "Prototyping", "UX Research"],
  className,
  primaryActionLabel = "Continue Learning",
  primaryActionIcon: PrimaryActionIcon = BookOpen,
  onPrimaryAction,
  profileLinks = fallbackLinks,
}: ComponentProps) {
  const [copied, setCopied] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  const timeText = useMemo(() => {
    const now = new Date()
    const h = now.getHours()
    const m = now.getMinutes().toString().padStart(2, "0")
    const hour12 = ((h + 11) % 12) + 1
    const ampm = h >= 12 ? "PM" : "AM"
    return `${hour12}:${m} ${ampm}`
  }, [])

  const safeSkills = skills.filter(Boolean).slice(0, 5)
  const safeLinks = profileLinks.filter((link) => link.href).slice(0, 4)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore clipboard failures quietly in unsupported environments
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn("relative mx-auto flex w-full max-w-5xl items-center justify-center", className)}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-blue-500/20 blur-3xl" />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-600/30 to-indigo-600/30 blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
          className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-emerald-600/20 to-cyan-600/30 blur-3xl"
        />
      </div>

      <Card className="group relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-black text-white shadow-2xl transition-all duration-500 hover:shadow-[0_20px_70px_-15px_rgba(14,165,233,0.35)]">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-400" />

        <CardContent className="relative p-8 pt-8 sm:p-10 sm:pt-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-3 w-3 items-center justify-center">
                <span className={cn("absolute h-3 w-3 rounded-full animate-pulse", statusColor)} />
                <span className={cn("absolute h-3 w-3 rounded-full animate-ping", statusColor)} />
              </div>
              <span className="text-sm font-medium text-slate-300">{statusText}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">{timeText}</span>
            </div>
          </div>

          <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 280 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 blur-md opacity-60" />
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/20 shadow-xl">
                <img
                  src={avatarSrc}
                  alt={`${name} avatar`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{name}</h1>
              <p className="mb-3 text-lg font-medium text-sky-300">{role}</p>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">{bio}</p>
            </div>
          </div>

          {safeSkills.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-center gap-2 sm:justify-start">
              {safeSkills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="cursor-default rounded-full border border-white/10 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur-sm transition-all hover:border-sky-400/40"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredButton("primary")}
              onHoverEnd={() => setHoveredButton(null)}
            >
              <Button
                onClick={onPrimaryAction}
                className="relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 font-semibold text-white shadow-lg transition-all hover:from-sky-500 hover:to-cyan-400"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <PrimaryActionIcon className="h-5 w-5" />
                  {primaryActionLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <AnimatePresence>
                  {hoveredButton === "primary" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/15"
                    />
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="h-14 w-full rounded-2xl border-white/20 bg-white/5 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
              >
                <Mail className="mr-2 h-5 w-5" />
                {copied ? "Email Copied!" : "Copy Email"}
              </Button>
            </motion.div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 sm:justify-start">
            {safeLinks.map(({ icon: Icon, label, href, external }) => (
              <motion.a
                key={label}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.96 }}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="rounded-full bg-white/5 p-3 text-slate-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                aria-label={label}
                title={label}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>

          <motion.div
            className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-sky-600/20 to-cyan-500/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { BookOpen, Code2, Globe, LayoutDashboard, Pencil }
