import axios from 'axios'
import { useAuthStore } from '@/store'
import type {
  AuthResponse,
  PasswordResetInitiateResponse,
  PasswordResetVerifyResponse,
  FeedbackRequest,
  FeedbackResponse,
  LoginRequest,
  ProgrammingNewsResponse,
  RegisterRequest,
  Course,
  PlatformSummary,
  Lesson,
  Exercise,
  Quiz,
  Question,
  Certificate,
  Enrollment,
  UserProgress,
  CodeExecutionRequest,
  CodeExecutionResponse,
  ExerciseSubmitRequest,
  ExerciseSubmitResponse,
} from '@/types'

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

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })
          
          const { accessToken, refreshToken: newRefreshToken, user } = response.data
          useAuthStore.getState().setAuth(user, accessToken, newRefreshToken)
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),
  
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data),
  
  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),
  
  logout: () =>
    api.post('/auth/logout'),
  
  me: () =>
    api.get('/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post<PasswordResetInitiateResponse>('/auth/forgot-password', { email }),

  verifyResetCode: (email: string, code: string) =>
    api.post<PasswordResetVerifyResponse>('/auth/verify-reset-code', { email, code }),
  
  resetPassword: (email: string, code: string, newPassword: string) =>
    api.post('/auth/reset-password', { email, code, newPassword }),
  
  googleAuth: () =>
    api.get('/auth/oauth/google'),
  
  googleCallback: (code: string) =>
    api.get('/auth/oauth/google/authorize', { params: { code } }),
  
  githubAuth: () =>
    api.get('/auth/oauth/github'),
  
  githubCallback: (code: string) =>
    api.get('/auth/oauth/github/authorize', { params: { code } }),
  
  biometricLogin: (deviceId: string, signature: string, email?: string) =>
    api.post<AuthResponse>('/auth/biometric', { deviceId, signature, email }),
}

export const feedbackApi = {
  submit: (data: FeedbackRequest) =>
    api.post<FeedbackResponse>('/feedback', data),
}

export const newsApi = {
  getProgrammingNews: (params?: { limit?: number }) =>
    api.get<ProgrammingNewsResponse>('/news/programming', { params }),
}

// Courses API
export const coursesApi = {
  getAll: (params?: { category?: string; page?: number; size?: number }) =>
    api.get<Course[]>('/courses', { params }),
  
  getById: (id: number) =>
    api.get<Course>(`/courses/${id}`),
  
  getBySlug: (slug: string) =>
    api.get<Course>(`/courses/slug/${slug}`),
  
  getFeatured: () =>
    api.get<Course[]>('/courses/featured'),

  getSummary: () =>
    api.get<PlatformSummary>('/courses/summary'),
  
  getCategories: () =>
    api.get<string[]>('/courses/categories'),
  
  getLessons: (courseId: number) =>
    api.get<Lesson[]>(`/lessons/course/${courseId}`),
}

// Lessons API
export const lessonsApi = {
  getById: (id: number) =>
    api.get<Lesson>(`/lessons/${id}`),
  
  getBySlug: (courseId: number, slug: string) =>
    api.get<Lesson>(`/lessons/course/${courseId}/slug/${slug}`),
  
  getNext: (courseId: number, lessonId: number) =>
    api.get<Lesson>(`/lessons/course/${courseId}/next/${lessonId}`),
  
  getPrevious: (courseId: number, lessonId: number) =>
    api.get<Lesson>(`/lessons/course/${courseId}/previous/${lessonId}`),
}

// Exercises API
export const exercisesApi = {
  getAll: (params?: { courseId?: number; lessonId?: number }) =>
    api.get<Exercise[]>('/exercises', { params }),
  
  getById: (id: number) =>
    api.get<Exercise>(`/exercises/${id}`),
  
  submit: (id: number, data: ExerciseSubmitRequest) =>
    api.post<ExerciseSubmitResponse>(`/exercises/${id}/submit`, data),
  
  getSolution: (id: number) =>
    api.get<string>(`/exercises/${id}/solution`),
  
  getHints: (id: number) =>
    api.get<string[]>(`/exercises/${id}/hints`),
}

// Quizzes API
export const quizzesApi = {
  getAll: () =>
    api.get<Quiz[]>('/quizzes'),
  
  getById: (id: number) =>
    api.get<Quiz>(`/quizzes/${id}`),
  
  getQuestions: (id: number) =>
    api.get<Question[]>(`/quizzes/${id}/questions`),
  
  submit: (id: number, answers: Record<number, number>) =>
    api.post(`/quizzes/${id}/submit`, answers),
  
  getResults: (id: number) =>
    api.get(`/quizzes/${id}/results`),
}

// Code Execution API
export const codeExecutionApi = {
  execute: (data: CodeExecutionRequest) =>
    api.post<CodeExecutionResponse>('/code/run', {
      ...data,
      language: data.language.toUpperCase(),
    }),
  
  getLanguages: () =>
    api.get<{ id: string; name: string; extension: string; requiresExecution: boolean; available: boolean }[]>('/code/languages'),
}

// Progress API
export const progressApi = {
  getCourseProgress: (courseId: number) =>
    api.get<UserProgress[]>(`/progress/course/${courseId}`),
  
  markLessonComplete: (lessonId: number) =>
    api.post(`/progress/lesson/${lessonId}/complete`),
  
  getStats: () =>
    api.get('/progress/stats'),
}

// Certificates API
export const certificatesApi = {
  getAll: () =>
    api.get<Certificate[]>('/certificates'),
  
  getById: (id: number) =>
    api.get<Certificate>(`/certificates/${id}`),
  
  verify: (code: string) =>
    api.get<Certificate>(`/certificates/verify/${code}`),
  
  download: (id: number) =>
    api.get(`/certificates/${id}/download`, { responseType: 'blob' }),
}

// Enrollments API
export const enrollmentsApi = {
  enroll: (courseId: number) =>
    api.post(`/courses/${courseId}/enroll`),
  
  getUserEnrollments: () =>
    api.get<Enrollment[]>('/enrollments'),
  
  checkEnrollment: (courseId: number) =>
    api.get<boolean>(`/courses/${courseId}/enrolled`),
}

export default api
