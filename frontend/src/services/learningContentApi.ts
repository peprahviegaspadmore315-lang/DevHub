/**
 * Learning Content API Service
 * Handles all API calls for the learning content system
 */

import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '@/store'

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

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)

class LearningContentService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/learning`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.api.interceptors.request.use((config) => {
      const token = useAuthStore.getState().accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  // ============================================
  // TOPIC OPERATIONS
  // ============================================

  async getAllTopics(): Promise<TopicDTO[]> {
    const response = await this.api.get<TopicDTO[]>('/topics')
    return response.data
  }

  async getTopicDetail(slug: string): Promise<TopicDetailDTO> {
    const response = await this.api.get<TopicDetailDTO>(`/topics/${slug}`)
    return response.data
  }

  // ============================================
  // CHAPTER OPERATIONS
  // ============================================

  async getTopicChapters(topicSlug: string): Promise<ChapterDTO[]> {
    const response = await this.api.get<ChapterDTO[]>(
      `/topics/${topicSlug}/chapters`
    )
    return response.data
  }

  async getChapterDetail(
    topicSlug: string,
    chapterSlug: string
  ): Promise<ChapterDetailDTO> {
    const response = await this.api.get<ChapterDetailDTO>(
      `/topics/${topicSlug}/chapters/${chapterSlug}`
    )
    return response.data
  }

  // ============================================
  // LESSON OPERATIONS
  // ============================================

  async getLessonDetail(
    topicSlug: string,
    lessonSlug: string,
    userId?: number
  ): Promise<LessonDetailDTO> {
    const params = userId ? { userId } : {}
    const response = await this.api.get<LessonDetailDTO>(
      `/topics/${topicSlug}/lessons/${lessonSlug}`,
      { params }
    )
    return response.data
  }

  // ============================================
  // PROGRESS TRACKING
  // ============================================

  async markLessonComplete(lessonId: number): Promise<void> {
    const userId = this.getUserId()
    await this.api.post(`/progress/${lessonId}/complete`, null, {
      headers: { 'X-User-Id': userId },
    })
  }

  async updateLessonProgress(
    lessonId: number,
    progressPercentage: number
  ): Promise<void> {
    const userId = this.getUserId()
    await this.api.put(
      `/progress/${lessonId}`,
      {},
      {
        params: { progressPercentage },
        headers: { 'X-User-Id': userId },
      }
    )
  }

  async getTopicProgress(topicId: number): Promise<TopicProgressDTO> {
    const userId = this.getUserId()
    const response = await this.api.get<TopicProgressDTO>(
      `/topics/${topicId}/progress`,
      {
        headers: { 'X-User-Id': userId },
      }
    )
    return response.data
  }

  private getUserId(): number {
    const userId = useAuthStore.getState().user?.id
    if (!userId) {
      throw new Error('User ID not found in auth state')
    }
    return userId
  }
}

// Export singleton instance
export const learningAPI = new LearningContentService()

// ============================================
// TYPESCRIPT INTERFACES
// ============================================

export interface TopicDTO {
  id: number
  slug: string
  name: string
  description: string
  colorCode: string
  iconEmoji: string
  orderIndex: number
  active: boolean
}

export interface TopicDetailDTO {
  id: number
  slug: string
  name: string
  description: string
  colorCode: string
  iconEmoji: string
  chapters: ChapterDTO[]
  totalLessons: number
  totalDuration: number
}

export interface ChapterDTO {
  id: number
  topicId: number
  slug: string
  title: string
  description: string
  orderIndex: number
  lessonCount: number
}

export interface ChapterDetailDTO {
  id: number
  topicId: number
  slug: string
  title: string
  description: string
  lessons: LessonSummaryDTO[]
}

export interface LessonSummaryDTO {
  id: number
  slug: string
  title: string
  difficultyLevel: string
  estimatedTimeMinutes: number
  orderIndex: number
}

export interface LessonDetailDTO {
  id: number
  slug: string
  title: string
  explanation: string
  contentHtml: string
  difficultyLevel: string
  estimatedTimeMinutes: number
  chapterId: number
  topicId: number
  orderIndex: number
  codeExamples: CodeExampleDTO[]
  videoReferences: VideoReferenceDTO[]
  exercises: ExerciseDTO[]
  concepts: ConceptDTO[]
  progress?: LessonProgressDTO
}

export interface CodeExampleDTO {
  id: number
  title: string
  description: string
  codeContent: string
  language: string
  orderIndex: number
  isExecutable: boolean
  outputExpected: string
}

export interface VideoReferenceDTO {
  id: number
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  durationMinutes: number
  orderIndex: number
}

export interface ExerciseDTO {
  id: number
  title: string
  description: string
  starterCode: string
  solutionCode?: string
  language: string
  difficulty: string
  orderIndex: number
}

export interface ConceptDTO {
  id: number
  term: string
  definition: string
  example: string
  orderIndex: number
}

export interface LessonProgressDTO {
  completed: boolean
  progressPercentage: number
  completedAt?: string
}

export interface TopicProgressDTO {
  topicId: number
  totalLessons: number
  completedLessons: number
  completionPercentage: number
}
