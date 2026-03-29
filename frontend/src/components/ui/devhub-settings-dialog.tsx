import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  Bot,
  HelpCircle,
  Moon,
  PanelTop,
  Settings,
  Sun,
  UserRound,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useToast } from '@/components/ui/toast-1'
import { useAIAssistant } from '@/contexts/AIAssistantContext'
import { applyNavbarAutoHidePreference, isNavbarAutoHideEnabled, NAVBAR_AUTO_HIDE_CHANGE_EVENT } from '@/lib/preferences'
import { applyThemePreference, isDarkThemeEnabled } from '@/lib/theme'
import { cn } from '@/lib/utils'

import { Button } from './button'

interface DevHubSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-[90] bg-slate-950/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-[95] w-[min(92vw,42rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/25 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_28px_90px_-35px_rgba(2,132,199,0.45)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border-slate-700/80 dark:bg-slate-950',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
        <X className="h-4 w-4" />
        <span className="sr-only">Close settings</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const preferenceButtonClass =
  'flex min-h-[7.5rem] flex-col items-start rounded-[1.45rem] border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60'

const actionButtonClass =
  'flex items-center justify-between rounded-[1.3rem] border border-slate-200/80 bg-white/90 px-4 py-3 text-left text-slate-700 transition hover:border-sky-200 hover:bg-sky-50/70 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-sky-900/60 dark:hover:bg-sky-950/20'

export const DevHubSettingsDialog = ({
  open,
  onOpenChange,
}: DevHubSettingsDialogProps) => {
  const navigate = useNavigate()
  const { setIsOpen: setAssistantOpen } = useAIAssistant()
  const { showToast } = useToast()
  const [isDark, setIsDark] = React.useState(() => isDarkThemeEnabled())
  const [isNavbarAutoHideActive, setIsNavbarAutoHideActive] = React.useState(() =>
    isNavbarAutoHideEnabled(),
  )

  React.useEffect(() => {
    const syncTheme = () => setIsDark(isDarkThemeEnabled())
    const syncNavbarPreference = (event?: Event) => {
      const customEvent = event as CustomEvent<boolean> | undefined
      if (typeof customEvent?.detail === 'boolean') {
        setIsNavbarAutoHideActive(customEvent.detail)
        return
      }

      setIsNavbarAutoHideActive(isNavbarAutoHideEnabled())
    }

    window.addEventListener('devhub-theme-change', syncTheme)
    window.addEventListener('storage', syncTheme)
    window.addEventListener(NAVBAR_AUTO_HIDE_CHANGE_EVENT, syncNavbarPreference as EventListener)
    window.addEventListener('storage', syncNavbarPreference as EventListener)

    return () => {
      window.removeEventListener('devhub-theme-change', syncTheme)
      window.removeEventListener('storage', syncTheme)
      window.removeEventListener(NAVBAR_AUTO_HIDE_CHANGE_EVENT, syncNavbarPreference as EventListener)
      window.removeEventListener('storage', syncNavbarPreference as EventListener)
    }
  }, [])

  const selectTheme = (nextIsDark: boolean) => {
    applyThemePreference(nextIsDark)
    setIsDark(nextIsDark)
  }

  const selectNavbarBehavior = (shouldAutoHide: boolean) => {
    applyNavbarAutoHidePreference(shouldAutoHide)
    setIsNavbarAutoHideActive(shouldAutoHide)
  }

  const closeAndNavigate = (href: string) => {
    onOpenChange(false)
    navigate(href)
  }

  const openAssistant = () => {
    onOpenChange(false)
    setAssistantOpen(true)
    showToast('AI Assistant opened', 'success', 'top-right')
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.24),transparent_55%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_45%)]" />

          <div className="relative space-y-6 px-5 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7">
            <div className="pr-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-sky-300">
                <Settings className="h-3.5 w-3.5" />
                DevHub settings
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Tune the way DevHub feels
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Adjust appearance, decide how the top menu behaves, and jump into the places you use most.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-semibold">Appearance</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Switch between the bright learning surface and the dark focus mode instantly.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => selectTheme(false)}
                    className={cn(
                      preferenceButtonClass,
                      !isDark
                        ? 'border-sky-200 bg-sky-50/80 text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:border-sky-100 hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300',
                    )}
                  >
                    <Sun className="h-5 w-5 text-amber-500" />
                    <span className="mt-3 text-sm font-semibold">Light mode</span>
                    <span className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      Best for bright study sessions and clean reading contrast.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectTheme(true)}
                    className={cn(
                      preferenceButtonClass,
                      isDark
                        ? 'border-sky-900/50 bg-slate-950 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300',
                    )}
                  >
                    <Moon className="h-5 w-5 text-sky-300" />
                    <span className="mt-3 text-sm font-semibold">Dark mode</span>
                    <span className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      Useful when you want the app to feel calmer during longer coding sessions.
                    </span>
                  </button>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <PanelTop className="h-4 w-4 text-sky-600" />
                  <h3 className="text-sm font-semibold">Top menu behavior</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Choose whether the header always stays visible or slides away until you return to the top edge.
                </p>

                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => selectNavbarBehavior(false)}
                    className={cn(
                      preferenceButtonClass,
                      !isNavbarAutoHideActive
                        ? 'border-sky-200 bg-sky-50/80 text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:border-sky-100 hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300',
                    )}
                  >
                    <PanelTop className="h-5 w-5 text-sky-600" />
                    <span className="mt-3 text-sm font-semibold">Keep the top menu visible</span>
                    <span className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      Best when you want navigation, search, and shortcuts to stay pinned in view.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectNavbarBehavior(true)}
                    className={cn(
                      preferenceButtonClass,
                      isNavbarAutoHideActive
                        ? 'border-sky-200 bg-sky-50/80 text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:border-sky-100 hover:bg-white dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300',
                    )}
                  >
                    <PanelTop className="h-5 w-5 text-sky-600" />
                    <span className="mt-3 text-sm font-semibold">Auto-hide when idle</span>
                    <span className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      DevHub slides the header away after a short pause and brings it back when you hover or touch near the top.
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Quick actions
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Open the parts of DevHub you reach for the most without leaving this panel.
                  </p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  Ready
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => closeAndNavigate('/profile')}
                  className={actionButtonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-50 p-2 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Profile</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage your learning identity</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={openAssistant}
                  className={actionButtonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-violet-50 p-2 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">AI assistant</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Ask, explain, quiz, and read aloud</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => closeAndNavigate('/help-center')}
                  className={actionButtonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Help Center</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Open support lanes and guidance</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full px-5"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPrimitive.Root>
  )
}

export default DevHubSettingsDialog
