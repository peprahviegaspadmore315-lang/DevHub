import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from '@/components/CourseCard'
import { coursesApi } from '@/services/api'
import type { Course } from '@/types'

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, coursesRes] = await Promise.all([
          coursesApi.getFeatured(),
          coursesApi.getAll(),
        ])
        setFeaturedCourses(featuredRes.data)
        setAllCourses(coursesRes.data)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'badge-success'
      case 'INTERMEDIATE':
        return 'badge-warning'
      case 'ADVANCED':
        return 'badge-danger'
      default:
        return 'badge-primary'
    }
  }

  const getCourseThumbnail = (course: Course) => {
    const slug = (course.slug ?? '').toLowerCase()
    const title = (course.title ?? '').toLowerCase()

    if (slug.includes('javascript') || title.includes('javascript')) return 'javascript.png'
    if (slug.includes('python') || title.includes('python')) return 'python.png'
    if (slug.includes('css') || title.includes('css')) return 'css.png'
    if (slug.includes('html') || title.includes('html')) return 'html.png'
    return 'placeholder.png'
  }

  const getCourseProgress = (course: Course) => {
    const value = (course.orderIndex ?? 1) * 15
    return Math.min(95, Math.max(5, value % 100))
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 px-8">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:30px_30px]" />
        <div className="relative max-w-3xl">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Learn to Code
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            Interactive tutorials with "Try It Yourself" code editor. 
            Master programming with hands-on exercises and quizzes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/courses"
              className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              Start Learning
            </Link>
            <Link
              to="/editor"
              className="px-6 py-3 bg-primary-500/30 text-white font-semibold rounded-lg hover:bg-primary-500/40 transition-colors"
            >
              Open Code Editor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Courses', value: allCourses.length },
          { label: 'Tutorials', value: allCourses.reduce((acc, c) => acc + (c.lessonsCount || 0), 0) },
          { label: 'Exercises', value: allCourses.reduce((acc, c) => acc + (c.exercisesCount || 0), 0) },
          { label: 'Users', value: '10K+' },
        ].map((stat, i) => (
          <div key={i} className="card p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
            <p className="text-gray-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Featured Courses */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                difficulty={course.difficulty}
                description={course.description || 'Get hands-on experience with this course.'}
                lessons={course.lessonsCount ?? 0}
                thumbnail={getCourseThumbnail(course)}
                progress={getCourseProgress(course)}
              />
            ))}
          </div>
        )}
      </section>

      {/* All Courses */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="card card-hover p-4"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{course.category}</p>
              <span className={`badge ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: '🎯',
            title: 'Interactive Learning',
            description: 'Practice coding directly in your browser with our interactive code editor.',
          },
          {
            icon: '📊',
            title: 'Track Progress',
            description: 'Monitor your learning journey with progress tracking and achievements.',
          },
          {
            icon: '🏆',
            title: 'Earn Certificates',
            description: 'Complete courses and earn verified certificates to showcase your skills.',
          },
        ].map((feature, i) => (
          <div key={i} className="card p-6">
            <span className="text-3xl mb-3 block">{feature.icon}</span>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default HomePage
