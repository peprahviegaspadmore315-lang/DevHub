import { Icon } from '@iconify/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type UserStatus = 'online' | 'focus' | 'offline'

type UserAction =
  | 'profile'
  | 'dashboard'
  | 'appearance'
  | 'courses'
  | 'assistant'
  | 'editor'
  | 'help'
  | 'logout'

interface UserMenuUser {
  name: string
  username: string
  avatar?: string | null
  initials: string
  status: UserStatus | string
}

interface UserDropdownProps {
  user?: UserMenuUser
  onAction?: (action: UserAction) => void
  onStatusChange?: (status: string) => void
  selectedStatus?: string
  highlightLabel?: string
}

interface MenuItem {
  icon: string
  label: string
  action: UserAction
  iconClass?: string
  badge?: {
    text: string
    className?: string
  }
  rightIcon?: string
}

const MENU_ITEMS: {
  status: Array<{ value: string; icon: string; label: string }>
  primary: MenuItem[]
  learning: MenuItem[]
  support: MenuItem[]
  account: MenuItem[]
} = {
  status: [
    { value: 'online', icon: 'solar:bolt-circle-line-duotone', label: 'Online' },
    { value: 'focus', icon: 'solar:emoji-funny-circle-line-duotone', label: 'Focus mode' },
    { value: 'offline', icon: 'solar:moon-sleep-line-duotone', label: 'Appear Offline' },
  ],
  primary: [
    { icon: 'solar:user-circle-line-duotone', label: 'Your profile', action: 'profile' },
    { icon: 'solar:widget-add-line-duotone', label: 'Dashboard', action: 'dashboard' },
    { icon: 'solar:sun-line-duotone', label: 'Appearance', action: 'appearance' },
  ],
  learning: [
    {
      icon: 'solar:book-bookmark-line-duotone',
      label: 'Continue learning',
      action: 'courses',
      badge: { text: 'DevHub', className: 'bg-sky-600 text-white text-[11px]' },
    },
    { icon: 'solar:magic-stick-3-line-duotone', label: 'Open AI assistant', action: 'assistant' },
    { icon: 'solar:code-square-line-duotone', label: 'Code editor', action: 'editor' },
  ],
  support: [
    {
      icon: 'solar:question-circle-line-duotone',
      label: 'Help center',
      action: 'help',
      rightIcon: 'solar:square-top-down-line-duotone',
    },
  ],
  account: [
    { icon: 'solar:logout-2-bold-duotone', label: 'Log out', action: 'logout', iconClass: 'text-rose-500' },
  ],
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    online:
      'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/60',
    focus:
      'text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-950/40 dark:border-sky-700/60',
    offline:
      'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700',
  }

  return colors[status.toLowerCase()] || colors.online
}

export const UserDropdown = ({
  user = {
    name: 'DevHub Learner',
    username: '@devhub',
    avatar: null,
    initials: 'DH',
    status: 'online',
  },
  onAction = () => {},
  onStatusChange = () => {},
  selectedStatus = 'online',
  highlightLabel = 'DevHub',
}: UserDropdownProps) => {
  const renderMenuItem = (item: MenuItem, index: number) => (
    <DropdownMenuItem
      key={`${item.action}-${index}`}
      className={cn(
        item.badge || item.rightIcon ? 'justify-between' : '',
        'cursor-pointer rounded-xl p-2.5 text-slate-700 focus:bg-sky-50 focus:text-sky-900 dark:text-slate-200 dark:focus:bg-slate-800 dark:focus:text-white',
      )}
      onClick={() => onAction(item.action)}
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        <Icon
          icon={item.icon}
          className={cn(
            'h-5 w-5 text-slate-500 dark:text-slate-400',
            item.iconClass,
          )}
        />
        {item.label}
      </span>
      {item.badge ? (
        <Badge className={item.badge.className}>{highlightLabel || item.badge.text}</Badge>
      ) : null}
      {item.rightIcon ? (
        <Icon
          icon={item.rightIcon}
          className="h-4 w-4 text-slate-400 dark:text-slate-500"
        />
      ) : null}
    </DropdownMenuItem>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-10 cursor-pointer border border-white/70 shadow-sm dark:border-slate-700">
          <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-white text-[#123a86] dark:bg-slate-900 dark:text-white">
            {user.initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[320px] rounded-2xl border-none bg-transparent p-0 shadow-none"
        align="end"
      >
        <section className="rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/95">
          <div className="flex items-center gap-3 rounded-xl p-2.5">
            <Avatar className="size-11 border border-slate-100 dark:border-slate-800">
              <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-sky-100 text-sky-800 dark:bg-slate-800 dark:text-slate-100">
                {user.initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user.name}
              </h3>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user.username}
              </p>
            </div>

            <Badge
              className={cn(
                'rounded-md border px-2 py-1 text-[11px] font-medium capitalize',
                getStatusColor(user.status),
              )}
            >
              {selectedStatus}
            </Badge>
          </div>

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer rounded-xl p-2.5 text-slate-700 focus:bg-sky-50 focus:text-sky-900 dark:text-slate-200 dark:focus:bg-slate-800 dark:focus:text-white">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Icon
                    icon="solar:smile-circle-line-duotone"
                    className="h-5 w-5 text-slate-500 dark:text-slate-400"
                  />
                  Update status
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="rounded-xl border-slate-200 bg-white/95 p-1 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/95">
                  <DropdownMenuRadioGroup
                    value={selectedStatus}
                    onValueChange={onStatusChange}
                  >
                    {MENU_ITEMS.status.map((statusItem, index) => (
                      <DropdownMenuRadioItem
                        key={`${statusItem.value}-${index}`}
                        value={statusItem.value}
                        className="gap-2 rounded-lg text-slate-700 focus:bg-sky-50 focus:text-sky-900 dark:text-slate-200 dark:focus:bg-slate-800 dark:focus:text-white"
                      >
                        <Icon
                          icon={statusItem.icon}
                          className="h-5 w-5 text-slate-500 dark:text-slate-400"
                        />
                        {statusItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
          <DropdownMenuGroup>{MENU_ITEMS.primary.map(renderMenuItem)}</DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
          <DropdownMenuGroup>{MENU_ITEMS.learning.map(renderMenuItem)}</DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
          <DropdownMenuGroup>{MENU_ITEMS.support.map(renderMenuItem)}</DropdownMenuGroup>
        </section>

        <section className="mt-1 rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/95">
          <DropdownMenuGroup>{MENU_ITEMS.account.map(renderMenuItem)}</DropdownMenuGroup>
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
