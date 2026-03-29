export interface User {
  id: number
  email: string
  username: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  location?: string
  avatarUrl?: string
  bio?: string
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

export interface Course {
  id: number
  title: string
  slug: string
  description: string
  longDescription?: string
  category: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  iconUrl?: string
  bannerUrl?: string
  isPremium: boolean
  price: number
  estimatedHours?: number
  orderIndex: number
  isPublished: boolean
  isFeatured: boolean
  createdBy?: number
  createdByName?: string
  lessonsCount?: number
  exercisesCount?: number
  quizzesCount?: number
  createdAt: string
  updatedAt?: string
}

export interface PlatformSummary {
  courses: number
  tutorials: number
  exercises: number
  users: number
}

export interface Lesson {
  id: number
  courseId: number
  courseTitle: string
  title: string
  slug: string
  content: string
  contentHtml?: string
  codeExample?: string
  videoUrl?: string
  orderIndex: number
  estimatedMinutes?: number
  isPublished: boolean
  isPremium: boolean
  hasNext: boolean
  hasPrevious: boolean
  nextLessonId?: number
  previousLessonId?: number
  createdAt: string
  updatedAt?: string
}

export interface Exercise {
  id: number
  courseId: number
  lessonId?: number
  title: string
  description: string
  instructions: string
  type: 'FILL_BLANK' | 'FIX_CODE' | 'WRITE_CODE' | 'MULTIPLE_CHOICE' | 'CODE_COMPLETION'
  starterCode?: string
  solution: string
  testCases: Record<string, unknown>[]
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  points: number
  hints?: string[]
  constraints?: string
  orderIndex: number
  timeLimitSeconds: number
  isPublished: boolean
}

export interface Quiz {
  id: number
  courseId: number
  lessonId?: number
  title: string
  description?: string
  passingScore: number
  timeLimitMinutes?: number
  shuffleQuestions: boolean
  showCorrectAnswers: boolean
  questionsCount?: number
}

export interface Question {
  id: number
  quizId: number
  questionText: string
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK'
  points: number
  explanation?: string
  orderIndex: number
  answers: Answer[]
}

export interface Answer {
  id: number
  questionId: number
  answerText: string
  isCorrect: boolean
  orderIndex: number
}

export interface Certificate {
  id: number
  userId: number
  courseId: number
  certificateCode: string
  templateId?: string
  recipientName: string
  courseName: string
  issuedDate: string
  expiryDate?: string
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED'
}

export interface Enrollment {
  id: number
  userId: number
  courseId: number
  enrolledAt: string
  completedAt?: string
  completionPercentage: number
}

export interface UserProgress {
  id: number
  userId: number
  courseId: number
  lessonId?: number
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  completionPercentage: number
  timeSpentMinutes: number
  lastAccessedAt?: string
  completedAt?: string
}

export interface ExerciseAttempt {
  id: number
  userId: number
  exerciseId: number
  userCode?: string
  isCorrect: boolean
  output?: string
  errorMessage?: string
  testResults?: Record<string, unknown>
  executionTimeMs?: number
  pointsEarned: number
  attemptNumber: number
  submittedAt: string
}

// API Request/Response types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  location?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  expiresIn: number
}

export interface PasswordResetInitiateResponse {
  message: string
  success: boolean
  codeSent?: boolean
  preview?: boolean
  previewCode?: string
  expiresAt?: string
}

export interface PasswordResetVerifyResponse {
  message: string
  success: boolean
  expiresAt?: string
}

export interface FeedbackRequest {
  category: string
  summary: string
  blockers?: string
  improvements?: string
  pageUrl?: string
  browserInfo?: string
}

export interface FeedbackResponse {
  message: string
  success: boolean
}

export interface ProgrammingNewsArticle {
  id: string
  title: string
  category: string
  subcategory: string
  mediaType?: 'article' | 'video'
  actionLabel?: string
  timeAgo: string
  location: string
  image: string
  gradientColors?: string[]
  content?: string[]
  articleUrl: string
  sourceName: string
  publishedAt?: string
}

export interface ProgrammingNewsResponse {
  title: string
  subtitle: string
  fetchedAt: string
  sources: {
    id: string
    category: string
    subcategory: string
    length: number
    opacity: number
  }[]
  articles: ProgrammingNewsArticle[]
}

export interface CodeExecutionRequest {
  language: string
  code: string
  input?: string
  timeLimit?: number
  memoryLimit?: number
}

export interface CodeExecutionResponse {
  output: string
  success?: boolean
  executionTime?: number
  executionTimeMs?: number
  memory?: number
  exitCode?: number
  language?: string
  timestamp?: string
  status?: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | 'MEMORY_LIMIT_EXCEEDED' | 'RUNTIME_ERROR'
  error?: string
}

export interface ExerciseSubmitRequest {
  code: string
}

export interface ExerciseSubmitResponse {
  isCorrect: boolean
  output: string
  testResults: {
    testCase: number
    passed: boolean
    expected: string
    actual: string
  }[]
  pointsEarned: number
}

export interface SupportedLanguage {
  id: number
  name: string
  version: string
  icon: string
  fileExtension: string
}
