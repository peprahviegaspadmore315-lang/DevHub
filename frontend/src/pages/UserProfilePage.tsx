import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BookOpen,
  Code2,
  Globe,
  ImagePlus,
  LayoutDashboard,
  Pencil,
  Sparkles,
  Target,
  Trophy,
  Trash2,
  Upload,
} from 'lucide-react'

import Awards from '@/components/ui/award'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NotificationsMenu from '@/components/ui/notifications-menu'
import { OrbitalLoader } from '@/components/ui/orbital-loader'
import ProfileCard from '@/components/ui/profile-card'
import TestimonialCarousel from '@/components/ui/profile-card-testimonial-carousel'
import { useToast } from '@/components/ui/toast-1'
import { useImageUpload } from '@/components/ui/use-image-upload'
import UserDropdown from '@/components/ui/user-dropdown'
import { useAIAssistant } from '@/contexts/AIAssistantContext'
import { cn } from '@/lib/utils'
import { applyThemePreference, isDarkThemeEnabled } from '@/lib/theme'
import { certificatesApi } from '@/services/api'
import { useAuthStore } from '@/store'
import type { Certificate as DevHubCertificate } from '@/types'

const normalizeOptionalWebsite = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}

const formatAchievementDate = (value?: string) => {
  if (!value) {
    return 'Recently earned'
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const achievementLevelCycle = ['gold', 'platinum', 'silver', 'bronze'] as const

const inferAwardLevel = (value: string | undefined, index = 0) => {
  const normalized = value?.toLowerCase() || ''

  if (normalized.includes('platinum')) return 'platinum' as const
  if (normalized.includes('gold')) return 'gold' as const
  if (normalized.includes('silver')) return 'silver' as const
  if (normalized.includes('bronze')) return 'bronze' as const

  return achievementLevelCycle[index % achievementLevelCycle.length]
}

interface Badge {
  id: number
  name: string
  icon: string
  earnedAt: string
}

interface UserProfile {
  id: number
  email: string
  username: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  bio: string | null
  phone: string | null
  location: string | null
  website: string | null
  profession: string | null
  company: string | null
  role: string
  coursesEnrolled: number
  coursesCompleted: number
  exercisesCompleted: number
  quizzesCompleted: number
  certificatesEarned?: number
  totalPointsEarned: number
  hacksEarned?: number
  badges?: Badge[]
  createdAt: string
}

type ProfileTab = 'profile' | 'badges' | 'certificates'

const getProfileTabFromSearch = (searchParams: URLSearchParams): ProfileTab => {
  const requestedTab = searchParams.get('tab')

  if (
    requestedTab === 'profile' ||
    requestedTab === 'badges' ||
    requestedTab === 'certificates'
  ) {
    return requestedTab
  }

  return 'profile'
}

const UserProfilePage = () => {
  const navigate = useNavigate()
  const { username } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { accessToken, user, logout, updateUser } = useAuthStore()
  const { setIsOpen: setAssistantOpen } = useAIAssistant()
  const { showToast } = useToast()
  const normalizedRouteUsername = username?.trim()
  const isOwnProfile = !normalizedRouteUsername || normalizedRouteUsername === user?.username?.trim()
  const [activeTab, setActiveTab] = useState<ProfileTab>(() => getProfileTabFromSearch(searchParams))
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [certificates, setCertificates] = useState<DevHubCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('online')
  const [avatar, setAvatar] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    profession: '',
    company: '',
  })

  useEffect(() => {
    const nextTab = getProfileTabFromSearch(searchParams)
    setActiveTab((currentTab) => (currentTab === nextTab ? currentTab : nextTab))
  }, [searchParams])

  const applyProfileToForm = (data: UserProfile) => {
    setFormData({
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      bio: data.bio || '',
      phone: data.phone || '',
      location: data.location || '',
      website: data.website || '',
      profession: data.profession || '',
      company: data.company || '',
    })
    setAvatar(data.avatarUrl || '')
  }

  const {
    previewUrl,
    fileName,
    fileInputRef,
    isDragging,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useImageUpload({
    initialUrl: avatar || null,
    onUpload: setAvatar,
    onRemove: () => setAvatar(''),
    onError: (message) => showToast(message, 'error', 'top-right'),
    uploadContextLabel: 'profile picture',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = normalizedRouteUsername
          ? `/api/profile/u/${encodeURIComponent(normalizedRouteUsername)}`
          : '/api/profile'
        const headers: HeadersInit = {}

        if (!normalizedRouteUsername && accessToken) {
          headers.Authorization = `Bearer ${accessToken}`
        }

        const response = await fetch(endpoint, { headers })

        if (!response.ok) {
          if (!normalizedRouteUsername && (response.status === 401 || response.status === 403)) {
            useAuthStore.getState().logout()
            navigate('/login', { replace: true })
            return
          }
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        setProfile(data)
        applyProfileToForm(data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        showToast('Failed to load profile', 'error', 'top-right')
      } finally {
        setLoading(false)
      }
    }

    if (normalizedRouteUsername && username !== normalizedRouteUsername) {
      navigate(`/u/${encodeURIComponent(normalizedRouteUsername)}`, { replace: true })
      return
    }

    if (normalizedRouteUsername || accessToken) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [accessToken, navigate, normalizedRouteUsername, username])

  useEffect(() => {
    let active = true

    const fetchCertificates = async () => {
      if (!isOwnProfile || !accessToken) {
        setCertificates([])
        return
      }

      try {
        const response = await certificatesApi.getAll()
        if (active) {
          setCertificates(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error)
        if (active) {
          setCertificates([])
        }
      }
    }

    fetchCertificates()

    return () => {
      active = false
    }
  }, [accessToken, isOwnProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const trimmedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value.trim()])
      ) as typeof formData

      const payload = Object.fromEntries(
        Object.entries({
          ...trimmedFormData,
          website: normalizeOptionalWebsite(trimmedFormData.website),
        }).filter(([, value]) => value !== undefined && value !== '')
      )

      payload.avatarUrl = avatar.trim() ? avatar.trim() : ''

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        const validationMessage =
          error?.errors && typeof error.errors === 'object'
            ? Object.values(error.errors)[0]
            : null

        if (response.status === 401 || response.status === 403) {
          logout()
          navigate('/login', { replace: true })
          throw new Error('Your session expired. Please sign in again.')
        }

        throw new Error(
          (typeof validationMessage === 'string' && validationMessage) ||
            error.message ||
            'Failed to update profile'
        )
      }

      const updatedProfile = await response.json()
      const mergedProfile = { ...profile!, ...updatedProfile }
      setProfile(mergedProfile)
      setAvatar(mergedProfile.avatarUrl || '')
      updateUser({
        firstName: mergedProfile.firstName || undefined,
        lastName: mergedProfile.lastName || undefined,
        avatarUrl: mergedProfile.avatarUrl || undefined,
        username: mergedProfile.username,
        email: mergedProfile.email,
        role: mergedProfile.role,
      })
      setEditing(false)
      showToast('Profile updated successfully', 'success', 'top-right')
    } catch (error) {
      console.error('Failed to update profile:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to update profile',
        'error',
        'top-right'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <OrbitalLoader
          message="Loading your profile, achievements, and DevHub identity..."
          size="lg"
        />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-4 text-slate-600 dark:text-slate-400">Profile not found</p>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
  const displayName = fullName || profile.username
  const initials =
    (displayName || profile.username)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'DH'

  const profileSkills = [
    profile.profession,
    profile.company,
    profile.location,
    profile.role.replace(/_/g, ' '),
    profile.coursesCompleted > 0 ? `${profile.coursesCompleted} courses completed` : '',
  ].filter(Boolean).slice(0, 5) as string[]

  const fallbackCertificateTitles = [
    'HTML Foundations',
    'CSS Layout Systems',
    'Java Foundations',
    'Python Fundamentals',
  ]

  const fallbackCertificates: DevHubCertificate[] =
    certificates.length === 0 && (profile.certificatesEarned || 0) > 0
      ? Array.from({ length: Math.min(profile.certificatesEarned || 0, 3) }, (_, index) => ({
          id: -(index + 1),
          userId: profile.id,
          courseId: index + 1,
          certificateCode: `DEVHUB-${profile.id}-${index + 1}`,
          recipientName: displayName,
          courseName: fallbackCertificateTitles[index % fallbackCertificateTitles.length],
          issuedDate: profile.createdAt,
          status: 'ACTIVE',
        }))
      : []

  const showcasedCertificates = certificates.length > 0 ? certificates : fallbackCertificates
  const certificateTotalCount =
    certificates.length > 0 ? certificates.length : profile.certificatesEarned || 0
  const featuredCertificate = showcasedCertificates[0]

  const dropdownUser = {
    name: displayName,
    username: `@${profile.username.trim()}`,
    avatar: profile.avatarUrl ?? user?.avatarUrl ?? null,
    initials: (displayName || profile.username)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'DH',
    status: selectedStatus,
  }

  const handleUserAction = (action: string) => {
    switch (action) {
      case 'profile':
        navigate('/profile')
        return
      case 'dashboard':
        navigate('/dashboard')
        return
      case 'appearance': {
        const nextIsDark = !isDarkThemeEnabled()
        applyThemePreference(nextIsDark)
        showToast(`Switched to ${nextIsDark ? 'dark' : 'light'} mode`, 'success', 'top-right')
        return
      }
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

  const profileLinks = [
    profile.website
      ? {
          icon: Globe,
          label: 'Website',
          href: profile.website,
          external: true,
        }
      : null,
    isOwnProfile
      ? {
          icon: LayoutDashboard,
          label: 'Dashboard',
          href: '/dashboard',
        }
      : null,
    {
      icon: BookOpen,
      label: 'Courses',
      href: '/courses',
    },
    {
      icon: Code2,
      label: 'Editor',
      href: '/editor',
    },
  ].filter(Boolean) as Array<{
    icon: typeof Globe
    label: string
    href: string
    external?: boolean
  }>

  const statsCards = [
    {
      title: 'Courses Completed',
      value: profile.coursesCompleted,
      helper: 'Learning paths finished',
      icon: Trophy,
      tone: 'from-emerald-500 to-teal-500',
      accent: 'from-emerald-500/18 via-teal-500/10 to-transparent',
      eyebrow: profile.coursesEnrolled > 0 ? `${profile.coursesEnrolled} enrolled now` : 'Ready for a first path',
      actionLabel: 'Open learning paths',
      onClick: () => navigate('/courses'),
    },
    {
      title: 'Exercises Completed',
      value: profile.exercisesCompleted,
      helper: 'Practice sessions finished',
      icon: Target,
      tone: 'from-violet-500 to-fuchsia-500',
      accent: 'from-violet-500/18 via-fuchsia-500/10 to-transparent',
      eyebrow: profile.quizzesCompleted > 0 ? `${profile.quizzesCompleted} quizzes completed` : 'Practice builds fluency',
      actionLabel: 'Open practice tools',
      onClick: () => navigate('/editor'),
    },
    {
      title: 'Certificates',
      value: certificateTotalCount,
      helper: 'Verified achievements',
      icon: Award,
      tone: 'from-amber-500 to-orange-500',
      accent: 'from-amber-500/18 via-orange-500/10 to-transparent',
      eyebrow: certificateTotalCount > 0 ? 'Ready to showcase' : 'Complete a path to earn one',
      actionLabel: 'View certificates',
      onClick: () => {
        setActiveTab('certificates')
        setSearchParams((currentParams) => {
          const nextParams = new URLSearchParams(currentParams)
          nextParams.set('tab', 'certificates')
          return nextParams
        })
      },
    },
    {
      title: 'Total Points',
      value: profile.totalPointsEarned,
      helper: 'Points earned on DevHub',
      icon: Sparkles,
      tone: 'from-sky-500 to-cyan-500',
      accent: 'from-sky-500/18 via-cyan-500/10 to-transparent',
      eyebrow: (profile.badges?.length || 0) > 0 ? `${profile.badges?.length || 0} badges earned` : 'Keep the streak moving',
      actionLabel: 'See badge momentum',
      onClick: () => {
        setActiveTab('badges')
        setSearchParams((currentParams) => {
          const nextParams = new URLSearchParams(currentParams)
          nextParams.set('tab', 'badges')
          return nextParams
        })
      },
    },
  ]

  const profileHighlightItems = [
    {
      name: displayName,
      title: profile.profession || 'DevHub learner profile',
      description:
        profile.bio ||
        `${displayName} is building skills on DevHub through guided courses, interactive tutorials, and hands-on coding practice.`,
      imageUrl:
        profile.avatarUrl ||
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      links: profileLinks.slice(0, 4),
      eyebrow: 'Public identity',
    },
    {
      name: `${profile.coursesCompleted} courses completed`,
      title: `${profile.exercisesCompleted} exercises solved • ${profile.totalPointsEarned} total points`,
      description: `${displayName} has enrolled in ${profile.coursesEnrolled} course${profile.coursesEnrolled === 1 ? '' : 's'} and is steadily building practical momentum through lessons, quizzes, and practice sessions on DevHub.`,
      imageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      links: [
        { icon: BookOpen, label: 'Courses', href: '/courses' },
        ...(isOwnProfile ? [{ icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' }] : []),
        { icon: Code2, label: 'Editor', href: '/editor' },
      ],
      eyebrow: 'Learning momentum',
    },
    {
      name: profile.company || profile.location || 'Keep building your journey',
      title: `${certificateTotalCount} certificates • ${profile.badges?.length || 0} badges`,
      description: profile.website
        ? `Your profile is ready to represent your DevHub journey. Keep growing your portfolio, share your work, and use your website plus learning activity to stand out.`
        : `Add more wins to your profile by earning certificates, completing more exercises, and turning your DevHub activity into a strong public learning portfolio.`,
      imageUrl:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
      links: [
        ...(profile.website ? [{ icon: Globe, label: 'Website', href: profile.website, external: true }] : []),
        { icon: BookOpen, label: 'Continue learning', href: '/courses' },
        { icon: Code2, label: 'Practice', href: '/editor' },
      ],
      eyebrow: 'Next milestone',
    },
  ]

  const tabOptions: Array<{
    id: ProfileTab
    label: string
  }> = [
    { id: 'profile', label: 'Profile Overview' },
    { id: 'badges', label: `Badges (${profile.badges?.length || 0})` },
    { id: 'certificates', label: `Certificates (${certificateTotalCount})` },
  ]

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab)

    const nextSearchParams = new URLSearchParams(searchParams)
    if (tab === 'profile') {
      nextSearchParams.delete('tab')
    } else {
      nextSearchParams.set('tab', tab)
    }

    setSearchParams(nextSearchParams, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.18),transparent_30%)]" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">DevHub Profile</p>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {displayName}&apos;s learning space
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-100/85 sm:text-base">
                Showcase progress, completed courses, badges, and everything you are building across DevHub.
              </p>
            </div>

            {isOwnProfile ? (
              <div className="relative z-10 flex items-center gap-3 self-start">
                <NotificationsMenu
                  userName={displayName}
                  triggerClassName="border-white/20 bg-white/10 text-white shadow-[0_20px_45px_-35px_rgba(14,165,233,0.95)] hover:bg-white/20 hover:text-white dark:border-slate-700/80 dark:bg-slate-900/60"
                />
                <UserDropdown
                  user={dropdownUser}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  onAction={handleUserAction}
                  highlightLabel="Learner"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl -mt-14 px-4 sm:px-6 lg:px-8">
        <ProfileCard
          className="mb-8"
          name={displayName}
          role={profile.profession || 'DevHub learner'}
          email={profile.email}
          avatarSrc={
            profile.avatarUrl ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
          }
          statusText={profile.coursesCompleted > 0 || profile.exercisesCompleted > 0 ? 'Actively learning on DevHub' : 'Profile live on DevHub'}
          statusColor={profile.coursesCompleted > 0 || profile.exercisesCompleted > 0 ? 'bg-emerald-500' : 'bg-sky-500'}
          bio={
            profile.bio ||
            `${displayName} is building skills on DevHub through guided courses, interactive tutorials, and hands-on coding practice.`
          }
          skills={profileSkills}
          primaryActionLabel={isOwnProfile ? 'Edit Profile' : 'Explore Courses'}
          primaryActionIcon={isOwnProfile ? Pencil : BookOpen}
          onPrimaryAction={() => {
            if (isOwnProfile) {
              setEditing(true)
            } else {
              navigate('/courses')
            }
          }}
          profileLinks={profileLinks}
        />

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon

            return (
              <button
                type="button"
                key={stat.title}
                onClick={stat.onClick}
                className="group relative overflow-hidden rounded-[1.65rem] border border-slate-200 bg-white p-5 text-left shadow-[0_22px_46px_-36px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_30px_60px_-34px_rgba(14,165,233,0.28)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800"
              >
                <div className={cn('absolute inset-x-0 top-0 h-24 bg-gradient-to-br', stat.accent)} />
                <div className="relative mb-4 flex items-center justify-between">
                  <div className={`rounded-xl bg-gradient-to-r ${stat.tone} p-3 text-white shadow-lg`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 transition-colors group-hover:bg-sky-50 group-hover:text-sky-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-800 dark:group-hover:text-sky-300">
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                    {stat.eyebrow}
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{stat.helper}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-colors group-hover:text-sky-600 dark:text-sky-300 dark:group-hover:text-sky-200">
                    {stat.actionLabel}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {isOwnProfile && editing && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Profile</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Update your public DevHub profile details and personal information.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-sky-200 bg-gradient-to-br from-sky-500 via-cyan-500 to-violet-500 text-3xl font-semibold text-white shadow-[0_20px_50px_-30px_rgba(14,165,233,0.7)] dark:border-sky-900/60">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Profile preview" className="h-full w-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    {previewUrl ? (
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute bottom-0 right-0 rounded-full bg-rose-500 p-2 text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400"
                        aria-label="Remove profile picture"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile Picture</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Add a clear photo so your DevHub profile feels personal and recognizable across the app.
                    </p>

                    <div
                      onClick={handleThumbnailClick}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        'mt-4 cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-white p-4 transition-all hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-sky-700 dark:hover:bg-sky-950/20',
                        isDragging && 'border-sky-400 bg-sky-50 shadow-[0_20px_45px_-35px_rgba(56,189,248,0.9)] dark:bg-sky-950/30'
                      )}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                          {previewUrl ? <Upload className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {previewUrl ? 'Replace your current picture' : 'Upload a new profile picture'}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Click to browse or drag and drop an image file here.
                          </p>
                          {fileName ? (
                            <p className="mt-2 truncate text-xs font-medium uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">
                              {fileName}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleThumbnailClick()
                          }}
                          className="min-w-[145px]"
                        >
                          {previewUrl ? 'Choose another image' : 'Choose image'}
                        </Button>
                        {previewUrl ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleRemove()
                            }}
                            className="min-w-[135px]"
                          >
                            Remove image
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">About</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="input min-h-[120px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Profession
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="input"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={saving} className="sm:min-w-[180px]">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    applyProfileToForm(profile)
                    setEditing(false)
                  }}
                  className="sm:min-w-[180px]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-3 dark:border-slate-800">
            <div className="flex flex-wrap gap-2">
              {tabOptions.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Courses Enrolled
                    </h3>
                    <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {profile.coursesEnrolled}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Hackos Earned
                    </h3>
                    <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {profile.hacksEarned || 0}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Account Information</h3>
                  <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/50">
                      <p className="text-slate-500 dark:text-slate-400">Email</p>
                      <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{profile.email}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/50">
                      <p className="text-slate-500 dark:text-slate-400">Member Since</p>
                      <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/50">
                      <p className="text-slate-500 dark:text-slate-400">Role</p>
                      <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                        {profile.role.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/50">
                      <p className="text-slate-500 dark:text-slate-400">Location</p>
                      <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                        {profile.location || 'Not added yet'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <TestimonialCarousel
                    items={profileHighlightItems}
                    heading="Your DevHub profile story"
                    description="A rotating snapshot of how your profile looks to you and to the wider DevHub learning community."
                  />
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-sky-50 to-cyan-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">
                    DevHub badges
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Skill milestones earned through hands-on progress
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    These badges highlight consistent learning, completed exercises, and meaningful milestones across your DevHub journey.
                  </p>
                </div>

                {profile.badges && profile.badges.length > 0 ? (
                  <div className="grid gap-5 lg:grid-cols-2">
                    {profile.badges.map((badge, index) => (
                      <Awards
                        key={badge.id}
                        variant="badge"
                        title={badge.name}
                        subtitle="Achievement unlocked on DevHub"
                        description="Earned through course completion, practice sessions, and steady progress across your learning path."
                        date={formatAchievementDate(badge.earnedAt)}
                        recipient={displayName}
                        level={inferAwardLevel(badge.name, index)}
                        customIcon={<span className="text-3xl leading-none">{badge.icon}</span>}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">
                      Complete courses and exercises to start earning badges on DevHub.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-white via-amber-50 to-orange-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-300">
                    Verified certificates
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Course completion awards that belong on your DevHub profile
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Earned certificates appear here as polished DevHub achievement cards, with live recipient details and issue dates when available.
                  </p>
                </div>

                {featuredCertificate ? (
                  <div className="space-y-6">
                    <Awards
                      variant="award"
                      title="CERTIFIED"
                      subtitle={featuredCertificate.courseName}
                      description={`Verified completion award for ${featuredCertificate.courseName}. Certificate code: ${featuredCertificate.certificateCode}.`}
                      recipient={featuredCertificate.recipientName || displayName}
                      date={formatAchievementDate(featuredCertificate.issuedDate)}
                      level={inferAwardLevel(featuredCertificate.courseName, 0)}
                    />

                    {showcasedCertificates.slice(1).length > 0 ? (
                      <div className="grid gap-5 lg:grid-cols-2">
                        {showcasedCertificates.slice(1).map((certificate, index) => (
                          <Awards
                            key={certificate.id}
                            variant="certificate"
                            title={certificate.courseName}
                            subtitle="DevHub course completion certificate"
                            description={`Status: ${certificate.status}. Certificate code: ${certificate.certificateCode}.`}
                            recipient={certificate.recipientName || displayName}
                            date={formatAchievementDate(certificate.issuedDate)}
                            level={inferAwardLevel(certificate.courseName, index + 1)}
                            showIcon
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
                    <p className="mb-4 text-slate-500 dark:text-slate-400">
                      {certificateTotalCount
                        ? `You have earned ${certificateTotalCount} certificate${certificateTotalCount === 1 ? '' : 's'} so far.`
                        : "You haven't earned any certificates yet."}
                    </p>
                    <Link to="/courses" className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-300">
                      Start a course →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
