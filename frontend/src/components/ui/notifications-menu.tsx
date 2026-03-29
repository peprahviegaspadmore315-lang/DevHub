import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  BookOpen,
  CheckCheck,
  Code2,
  LayoutDashboard,
  Settings2,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/toast-1'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAIAssistant } from '@/contexts/AIAssistantContext'
import { cn } from '@/lib/utils'
import DevHubSettingsDialog from '@/components/ui/devhub-settings-dialog'

type NotificationFilter = 'all' | 'learning' | 'achievements'
type NotificationSegment = Exclude<NotificationFilter, 'all'>
type NotificationActionType = 'route' | 'assistant' | 'toast'

interface DevHubNotification {
  id: number
  segment: NotificationSegment
  actor: {
    name: string
    avatar?: string
    fallback: string
  }
  action: string
  target: string
  content: string
  timestamp: string
  timeAgo: string
  isRead: boolean
  badge: string
  actionLabel: string
  actionType: NotificationActionType
  href?: string
  toastMessage?: string
}

interface NotificationsMenuProps {
  align?: 'start' | 'center' | 'end'
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerClassName?: string
  userName?: string
}

const DEFAULT_ACTOR_AVATAR = '/devhubsymbolmain.png'
const NOTIFICATION_READ_STORAGE_KEY = 'devhub-notification-read-ids'

const getStoredReadNotificationIds = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = localStorage.getItem(NOTIFICATION_READ_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => typeof value === 'number')
      : []
  } catch {
    return []
  }
}

const createNotifications = (userName?: string): DevHubNotification[] => {
  const learnerName = userName?.trim() || 'DevHub learner'

  return [
    {
      id: 1,
      segment: 'learning',
      actor: {
        name: 'DevHub Coach',
        avatar: DEFAULT_ACTOR_AVATAR,
        fallback: 'DH',
      },
      action: 'queued your next lesson in',
      target: 'HTML Foundations',
      content: `${learnerName}, your next guided lesson is ready. Pick up semantic HTML and keep your learning streak active.`,
      timestamp: 'Today, 8:45 AM',
      timeAgo: '12 min ago',
      isRead: false,
      badge: 'Lesson ready',
      actionLabel: 'Resume lesson',
      actionType: 'route',
      href: '/courses/1?topic=html-home',
    },
    {
      id: 2,
      segment: 'learning',
      actor: {
        name: 'DevHub AI',
        avatar: DEFAULT_ACTOR_AVATAR,
        fallback: 'AI',
      },
      action: 'prepared a reading recap for',
      target: 'CSS Layouts',
      content:
        'Your AI assistant has a quick explanation ready so you can review flexbox and grid faster before the next lesson.',
      timestamp: 'Today, 7:58 AM',
      timeAgo: '59 min ago',
      isRead: false,
      badge: 'AI helper',
      actionLabel: 'Open assistant',
      actionType: 'assistant',
    },
    {
      id: 3,
      segment: 'achievements',
      actor: {
        name: 'Progress Tracker',
        avatar: DEFAULT_ACTOR_AVATAR,
        fallback: 'PT',
      },
      action: 'awarded you the',
      target: 'Practice Streak badge',
      content:
        'You completed enough guided exercises this week to unlock a new achievement on your public DevHub profile.',
      timestamp: 'Yesterday, 6:20 PM',
      timeAgo: '1 day ago',
      isRead: true,
      badge: 'New badge',
      actionLabel: 'View profile',
      actionType: 'route',
      href: '/profile',
    },
    {
      id: 4,
      segment: 'achievements',
      actor: {
        name: 'DevHub Dashboard',
        avatar: DEFAULT_ACTOR_AVATAR,
        fallback: 'DB',
      },
      action: 'updated your weekly recap in',
      target: 'Learning Dashboard',
      content:
        'Your course progress, points, and active streak have been refreshed so you can see what to tackle next.',
      timestamp: 'Yesterday, 9:00 AM',
      timeAgo: '1 day ago',
      isRead: true,
      badge: 'Progress',
      actionLabel: 'Open dashboard',
      actionType: 'route',
      href: '/dashboard',
    },
    {
      id: 5,
      segment: 'learning',
      actor: {
        name: 'DevHub Lab',
        avatar: DEFAULT_ACTOR_AVATAR,
        fallback: 'DL',
      },
      action: 'saved your latest workspace in',
      target: 'Code Editor',
      content:
        'Jump back into the editor and continue from your most recent sandbox session without losing momentum.',
      timestamp: 'Yesterday, 7:42 AM',
      timeAgo: '1 day ago',
      isRead: true,
      badge: 'Workspace',
      actionLabel: 'Open editor',
      actionType: 'route',
      href: '/editor',
    },
  ]
}

