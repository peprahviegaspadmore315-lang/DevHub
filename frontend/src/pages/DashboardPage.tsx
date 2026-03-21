import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { certificatesApi, enrollmentsApi, coursesApi } from '@/services/api'
import { courseData } from '@/data/courseData'
import type { Enrollment, Certificate, Course } from '@/types'

interface LeaderboardEntry {
  id: string
  username: string
  xp: number
  avatar?: string
}

const DashboardPage = () => {
  const { user } = useAuthStore()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStreak] = useState(1)
  const [totalXP] = useState(350)
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { id: '1', username: 'ChillCat19', xp: 1800, avatar: '🐱' },
    { id: '2', username: user?.username || 'You', xp: 350, avatar: '👤' },
    { id: '3', username: 'AussieMike', xp: 1500, avatar: '🦘' },
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollmentsRes, certificatesRes, coursesRes] = await Promise.all([
          enrollmentsApi.getUserEnrollments(),
          certificatesApi.getAll(),
          coursesApi.getAll(),
        ])
        setEnrollments(enrollmentsRes.data)
        setCertificates(certificatesRes.data)
        setCourses(coursesRes.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const completedCourses = enrollments
    .filter((e) => e.completionPercentage >= 100)
    .map((e) => courses.find((c) => c.id === e.courseId))
    .filter((c): c is Course => !!c)

  const recommendedTutorials = courseData
    .filter((course) => !enrollments.some((e) => e.courseId === course.id))
    .slice(0, 4)

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  const stats = {
    coursesEnrolled: enrollments.length,
    coursesCompleted: completedCourses.length,
    certificatesEarned: certificates.length,
    exercises: 18,
    quizzes: 0,
    challenges: 0,
    lessons: 20,
    totalProgress: enrollments.length > 0
      ? Math.round(enrollments.reduce((acc, e) => acc + e.completionPercentage, 0) / enrollments.length)
      : 0,
  }

  const getStreakDays = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    const today = new Date().getDay()
    return days.map((day, idx) => ({
      day,
      active: idx < today,
    }))
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Welcome Header with Stats */}
      <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hi!</h1>
            <p className="text-primary-100">Welcome back to your learning journey</p>
          </div>
          <span className="text-4xl">👋</span>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          <div>
            <p className="text-2xl font-bold">{totalXP}</p>
            <p className="text-sm text-primary-100">Total XP</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.lessons}</p>
            <p className="text-sm text-primary-100">Lessons</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.exercises}</p>
            <p className="text-sm text-primary-100">Exercises</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.quizzes}</p>
            <p className="text-sm text-primary-100">Quizzes</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Leaderboard & Streak */}
        <div className="lg:col-span-1 space-y-6">
          {/* Leaderboard */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">🏆 League</h2>
              <Link to="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {leaderboard.map((entry, idx) => (
                <div key={entry.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <span className="text-lg font-bold text-gray-400 w-6">{idx + 1}</span>
                  <span className="text-2xl">{entry.avatar}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{entry.username}</p>
                    <p className="text-xs text-gray-500">{entry.xp} XP</p>
                  </div>
                  {idx === 1 && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded font-medium">You</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Streak */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Current Streak</h3>
            <p className="text-3xl font-bold text-orange-500 mb-4">{currentStreak} days</p>
            <div className="flex gap-2">
              {getStreakDays().map((item, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-12 rounded-lg flex items-center justify-center font-semibold text-sm transition ${
                    item.active
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Learning Progress & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Completed Courses */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">✅ Completed Courses</h2>
            {completedCourses.length === 0 ? (
              <p className="text-sm text-gray-500">You haven't completed any courses yet. Keep going!</p>
            ) : (
              <ul className="space-y-2">
                {completedCourses.map((course) => (
                  <li key={course.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2">
                    <span className="text-sm text-gray-700">{course.title}</span>
                    <span className="text-xs text-green-600 font-semibold">Completed</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Overall Progress */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📈 Learning Progress</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Enrolled</span>
                <span>{stats.coursesEnrolled}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Completed</span>
                <span>{stats.coursesCompleted}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Certificates</span>
                <span>{stats.certificatesEarned}</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-emerald-500" style={{ width: `${stats.totalProgress}%` }} />
              </div>
              <p className="text-xs text-gray-500">Overall progress: {stats.totalProgress}%</p>
            </div>
          </div>

          {/* Recommended Tutorials */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🌟 Recommended Tutorials</h2>
            <div className="grid grid-cols-1 gap-2">
              {recommendedTutorials.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="block rounded-lg border border-gray-200 p-3 hover:border-primary-500 hover:bg-white transition"
                >
                  <h4 className="text-sm font-semibold text-gray-900">{course.title}</h4>
                  <p className="text-xs text-gray-500">{course.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Access Cards */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Learning</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/courses"
                className="card p-6 hover:shadow-lg transition flex flex-col items-center justify-center text-center"
              >
                <span className="text-5xl mb-3">💪</span>
                <h3 className="font-semibold text-gray-900 mb-1">Exercises</h3>
                <p className="text-2xl font-bold text-primary-600">{stats.exercises}</p>
                <p className="text-xs text-gray-500 mt-1">0%</p>
              </Link>

              <div className="card p-6 hover:shadow-lg transition flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed">
                <span className="text-5xl mb-3">🎯</span>
                <h3 className="font-semibold text-gray-900 mb-1">Challenges</h3>
                <p className="text-2xl font-bold text-gray-600">{stats.challenges}</p>
                <p className="text-xs text-gray-500 mt-1">0%</p>
              </div>

              <Link
                to="/courses"
                className="card p-6 hover:shadow-lg transition flex flex-col items-center justify-center text-center"
              >
                <span className="text-5xl mb-3">📖</span>
                <h3 className="font-semibold text-gray-900 mb-1">Course</h3>
                <p className="text-xs text-gray-500 mt-2">
                  {enrollments.length > 0 ? `${enrollments.length} enrolled` : 'Explore courses'}
                </p>
              </Link>

              <div className="card p-6 hover:shadow-lg transition flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed">
                <span className="text-5xl mb-3">📝</span>
                <h3 className="font-semibold text-gray-900 mb-1">Test & Exam</h3>
                <p className="text-2xl font-bold text-gray-600">{stats.quizzes}</p>
              </div>
            </div>
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">🏅 Your Certificates</h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <p className="font-medium text-gray-900">{cert.courseName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(cert.issuedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Coding Workspace Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">💻 Coding Workspace</h2>
            <p className="text-sm text-gray-500">Practice and write code in your personal workspace</p>
          </div>
          <Link
            to="/editor"
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
          >
            + New Workspace
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
