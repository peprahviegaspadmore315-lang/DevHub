import { courseData } from '@/data/courseData'
import { migrateGuestLearningStateToUser } from '@/lib/learning-progress'
import { useAuthStore } from '@/store'
import type { AuthResponse, User } from '@/types'

export const completeAuthenticatedSession = ({
  accessToken,
  refreshToken,
  user,
}: AuthResponse): User => {
  useAuthStore.getState().setAuth(user, accessToken, refreshToken)

  migrateGuestLearningStateToUser({
    userId: user.id,
    courses: courseData.map((course) => ({
      id: course.id,
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
      })),
    })),
  })

  return user
}
