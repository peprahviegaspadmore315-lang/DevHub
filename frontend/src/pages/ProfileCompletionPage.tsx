import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DottedSurface } from '@/components/ui/dotted-surface'
import DevHubWordmark from '@/components/ui/devhub-wordmark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast-1'
import { useImageUpload } from '@/components/ui/use-image-upload'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store'
import { ImagePlus, Trash2, Upload } from 'lucide-react'

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

const ProfileCompletionPage = () => {
  const navigate = useNavigate()
  const { user, accessToken, updateUser } = useAuthStore()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState<string>('')
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    profession: '',
    company: '',
  })

  const initials =
    `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase() || 'DH'

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
    if (!accessToken) {
      showToast('Please sign in again to complete your profile.', 'error', 'top-right')
      navigate('/login', { replace: true })
    }
  }, [accessToken, navigate, showToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
          useAuthStore.getState().logout()
          navigate('/login', { replace: true })
          throw new Error('Your session expired. Please sign in again.')
        }

        throw new Error(
          (typeof validationMessage === 'string' && validationMessage) ||
            error.message ||
            'Failed to complete profile'
        )
      }

      const updatedUser = await response.json()
      updateUser(updatedUser)
      showToast('Profile setup completed! Welcome to DevHub!', 'success', 'top-right')
      navigate(`/u/${(updatedUser.username ?? user?.username ?? 'profile').trim()}`, { replace: true })
    } catch (error: any) {
      showToast(error.message || 'Failed to complete profile. Please try again.', 'error', 'top-right')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate(`/u/${(user?.username ?? 'profile').trim()}`, { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(43,124,247,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(109,40,217,0.18),transparent_26%),linear-gradient(135deg,#04050b_0%,#090a12_46%,#05060d_100%)]">
      <DottedSurface className="absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_22%),linear-gradient(90deg,rgba(34,211,238,0.08),transparent_18%,transparent_82%,rgba(34,211,238,0.08))]" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to{' '}
            <DevHubWordmark
              tone="light"
              devClassName="text-sky-300"
              hubClassName="text-cyan-400"
            />
          </h1>
          <p className="text-gray-400">Let&apos;s set up your profile and give your learning space a clear identity.</p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-cyan-400/20 bg-[#090b14]/78 p-8 shadow-[0_30px_80px_-40px_rgba(34,211,238,0.45)] backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-4 text-center">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="relative mx-auto inline-flex">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-gradient-to-br from-cyan-500 via-sky-500 to-violet-500 shadow-[0_20px_50px_-25px_rgba(56,189,248,0.65)]">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-5xl font-semibold tracking-wide text-white">
                      {initials}
                    </div>
                  )}
                </div>
                {previewUrl ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRemove()
                    }}
                    className="absolute bottom-0 right-0 rounded-full border border-rose-300/40 bg-rose-500 p-2 text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400"
                    aria-label="Remove profile picture"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <div
                onClick={handleThumbnailClick}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'mx-auto max-w-xl cursor-pointer rounded-2xl border border-dashed border-cyan-400/25 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:border-cyan-300/45 hover:bg-cyan-400/[0.06]',
                  isDragging && 'border-cyan-300/60 bg-cyan-400/[0.1] shadow-[0_20px_60px_-35px_rgba(34,211,238,0.85)]'
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 text-cyan-200">
                    {previewUrl ? <Upload className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
                  </div>

                  <div className="flex-1">
                    <p className="text-base font-semibold text-white">
                      {previewUrl ? 'Replace your profile picture' : 'Upload a profile picture'}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Click to browse or drag and drop an image here. We&apos;ll optimize it for your DevHub profile.
                    </p>
                    {fileName ? (
                      <p className="mt-2 truncate text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/80">
                        {fileName}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <Button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleThumbnailClick()
                    }}
                    className="min-w-[150px] bg-gradient-to-r from-cyan-600 via-sky-500 to-violet-500 text-white hover:from-cyan-500 hover:via-sky-400 hover:to-violet-400"
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
                      className="min-w-[140px] border-slate-700 bg-slate-950/40 text-slate-200 hover:bg-slate-900 hover:text-white"
                    >
                      Remove image
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Peprah"
                  className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Padmore"
                  className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">About You</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself and your learning goals..."
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
            </div>

            {/* Contact Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (510) 555-8234"
                className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
            </div>

            {/* Location & Website */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="San Francisco, USA"
                  className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="yourportfolio.com"
                  className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  placeholder="Product Manager"
                  className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company here"
                  className="w-full px-4 py-3 bg-[#0a0a10]/80 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 py-3 bg-[#0a0a10]/80 border border-cyan-500/30 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-300 hover:border-cyan-500/50"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 hover:from-cyan-500 hover:via-purple-500 hover:to-cyan-500 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Complete Profile'
                )}
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm">
              You can update this information anytime in your profile settings
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileCompletionPage
