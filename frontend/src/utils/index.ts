const normalizeApiBaseUrl = (rawBaseUrl?: string) => {
  const baseUrl = (rawBaseUrl || '/api').trim().replace(/\/+$/, '')

  if (baseUrl === '' || baseUrl === '/api') {
    return '/api'
  }

  if (baseUrl.endsWith('/api')) {
    return baseUrl
  }

  return `${baseUrl}/api`
}

export const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)

export const getAccessToken = () => {
  const auth = JSON.parse(localStorage.getItem('auth-storage') || '{}')
  return auth.state?.accessToken || null
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const calculateProgress = (completed: number, total: number) => {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'BEGINNER':
      return 'text-green-600 bg-green-100'
    case 'INTERMEDIATE':
      return 'text-yellow-600 bg-yellow-100'
    case 'ADVANCED':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}
