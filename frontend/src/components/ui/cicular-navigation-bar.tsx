"use client"

import type { ComponentType } from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { X } from "lucide-react"

interface NavItem {
  name: string
  icon: ComponentType<{ className?: string }>
  href: string
}

interface CircularNavigationProps {
  navItems: NavItem[]
  isOpen: boolean
  toggleMenu: () => void
}

export default function CircularNavigation({
  navItems,
  isOpen,
  toggleMenu,
}: CircularNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggleMenu()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, toggleMenu])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9000] flex h-screen w-full items-center justify-center bg-background/20 backdrop-blur-sm">
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/85 px-4"
            onClick={toggleMenu}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="relative flex aspect-square w-[min(420px,88vw)] items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(14,165,233,0.14), rgba(15,23,42,0.92))",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "inset 2px 2px 2px rgba(255,255,255,0.18), inset -1px -1px 1px rgba(255,255,255,0.08), 0 30px 80px rgba(2,132,199,0.18)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-8 rounded-full border border-white/10" />

              <button
                onClick={toggleMenu}
                className="absolute z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition-transform hover:scale-105"
                aria-label="Close quick navigation"
              >
                <X className="h-6 w-6" />
              </button>

              {navItems.map((item, index) => {
                const Icon = item.icon
                const angle = (360 / navItems.length) * index

                return (
                  <div
                    key={item.name}
                    className="absolute"
                    style={{
                      transform: `rotate(${angle}deg) translate(150px) rotate(-${angle}deg)`,
                    }}
                  >
                    <Link
                      to={item.href}
                      className={`flex aspect-square h-20 w-20 flex-col items-center justify-center rounded-full border border-white/10 text-center transition-all duration-200 ${
                        hoveredItem === item.name
                          ? "bg-white text-slate-950 shadow-xl"
                          : "bg-white/5 text-white hover:bg-white/10"
                      }`}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={toggleMenu}
                    >
                      <Icon className="mb-1 h-6 w-6" />
                      <span className="px-1 text-[11px] font-semibold tracking-wide">
                        {item.name}
                      </span>
                    </Link>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
