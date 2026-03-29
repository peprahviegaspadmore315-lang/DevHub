import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Compass, Home, LayoutDashboard, Menu, User, Code2, Settings, Sun, Moon, Sparkles, HelpCircle } from 'lucide-react'

import SearchBar from './SearchBar'
import CircularNavigation from '@/components/ui/cicular-navigation-bar'
import { Button } from '@/components/ui/button'
import DevHubWordmark from '@/components/ui/devhub-wordmark'
import { JollyMenu, MenuHeader, MenuItem, MenuKeyboard, MenuSeparator } from '@/components/ui/menu-1'
import { useToast } from '@/components/ui/toast-1'
import ButtonWithIconDemo from '@/components/ui/button-witn-icon'
import DevHubSettingsDialog from '@/components/ui/devhub-settings-dialog'
import NotificationsMenu from '@/components/ui/notifications-menu'
import UserDropdown from '@/components/ui/user-dropdown'
import { isNavbarAutoHideEnabled, NAVBAR_AUTO_HIDE_CHANGE_EVENT } from '@/lib/preferences'
import { applyThemePreference, isDarkThemeEnabled } from '@/lib/theme'
import { cn } from '@/lib/utils'
import { useAIAssistant } from '@/contexts/AIAssistantContext'
import { useAuthStore } from '@/store'

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [isCircularOpen, setIsCircularOpen] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [isNavbarHovered, setIsNavbarHovered] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNavbarAutoHideActive, setIsNavbarAutoHideActive] = useState(() =>
    isNavbarAutoHideEnabled(),
  )
  const [selectedStatus, setSelectedStatus] = useState('online')
  const hideTimeoutRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { setIsOpen: setAssistantOpen } = useAIAssistant()
  const { showToast } = useToast()

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }, [])

  const syncNavbarOffsets = useCallback((visible: boolean) => {
    if (typeof window === 'undefined') {
      return
    }

    const isDesktopViewport = window.innerWidth >= 768
    const visibleOffset = isDesktopViewport ? 80 : 132
    const hiddenOffset = isDesktopViewport ? 8 : 10
    const offset = visible ? visibleOffset : hiddenOffset

    document.documentElement.style.setProperty('--devhub-navbar-offset', `${offset}px`)
    document.documentElement.style.setProperty('--devhub-sidebar-top', `${offset}px`)
  }, [])

  const scheduleNavbarHide = useCallback(() => {
    clearHideTimeout()

    if (!isNavbarAutoHideActive) {
      setIsNavbarVisible(true)
      return
    }

    if (isNavbarHovered || isCircularOpen || isSettingsOpen) {
      return
    }

    hideTimeoutRef.current = window.setTimeout(() => {
      setIsNavbarVisible(false)
    }, 2600)
  }, [clearHideTimeout, isCircularOpen, isNavbarAutoHideActive, isNavbarHovered, isSettingsOpen])

  const revealNavbar = useCallback(
    (keepOpen = false) => {
      setIsNavbarVisible(true)
      clearHideTimeout()

      if (
        !keepOpen &&
        isNavbarAutoHideActive &&
        !isNavbarHovered &&
        !isCircularOpen &&
        !isSettingsOpen
      ) {
        hideTimeoutRef.current = window.setTimeout(() => {
          setIsNavbarVisible(false)
        }, 2600)
      }
    },
    [clearHideTimeout, isCircularOpen, isNavbarAutoHideActive, isNavbarHovered, isSettingsOpen]
  )

  useEffect(() => {
    const syncTheme = () => setDarkMode(isDarkThemeEnabled())
    syncTheme()
    window.addEventListener('devhub-theme-change', syncTheme)
    window.addEventListener('storage', syncTheme)

    return () => {
      window.removeEventListener('devhub-theme-change', syncTheme)
      window.removeEventListener('storage', syncTheme)
    }
  }, [])

  useEffect(() => {
    const syncNavbarAutoHidePreference = (event?: Event) => {
      const customEvent = event as CustomEvent<boolean> | undefined
      if (typeof customEvent?.detail === 'boolean') {
        setIsNavbarAutoHideActive(customEvent.detail)
        return
      }

      setIsNavbarAutoHideActive(isNavbarAutoHideEnabled())
    }

    syncNavbarAutoHidePreference()
    window.addEventListener(NAVBAR_AUTO_HIDE_CHANGE_EVENT, syncNavbarAutoHidePreference as EventListener)
    window.addEventListener('storage', syncNavbarAutoHidePreference as EventListener)

    return () => {
      window.removeEventListener(NAVBAR_AUTO_HIDE_CHANGE_EVENT, syncNavbarAutoHidePreference as EventListener)
      window.removeEventListener('storage', syncNavbarAutoHidePreference as EventListener)
    }
  }, [])

  useEffect(() => {
    setIsCircularOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    syncNavbarOffsets(isNavbarVisible)

    const handleResize = () => syncNavbarOffsets(isNavbarVisible)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isNavbarVisible, syncNavbarOffsets])

  useEffect(() => {
    revealNavbar()

    return () => {
      clearHideTimeout()
      document.documentElement.style.setProperty('--devhub-navbar-offset', '80px')
      document.documentElement.style.setProperty('--devhub-sidebar-top', '80px')
    }
  }, [clearHideTimeout, location.pathname, location.search, revealNavbar])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY <= 110) {
        revealNavbar()
      }
    }

    const handleTouchReveal = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY ?? event.changedTouches[0]?.clientY ?? 999
      if (touchY <= 132) {
        revealNavbar()
      }
    }

    const handleKeyDown = () => revealNavbar()

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchstart', handleTouchReveal, { passive: true })
    window.addEventListener('touchmove', handleTouchReveal, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleTouchReveal)
      window.removeEventListener('touchmove', handleTouchReveal)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [revealNavbar])

  useEffect(() => {
    if (!isNavbarAutoHideActive || isNavbarHovered || isCircularOpen || isSettingsOpen) {
      revealNavbar(true)
      return
    }

    scheduleNavbarHide()
  }, [isCircularOpen, isNavbarAutoHideActive, isNavbarHovered, isSettingsOpen, revealNavbar, scheduleNavbarHide])

  const handleLightMode = () => {
    applyThemePreference(false)
    setDarkMode(false)
  }

  const handleDarkMode = () => {
    applyThemePreference(true)
    setDarkMode(true)
  }

  const toggleDarkMode = () => {
    if (darkMode) {
      handleLightMode()
      return
    }

    handleDarkMode()
  }

  const toggleCircularMenu = () => {
    setIsCircularOpen((current) => !current)
  }

  const handleUserAction = (action: string) => {
    switch (action) {
      case 'profile':
        navigate('/profile')
        return
      case 'dashboard':
        navigate('/dashboard')
        return
      case 'appearance':
        toggleDarkMode()
        showToast(`Switched to ${darkMode ? 'light' : 'dark'} mode`, 'success', 'top-right')
        return
      case 'courses':
        navigate('/courses')
        return
      case 'assistant':
        setAssistantOpen(true)
        showToast('AI Assistant opened', 'success', 'top-right')
        return
      case 'editor':
        navigate('/editor')
        return
      case 'help':
        navigate('/help-center')
        return
      case 'logout':
        logout()
        showToast('Logged out successfully', 'success', 'top-right')
        navigate('/login')
        return
      default:
        return
    }
  }

  const dropdownUser = useMemo(() => {
    if (!user) {
      return null
    }

    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    const initialsSource = fullName || user.username || user.email || 'DevHub'
    const initials = initialsSource
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('')

    return {
      name: fullName || user.username,
      username: `@${user.username}`,
      avatar: user.avatarUrl ?? null,
      initials: initials || 'DH',
      status: selectedStatus,
    }
  }, [selectedStatus, user])

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/topics?search=${encodeURIComponent(value.trim())}`)
      return
    }

    navigate('/topics')
  }

  const quickNavItems = useMemo(
    () => [
      { name: 'Home', icon: Home, href: '/' },
      { name: 'Tutorials', icon: Compass, href: '/topics' },
      { name: 'Courses', icon: BookOpen, href: '/courses' },
      { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Editor', icon: Code2, href: '/editor' },
      { name: 'Profile', icon: User, href: isAuthenticated ? '/profile' : '/login' },
      { name: 'Help Center', icon: HelpCircle, href: '/help-center' },
    ],
    [isAuthenticated]
  )

  const desktopNavButtonClass =
    'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/14 hover:text-white 2xl:px-4'

  const utilityButtonClass =
    'flex h-10 items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-3 text-sm font-medium text-white/90 shadow-sm backdrop-blur-md transition hover:bg-white/16 hover:text-white'

  const handleSettingsClick = () => {
    revealNavbar(true)
    setIsSettingsOpen(true)
  }

  const handleAssistantClick = () => {
    setAssistantOpen(true)
    showToast('AI Assistant opened', 'success', 'top-right')
  }

  const quickMenuItemClass =
    'gap-3 rounded-xl px-3 py-2.5 text-slate-200 focus:bg-sky-500/15 focus:text-white data-[highlighted]:bg-sky-500/15 data-[highlighted]:text-white'

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-[70] transition-transform duration-500 ease-out',
          isNavbarVisible ? 'translate-y-0' : '-translate-y-[calc(100%+1rem)]'
        )}
      >
      <nav
        className="navbar border-b border-white/10 bg-gradient-to-r from-[#317EFB] via-[#2f77ef] to-[#2569df] text-white shadow-lg shadow-sky-900/10"
        onMouseEnter={() => {
          setIsNavbarHovered(true)
          revealNavbar(true)
        }}
        onMouseLeave={() => {
          setIsNavbarHovered(false)
          scheduleNavbarHide()
        }}
        onFocusCapture={() => revealNavbar(true)}
        onBlurCapture={() => scheduleNavbarHide()}
        onTouchStart={() => revealNavbar(true)}
      >
        <div className="mx-auto w-full max-w-[1760px] px-3 sm:px-5 lg:px-6">
          <div className="grid min-h-[72px] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 md:gap-4 xl:grid-cols-[auto_minmax(0,1fr)_auto]">
            <div className="flex shrink-0 items-center gap-4">
              <button
                className="rounded-xl border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/15 lg:hidden"
                onClick={toggleCircularMenu}
                aria-label="Open quick navigation"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link to="/" className="flex items-center text-xl font-bold tracking-tight">
                <div className="leading-tight">
                  <DevHubWordmark
                    as="span"
                    tone="light"
                    className="block text-xl font-bold"
                    devClassName="text-sky-300"
                    hubClassName="text-cyan-400"
                  />
                  <span className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-sky-100/70 xl:block">
                    Learn • Build • Design
                  </span>
                </div>
              </Link>
            </div>

            <div className="hidden min-w-0 items-center justify-center 2xl:flex">
              <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/12 bg-white/10 p-1.5 shadow-sm backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button onClick={() => navigate('/')} className={desktopNavButtonClass} title="Home">
                  <Home className="h-4 w-4" />
                  Home
                </button>
                <button onClick={() => navigate('/topics')} className={desktopNavButtonClass} title="Tutorials">
                  <Compass className="h-4 w-4" />
                  Tutorials
                </button>
                <button onClick={() => navigate('/courses')} className={desktopNavButtonClass} title="Courses">
                  <BookOpen className="h-4 w-4" />
                  Courses
                </button>
                <button onClick={() => navigate('/dashboard')} className={desktopNavButtonClass} title="Dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
                <button onClick={() => navigate('/editor')} className={desktopNavButtonClass} title="Editor">
                  <Code2 className="h-4 w-4" />
                  Editor
                </button>
                <button onClick={() => navigate('/help-center')} className={desktopNavButtonClass} title="Help Center">
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </button>
              </div>
            </div>

            <div className="ml-auto hidden min-w-0 items-center justify-end gap-2 md:flex md:gap-3">
              <SearchBar
                placeholder="Search topics, lessons, or courses..."
                onSearch={handleSearch}
                className="hidden lg:flex lg:min-w-[220px] lg:flex-1 lg:max-w-[260px] xl:max-w-[300px] 2xl:max-w-[340px]"
              />

              <div className="hidden items-center gap-2 rounded-2xl border border-white/12 bg-slate-950/15 px-2 py-2 shadow-sm backdrop-blur-md md:flex">
                <JollyMenu
                  variant="ghost"
                  triggerClassName={cn(utilityButtonClass, 'rounded-xl border-white/12 bg-white/10 px-3')}
                  popoverClassName="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border-white/12 bg-slate-950/95 text-white shadow-2xl shadow-sky-950/40"
                  label={
                    <>
                      <Menu className="h-4 w-4" />
                      <span className="hidden 2xl:inline">Quick Nav</span>
                    </>
                  }
                >
                  <MenuHeader className="space-y-1 border-white/10 pb-3 text-white">
                    <div className="text-sm font-semibold">Quick navigation</div>
                    <p className="text-xs font-normal text-sky-100/65">
                      Jump into any part of DevHub without leaving the header.
                    </p>
                  </MenuHeader>

                  {quickNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href

                    return (
                      <MenuItem
                        key={item.href}
                        className={cn(quickMenuItemClass, isActive && 'bg-white/10 text-white')}
                        onSelect={() => navigate(item.href)}
                      >
                        <Icon className="h-4 w-4 text-sky-300" />
                        <span>{item.name}</span>
                        <MenuKeyboard>{item.name.slice(0, 3)}</MenuKeyboard>
                      </MenuItem>
                    )
                  })}

                  <MenuSeparator className="bg-white/10" />

                  <MenuHeader separator={false} className="px-3 pb-1 text-[11px] uppercase tracking-[0.22em] text-sky-100/55">
                    Actions
                  </MenuHeader>

                  <MenuItem className={quickMenuItemClass} onSelect={handleAssistantClick}>
                    <Sparkles className="h-4 w-4 text-sky-300" />
                    <span>Open AI Assistant</span>
                    <MenuKeyboard>AI</MenuKeyboard>
                  </MenuItem>

                  <MenuItem className={quickMenuItemClass} onSelect={toggleDarkMode}>
                    {darkMode ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-sky-300" />}
                    <span>{darkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
                    <MenuKeyboard>Theme</MenuKeyboard>
                  </MenuItem>

                  <MenuItem className={quickMenuItemClass} onSelect={toggleCircularMenu}>
                    <Compass className="h-4 w-4 text-sky-300" />
                    <span>Open Orbit Nav</span>
                    <MenuKeyboard>Alt</MenuKeyboard>
                  </MenuItem>

                  <MenuItem className={quickMenuItemClass} onSelect={handleSettingsClick}>
                    <Settings className="h-4 w-4 text-sky-300" />
                    <span>Settings</span>
                    <MenuKeyboard>Soon</MenuKeyboard>
                  </MenuItem>

                  <MenuItem
                    className={quickMenuItemClass}
                    onSelect={() => navigate('/help-center')}
                  >
                    <HelpCircle className="h-4 w-4 text-sky-300" />
                    <span>Open Help Center</span>
                    <MenuKeyboard>Help</MenuKeyboard>
                  </MenuItem>
                </JollyMenu>

                <div className="flex items-center rounded-xl bg-white/8 p-1">
                  <button
                    onClick={handleLightMode}
                    className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      !darkMode
                        ? 'bg-white text-[#123a86] shadow-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    title="Light Mode"
                  >
                    <Sun className="h-3.5 w-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={handleDarkMode}
                    className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      darkMode
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                    title="Dark Mode"
                  >
                    <Moon className="h-3.5 w-3.5" />
                    <span>Dark</span>
                  </button>
                </div>

                <button
                  onClick={handleSettingsClick}
                  className={cn(utilityButtonClass, 'px-3')}
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden 2xl:inline">Settings</span>
                </button>

                {isAuthenticated ? (
                  <NotificationsMenu
                    userName={dropdownUser?.name}
                    triggerClassName="h-10 w-10 rounded-xl border-white/12 bg-white/10 text-white/90 hover:bg-white/15 hover:text-white"
                  />
                ) : null}
              </div>

              {isAuthenticated && dropdownUser ? (
                <UserDropdown
                  user={dropdownUser}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  onAction={handleUserAction}
                  highlightLabel="Learner"
                />
              ) : (
                <ButtonWithIconDemo
                  onClick={() => navigate('/login')}
                  label="Login / Sign up"
                  className="h-11 shrink-0"
                />
              )}
            </div>

            <div className="ml-auto flex items-center gap-2 md:hidden">
              {isAuthenticated ? (
                <NotificationsMenu
                  userName={dropdownUser?.name}
                  triggerClassName="border-white/12 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                />
              ) : null}
              {isAuthenticated && dropdownUser ? (
                <UserDropdown
                  user={dropdownUser}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  onAction={handleUserAction}
                  highlightLabel="Learner"
                />
              ) : null}
              {!isAuthenticated ? (
                <ButtonWithIconDemo
                  onClick={() => navigate('/login')}
                  label="Login"
                  className="h-10 ps-4 pe-11 text-xs"
                />
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 py-3 md:hidden">
            <SearchBar
              placeholder="Search topics, lessons, or courses..."
              onSearch={handleSearch}
              className="max-w-none flex-1"
            />
            <Button
              onClick={toggleCircularMenu}
              variant="outline"
              className="h-11 w-11 rounded-xl border-white/12 bg-white/10 p-0 text-white hover:bg-white/15 hover:text-white"
              title="Quick navigation"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>
      </div>

      <div
        className={cn(
          'fixed inset-x-0 top-0 z-[65] h-14',
          isNavbarVisible ? 'pointer-events-none' : 'pointer-events-auto'
        )}
        onMouseEnter={() => revealNavbar()}
        onTouchStart={() => revealNavbar()}
      />

      <CircularNavigation
        navItems={quickNavItems}
        isOpen={isCircularOpen}
        toggleMenu={toggleCircularMenu}
      />

      <DevHubSettingsDialog
        open={isSettingsOpen}
        onOpenChange={(open) => {
          setIsSettingsOpen(open)
          if (!open && !isNavbarAutoHideActive) {
            revealNavbar(true)
          }
        }}
      />
    </>
  )
}

export default Navbar
