import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  role: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken, refreshToken) => set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      }),
      
      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
)

interface CourseProgress {
  courseId: number
  completedLessons: number
  totalLessons: number
  percentage: number
}

interface ProgressState {
  courseProgress: Record<number, CourseProgress>
  setCourseProgress: (courseId: number, progress: CourseProgress) => void
  updateLessonProgress: (courseId: number, completed: number, total: number) => void
}

export const useProgressStore = create<ProgressState>()((set) => ({
  courseProgress: {},
  
  setCourseProgress: (courseId, progress) => set((state) => ({
    courseProgress: { ...state.courseProgress, [courseId]: progress },
  })),
  
  updateLessonProgress: (courseId, completed, total) => set((state) => ({
    courseProgress: {
      ...state.courseProgress,
      [courseId]: {
        courseId,
        completedLessons: completed,
        totalLessons: total,
        percentage: Math.round((completed / total) * 100),
      },
    },
  })),
}))

interface SidebarState {
  isOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setSidebarOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
)