const hydrateNotifications = (userName?: string) => {
  const readIds = new Set(getStoredReadNotificationIds())

  return createNotifications(userName).map((notification) =>
    readIds.has(notification.id)
      ? { ...notification, isRead: true }
      : notification,
  )
}

const filterMeta: Record<
  NotificationFilter,
  { emptyTitle: string; emptyText: string }
> = {
  all: {
    emptyTitle: 'No notifications yet',
    emptyText: 'Fresh updates about lessons, achievements, and AI help will show up here.',
  },
  learning: {
    emptyTitle: 'No learning alerts',
    emptyText: 'New lessons, AI recaps, and editor reminders will appear here.',
  },
  achievements: {
    emptyTitle: 'No achievement updates',
    emptyText: 'Badges, streaks, and weekly recap wins will show up here.',
  },
}

const getBadgeTone = (segment: NotificationSegment) =>
  segment === 'learning'
    ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/70 dark:bg-sky-950/40 dark:text-sky-300'
    : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-300'

function EmptyState({ filter }: { filter: NotificationFilter }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div className="rounded-full bg-slate-100 p-4 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
        <Bell className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {filterMeta[filter].emptyTitle}
      </p>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        {filterMeta[filter].emptyText}
      </p>
    </div>
  )
}

function NotificationRow({
  notification,
  onAction,
}: {
  notification: DevHubNotification
  onAction: (notification: DevHubNotification) => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition hover:border-sky-200 hover:bg-sky-50/50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-sky-900/70 dark:hover:bg-sky-950/10">
      <div className="flex gap-3">
        <Avatar className="mt-0.5 size-10 border border-slate-200/80 dark:border-slate-800">
          <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
          <AvatarFallback className="bg-sky-100 text-sky-800 dark:bg-slate-800 dark:text-slate-100">
            {notification.actor.fallback}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm leading-6 text-slate-800 dark:text-slate-200">
                <span className="font-semibold text-slate-950 dark:text-white">
                  {notification.actor.name}
                </span>{' '}
                <span>{notification.action}</span>{' '}
                <span className="font-semibold text-slate-950 dark:text-white">
                  {notification.target}
                </span>
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{notification.timestamp}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span>{notification.timeAgo}</span>
              </div>
            </div>

            {!notification.isRead ? (
              <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
            ) : null}
          </div>

          <div className="mt-3 space-y-3">
            <Badge
              variant="outline"
              className={cn(
                'rounded-full border px-2.5 py-1 text-[11px] font-medium',
                getBadgeTone(notification.segment),
              )}
            >
              {notification.badge}
            </Badge>

            <div className="rounded-xl bg-slate-100/80 p-3 text-sm leading-6 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {notification.content}
            </div>

            <Button
              size="sm"
              variant={notification.segment === 'learning' ? 'default' : 'outline'}
              onClick={() => onAction(notification)}
              className="h-8 rounded-full px-3"
            >
              {notification.actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const NotificationsMenu = ({
  align = 'end',
  className,
  open,
  onOpenChange,
  triggerClassName,
  userName,
}: NotificationsMenuProps) => {
  const navigate = useNavigate()
  const { setIsOpen: setAssistantOpen } = useAIAssistant()
  const { showToast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<NotificationFilter>('all')
  const [notifications, setNotifications] = useState<DevHubNotification[]>(() =>
    hydrateNotifications(userName),
  )

  const resolvedOpen = open ?? internalOpen
  const setResolvedOpen = onOpenChange ?? setInternalOpen

  useEffect(() => {
    setNotifications(hydrateNotifications(userName))
  }, [userName])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const readIds = notifications
      .filter((notification) => notification.isRead)
      .map((notification) => notification.id)

    localStorage.setItem(NOTIFICATION_READ_STORAGE_KEY, JSON.stringify(readIds))
  }, [notifications])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  )

  const learningCount = useMemo(
    () => notifications.filter((notification) => notification.segment === 'learning').length,
    [notifications],
  )

  const achievementsCount = useMemo(
    () => notifications.filter((notification) => notification.segment === 'achievements').length,
    [notifications],
  )

  const getNotificationsForFilter = (filter: NotificationFilter) => {
    if (filter === 'all') {
      return notifications
    }

    return notifications.filter((notification) => notification.segment === filter)
  }

  const markNotificationRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const handleNotificationAction = (notification: DevHubNotification) => {
    markNotificationRead(notification.id)

    if (notification.actionType === 'assistant') {
      setAssistantOpen(true)
      showToast('AI Assistant opened', 'success', 'top-right')
      setResolvedOpen(false)
      return
    }

    if (notification.actionType === 'toast') {
      showToast(notification.toastMessage || 'Notification updated', 'info', 'top-right')
      setResolvedOpen(false)
      return
    }

    if (notification.href) {
      navigate(notification.href)
      setResolvedOpen(false)
    }
  }

  const handleMarkAllRead = () => {
    if (!unreadCount) {
      showToast('Everything is already up to date.', 'info', 'top-right')
      return
    }

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    )
    showToast('All notifications marked as read', 'success', 'top-right')
  }

  const openNotificationSettings = () => {
    setResolvedOpen(false)
    window.setTimeout(() => {
      setIsSettingsOpen(true)
    }, 60)
  }

  return (
    <>
      <DropdownMenu open={resolvedOpen} onOpenChange={setResolvedOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'relative h-10 w-10 rounded-full border-slate-200 bg-white/85 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100 dark:hover:bg-slate-900',
              triggerClassName,
            )}
            aria-label="Open notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border-2 border-white bg-emerald-500 px-1 text-[10px] font-bold text-white dark:border-slate-950">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          sideOffset={10}
          className={cn(
            'w-[min(440px,calc(100vw-1rem))] rounded-[28px] border border-slate-200 bg-white/95 p-0 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/95',
            className,
          )}
        >
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="space-y-5 p-5 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">
                    DevHub updates
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">
                    Notifications
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Lessons, AI help, streaks, and wins across your DevHub journey.
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    onClick={openNotificationSettings}
                    title="Notification settings"
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-3 dark:border-sky-900/60 dark:bg-sky-950/25">
                  <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Learning</span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                    {learningCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/25">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <Trophy className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Wins</span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                    {achievementsCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-3 dark:border-violet-900/60 dark:bg-violet-950/25">
                  <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Unread</span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                    {unreadCount}
                  </p>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as NotificationFilter)}>
                <TabsList className="h-auto w-full justify-start rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
                  <TabsTrigger value="all" className="rounded-xl">
                    All
                    <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-[11px]">
                      {notifications.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="learning" className="rounded-xl">
                    Learning
                    <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-[11px]">
                      {learningCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="rounded-xl">
                    Wins
                    <Badge variant="secondary" className="ml-1 h-5 rounded-full px-1.5 text-[11px]">
                      {achievementsCount}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                {(['all', 'learning', 'achievements'] as NotificationFilter[]).map((filter) => (
                  <TabsContent key={filter} value={filter} className="mt-4">
                    <CardContent className="p-0">
                      <ScrollArea className="max-h-[24rem] pr-2">
                        <div className="space-y-3">
                          {getNotificationsForFilter(filter).length ? (
                            getNotificationsForFilter(filter).map((notification) => (
                              <NotificationRow
                                key={notification.id}
                                notification={notification}
                                onAction={handleNotificationAction}
                              />
                            ))
                          ) : (
                            <EmptyState filter={filter} />
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </TabsContent>
                ))}
              </Tabs>
            </CardHeader>

            <CardContent className="border-t border-slate-200/80 p-4 dark:border-slate-800/80">
              <div className="flex items-center justify-between rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-2 text-sky-600 shadow-sm dark:bg-slate-950 dark:text-sky-300">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Stay in your flow
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Review progress or jump straight back into practice.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full px-3"
                    onClick={() => {
                      navigate('/dashboard')
                      setResolvedOpen(false)
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 rounded-full px-3"
                    onClick={() => {
                      navigate('/editor')
                      setResolvedOpen(false)
                    }}
                  >
                    <Code2 className="mr-1.5 h-3.5 w-3.5" />
                    Practice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>

      <DevHubSettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  )
}

export default NotificationsMenu
