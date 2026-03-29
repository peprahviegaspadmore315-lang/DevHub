import { Sun, Moon, Settings } from 'lucide-react'
import { useState } from 'react'
import { isDarkThemeEnabled, applyThemePreference } from '@/lib/theme'

export const ThemeDock = () => {
  const [isDark, setIsDark] = useState(isDarkThemeEnabled())

  const handleLightMode = () => {
    applyThemePreference(false)
    setIsDark(false)
  }

  const handleDarkMode = () => {
    applyThemePreference(true)
    setIsDark(true)
  }

  return (
    <div
      className="
        inline-flex rounded-full overflow-hidden
        bg-gradient-to-r from-sky-500/20 to-cyan-500/20
        dark:bg-gradient-to-r dark:from-sky-900/30 dark:to-cyan-900/30
        backdrop-blur-xl
        shadow-lg shadow-sky-500/10 dark:shadow-sky-900/20
        border border-sky-300/30 dark:border-sky-700/40
        transition-all duration-500
        p-1
      "
    >
      <button
        onClick={handleLightMode}
        className={`
          px-4 py-2 rounded-full
          flex items-center gap-2
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2
          dark:focus:ring-offset-slate-900
          group
          ${!isDark 
            ? 'bg-sky-400 dark:bg-sky-500 text-white shadow-lg shadow-sky-500/50' 
            : 'text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10'
          }
        `}
        aria-label="Switch to Light Mode"
      >
        <Sun
          className="
            w-5 h-5
            transition-transform duration-300
            group-hover:rotate-12
          "
          aria-hidden="true"
        />
        <span className="select-none text-sm font-medium">Light</span>
      </button>

      <button
        onClick={handleDarkMode}
        className={`
          px-4 py-2 rounded-full
          flex items-center gap-2
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2
          dark:focus:ring-offset-slate-900
          group
          ${isDark 
            ? 'bg-slate-700 dark:bg-slate-600 text-white shadow-lg shadow-slate-800/50' 
            : 'text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10'
          }
        `}
        aria-label="Switch to Dark Mode"
      >
        <Moon
          className="
            w-5 h-5
            transition-transform duration-300
            group-hover:rotate-12
          "
          aria-hidden="true"
        />
        <span className="select-none text-sm font-medium">Dark</span>
      </button>

      <button
        className="
          px-4 py-2 rounded-full
          flex items-center gap-2
          text-slate-700 dark:text-slate-300
          hover:bg-white/20 dark:hover:bg-white/10
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2
          dark:focus:ring-offset-slate-900
          group
        "
        aria-label="Open Settings"
      >
        <Settings
          className="
            w-5 h-5
            transition-transform duration-300
            group-hover:rotate-90
          "
          aria-hidden="true"
        />
        <span className="select-none text-sm font-medium hidden sm:inline">Settings</span>
      </button>
    </div>
  )
}
