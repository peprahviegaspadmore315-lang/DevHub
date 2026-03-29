import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

export interface ProfileCarouselLink {
  label: string
  href: string
  icon: LucideIcon
  external?: boolean
}

export interface ProfileCarouselItem {
  name: string
  title: string
  description: string
  imageUrl: string
  links?: ProfileCarouselLink[]
  eyebrow?: string
}

export interface TestimonialCarouselProps {
  items: ProfileCarouselItem[]
  className?: string
  heading?: string
  description?: string
  emptyState?: ReactNode
}

const CarouselLinkButton = ({ link }: { link: ProfileCarouselLink }) => {
  const content = (
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition duration-300 hover:-translate-y-0.5 hover:bg-sky-600 dark:bg-white dark:text-slate-950 dark:hover:bg-sky-300">
      <link.icon className="h-4.5 w-4.5" />
    </span>
  )

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={link.label}
      >
        {content}
      </a>
    )
  }

  return (
    <Link to={link.href} aria-label={link.label}>
      {content}
    </Link>
  )
}

export function TestimonialCarousel({
  items,
  className,
  heading = 'Profile Highlights',
  description = 'A quick rotating look at your DevHub identity, progress, and next steps.',
  emptyState,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!items.length) {
    return (
      <div className={cn('w-full rounded-3xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700', className)}>
        {emptyState ?? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add more profile information to unlock highlight cards here.
          </p>
        )}
      </div>
    )
  }

  const currentItem = items[currentIndex]

  const handleNext = () => {
    setCurrentIndex((index) => (index + 1) % items.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((index) => (index - 1 + items.length) % items.length)
  }

  return (
    <section className={cn('w-full', className)}>
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">
          DevHub Spotlight
        </p>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {heading}
        </h3>
        <p className="max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="hidden items-center md:flex">
        <div className="h-[420px] w-[420px] flex-shrink-0 overflow-hidden rounded-[2rem] bg-slate-200 shadow-xl dark:bg-slate-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="h-full w-full"
            >
              <img
                src={currentItem.imageUrl}
                alt={currentItem.name}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="z-10 ml-[-72px] max-w-2xl flex-1 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentItem.name}-${currentIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {currentItem.eyebrow ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                  {currentItem.eyebrow}
                </p>
              ) : null}

              <div className="mb-5">
                <h4 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {currentItem.name}
                </h4>
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {currentItem.title}
                </p>
              </div>

              <p className="mb-8 text-base leading-8 text-slate-700 dark:text-slate-300">
                {currentItem.description}
              </p>

              {currentItem.links?.length ? (
                <div className="flex flex-wrap gap-3">
                  {currentItem.links.map((link) => (
                    <CarouselLinkButton key={`${currentItem.name}-${link.label}`} link={link} />
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto md:hidden max-w-sm">
        <div className="mb-5 aspect-square overflow-hidden rounded-[2rem] bg-slate-200 dark:bg-slate-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="h-full w-full"
            >
              <img
                src={currentItem.imageUrl}
                alt={currentItem.name}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white px-5 py-6 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentItem.name}-${currentIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {currentItem.eyebrow ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                  {currentItem.eyebrow}
                </p>
              ) : null}
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {currentItem.name}
              </h4>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                {currentItem.title}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
                {currentItem.description}
              </p>
              {currentItem.links?.length ? (
                <div className="mt-6 flex justify-center gap-3">
                  {currentItem.links.map((link) => (
                    <CarouselLinkButton key={`${currentItem.name}-${link.label}`} link={link} />
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous profile highlight"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-2">
          {items.map((item, itemIndex) => (
            <button
              key={`${item.name}-${itemIndex}`}
              type="button"
              onClick={() => setCurrentIndex(itemIndex)}
              className={cn(
                'h-3 w-3 rounded-full transition-colors',
                itemIndex === currentIndex
                  ? 'bg-slate-900 dark:bg-white'
                  : 'bg-slate-300 dark:bg-slate-700',
              )}
              aria-label={`Go to profile highlight ${itemIndex + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next profile highlight"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}

export default TestimonialCarousel
