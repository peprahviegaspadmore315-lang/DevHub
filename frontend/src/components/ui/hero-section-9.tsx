import React from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StatProps {
  value: string
  label: string
  icon: React.ReactNode
}

interface ActionProps {
  text: string
  onClick: () => void
  variant?: ButtonProps['variant']
  className?: string
}

interface HeroSectionProps {
  title: React.ReactNode
  subtitle: string
  actions: ActionProps[]
  stats: StatProps[]
  images: string[]
  className?: string
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut' as const,
    },
  },
}

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut' as const,
    },
  },
}

const floatingAnimation = (delay = 0) => ({
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    delay,
  },
})

const fallbackImages = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
]

const HeroSection = ({ title, subtitle, actions, stats, images, className }: HeroSectionProps) => {
  const collageImages = fallbackImages.map((fallback, index) => images[index] || fallback)

  return (
    <section
      className={cn(
        'w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-sky-50 to-cyan-50 py-12 shadow-sm sm:py-16',
        className
      )}
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-4 inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-1 text-sm font-medium text-sky-700 shadow-sm"
          >
            DevHub learning path
          </motion.div>

          <motion.h1
            className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          <motion.p className="mt-6 max-w-xl text-lg leading-8 text-slate-600" variants={itemVariants}>
            {subtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
            variants={itemVariants}
          >
            {actions.map((action, index) => (
              <Button
                key={`${action.text}-${index}`}
                onClick={action.onClick}
                variant={action.variant}
                size="lg"
                className={action.className}
              >
                {action.text}
              </Button>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-6 lg:justify-start"
            variants={itemVariants}
          >
            {stats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="flex min-w-[150px] items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative h-[380px] w-full sm:h-[470px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute -top-3 left-1/4 h-16 w-16 rounded-full bg-sky-200/70"
            animate={floatingAnimation()}
          />
          <motion.div
            className="absolute bottom-4 right-1/4 h-12 w-12 rounded-2xl bg-orange-200/70"
            animate={floatingAnimation(0.5)}
          />
          <motion.div
            className="absolute bottom-1/4 left-3 h-6 w-6 rounded-full bg-cyan-200/80"
            animate={floatingAnimation(1)}
          />

          <motion.div
            className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-[1.75rem] border border-white/70 bg-white p-2 shadow-xl sm:h-64 sm:w-64"
            style={{ transformOrigin: 'bottom center' }}
            variants={imageVariants}
          >
            <img
              src={collageImages[0]}
              alt="Students learning together"
              className="h-full w-full rounded-[1.25rem] object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute right-0 top-1/3 h-40 w-40 rounded-[1.5rem] border border-white/70 bg-white p-2 shadow-xl sm:h-56 sm:w-56"
            style={{ transformOrigin: 'left center' }}
            variants={imageVariants}
          >
            <img
              src={collageImages[1]}
              alt="Developer practicing in an editor"
              className="h-full w-full rounded-[1rem] object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 h-32 w-32 rounded-[1.5rem] border border-white/70 bg-white p-2 shadow-xl sm:h-48 sm:w-48"
            style={{ transformOrigin: 'top right' }}
            variants={imageVariants}
          >
            <img
              src={collageImages[2]}
              alt="Mentored collaborative learning"
              className="h-full w-full rounded-[1rem] object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
