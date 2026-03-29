"use client"

import React, { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, Compass, BookOpen, LayoutDashboard, Code2, Settings } from "lucide-react"

const FloatingNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [active, setActive] = useState(0)
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  const items = [
    { id: 0, icon: <Home size={22} />, label: "Home", path: "/" },
    { id: 1, icon: <Compass size={22} />, label: "Tutorials", path: "/topics" },
    { id: 2, icon: <BookOpen size={22} />, label: "Courses", path: "/courses" },
    { id: 3, icon: <LayoutDashboard size={22} />, label: "Dashboard", path: "/dashboard" },
    { id: 4, icon: <Code2 size={22} />, label: "Editor", path: "/editor" },
    { id: 5, icon: <Settings size={22} />, label: "Settings", path: "#" },
  ]

  // Set active based on current route
  useEffect(() => {
    const activeIndex = items.findIndex(item => item.path === location.pathname)
    if (activeIndex !== -1) {
      setActive(activeIndex)
    }
  }, [location.pathname])

  // Update indicator position when active changes or resize
  useEffect(() => {
    const updateIndicator = () => {
      if (btnRefs.current[active] && containerRef.current) {
        const btn = btnRefs.current[active]
        const container = containerRef.current
        if (!btn) return
        const btnRect = btn.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        setIndicatorStyle({
          width: btnRect.width,
          left: btnRect.left - containerRect.left,
        })
      }
    }

    updateIndicator()
    window.addEventListener("resize", updateIndicator)
    return () => window.removeEventListener("resize", updateIndicator)
  }, [active])

  const handleNavClick = (item: typeof items[0]) => {
    setActive(item.id)
    if (item.path !== "#") {
      navigate(item.path)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/topics?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <div className="w-full bg-gradient-to-r from-sky-500/95 to-cyan-500/95 dark:from-sky-900/90 dark:to-cyan-900/90 px-4 py-2 shadow-md border-b border-sky-400/30 dark:border-sky-700/30 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-1 items-center justify-between">
          <div
            ref={containerRef}
            className="relative flex items-center justify-center gap-1 rounded-lg px-2 py-2"
          >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => (btnRefs.current[index] = el)}
              onClick={() => handleNavClick(item)}
              className="relative flex flex-col items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-0 rounded-full"
              aria-label={item.label}
              title={item.label}
            >
              <div className="z-10 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              {/* hide labels on small screens */}
              <span className="text-xs mt-1 hidden sm:block text-white/90 font-semibold">
                {item.label}
              </span>
            </button>
          ))}

          {/* Sliding Active Indicator */}
          <motion.div
            animate={indicatorStyle}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute top-2 bottom-2 rounded-full bg-white/20 dark:bg-white/10 border border-white/40 dark:border-white/20 backdrop-blur-sm"
          />
          </div>
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in tutorials..."
                className="rounded-l-sm py-1 pl-8 pr-3 text-sm bg-white/20 text-white placeholder-white/40 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white/20 border-l border-white/30 rounded-r-sm py-1 px-2 hover:bg-white/30 transition"
                aria-label="Search"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FloatingNav
