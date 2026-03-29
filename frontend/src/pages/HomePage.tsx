import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Award, BarChart3, BookOpen, Code2, Layers3, Sparkles, Target, Users } from 'lucide-react'
import DevHubWordmark from '@/components/ui/devhub-wordmark'
import HeroSection from '@/components/ui/hero-section-9'
import { buildFallbackCourses, buildFallbackPlatformSummary } from '@/lib/course-catalog-fallback'
import { coursesApi } from '@/services/api'
import type { Course, PlatformSummary } from '@/types'

const HomePage = () => {
  const navigate = useNavigate()
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [platformSummary, setPlatformSummary] = useState<PlatformSummary | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const fallbackCourses = buildFallbackCourses()
      const fallbackSummary = buildFallbackPlatformSummary()
      const [coursesRes, summaryRes] = await Promise.allSettled([
        coursesApi.getAll(),
        coursesApi.getSummary(),
      ])

      if (coursesRes.status === 'fulfilled') {
        setAllCourses(coursesRes.value.data.length > 0 ? coursesRes.value.data : fallbackCourses)
      } else {
        console.error('Failed to fetch courses:', coursesRes.reason)
        setAllCourses(fallbackCourses)
      }

      if (summaryRes.status === 'fulfilled') {
        setPlatformSummary(summaryRes.value.data)
      } else {
        console.error('Failed to fetch platform summary:', summaryRes.reason)
        setPlatformSummary(fallbackSummary)
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

  const fallbackLessons = allCourses.reduce((acc, c) => acc + (c.lessonsCount || 0), 0)
  const fallbackExercises = allCourses.reduce((acc, c) => acc + (c.exercisesCount || 0), 0)

  const totalCourses = platformSummary?.courses ?? allCourses.length
  const totalLessons = platformSummary?.tutorials ?? fallbackLessons
  const totalExercises = platformSummary?.exercises ?? fallbackExercises
  const totalUsers = platformSummary?.users ?? 0

  const formatStatValue = (value: number) => new Intl.NumberFormat().format(Math.max(0, value))

  const homeStats = [
    {
      label: 'Courses',
      value: formatStatValue(totalCourses),
      helper: 'Published learning paths ready to open now.',
      href: '/courses',
      cta: 'Browse courses',
      icon: BookOpen,
      accent: 'from-sky-500/15 via-cyan-500/10 to-transparent',
      iconTone: 'bg-sky-50 text-sky-600',
    },
    {
      label: 'Tutorials',
      value: formatStatValue(totalLessons),
      helper: 'Guided lesson topics across your tutorial library.',
      href: '/topics',
      cta: 'Explore tutorials',
      icon: Layers3,
      accent: 'from-violet-500/15 via-fuchsia-500/10 to-transparent',
      iconTone: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Exercises',
      value: formatStatValue(totalExercises),
      helper: 'Hands-on practice items tracked from the real catalog.',
      href: '/editor',
      cta: 'Start practicing',
      icon: Code2,
      accent: 'from-amber-500/15 via-orange-500/10 to-transparent',
      iconTone: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Users',
      value: formatStatValue(totalUsers),
      helper: 'Featured learner voices and profile snapshots from the DevHub community.',
      href: '/testimonials',
      cta: 'Read testimonies',
      icon: Users,
      accent: 'from-emerald-500/15 via-teal-500/10 to-transparent',
      iconTone: 'bg-emerald-50 text-emerald-600',
    },
  ] as const

  const featureCards = [
    {
      title: 'Interactive Learning',
      description: 'Practice coding directly in your browser with the live DevHub code editor and hands-on exercises.',
      href: '/editor',
      cta: 'Open code editor',
      icon: Target,
      accent: 'from-sky-500/15 via-cyan-500/12 to-transparent',
      iconTone: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'Track Progress',
      description: 'Monitor your learning journey with dashboard snapshots, progress history, and profile momentum.',
      href: '/dashboard',
      cta: 'View dashboard',
      icon: BarChart3,
      accent: 'from-violet-500/15 via-fuchsia-500/12 to-transparent',
      iconTone: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'Earn Certificates',
      description: 'Complete courses and collect verified DevHub certificates you can showcase from your profile.',
      href: '/profile?tab=certificates',
      cta: 'See certificates',
      icon: Award,
      accent: 'from-amber-500/15 via-orange-500/12 to-transparent',
      iconTone: 'bg-amber-50 text-amber-600',
    },
  ] as const

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Learn. Build. Design.
            <br />
            with{' '}
            <DevHubWordmark
              devClassName="text-sky-500"
              hubClassName="text-cyan-500"
            />
          </>
        }
        subtitle="Start right after the splash with guided tutorials, practical exercises, and a built-in code playground designed for beginners who want to learn by doing."
        actions={[
          {
            text: 'Start Learning',
            onClick: () => navigate('/topics'),
            variant: 'default',
          },
          {
            text: 'Open Code Editor',
            onClick: () => navigate('/editor'),
            variant: 'outline',
            className: 'border-sky-200 bg-white/85 text-sky-700 hover:bg-sky-50',
          },
        ]}
        stats={[
          {
            value: formatStatValue(totalLessons),
            label: 'Interactive lessons',
            icon: <BookOpen className="h-5 w-5" />,
          },
          {
            value: formatStatValue(totalExercises),
            label: 'Practice exercises',
            icon: <Code2 className="h-5 w-5" />,
          },
          {
            value: formatStatValue(totalCourses),
            label: 'Guided learning paths',
            icon: <Sparkles className="h-5 w-5" />,
          },
        ]}
        images={[
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
        ]}
      />

      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-sky-100 bg-white/80 px-5 py-4 text-sm text-slate-600 shadow-sm">
        <span className="font-semibold text-slate-900">Quick start:</span>
        <Link to="/courses" className="text-primary hover:text-primary/80 font-medium">
          Browse Courses
        </Link>
        <Link to="/topics" className="text-primary hover:text-primary/80 font-medium">
          Explore Tutorials
        </Link>
        <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
          Create Account
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {homeStats.map((stat) => {
          const Icon = stat.icon

          return (
            <Link
              key={stat.label}
              to={stat.href}
              className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_28px_55px_-34px_rgba(14,165,233,0.35)]"
            >
              <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${stat.accent}`} />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className={`rounded-2xl p-3 shadow-sm ${stat.iconTone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition duration-300 group-hover:border-sky-200 group-hover:text-sky-600">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-4xl font-bold tracking-tight text-slate-950">{stat.value}</p>
                  <p className="mt-2 text-base font-semibold text-slate-700">{stat.label}</p>
                  <p className="mt-2 min-h-[3rem] text-sm leading-6 text-slate-500">
                    {stat.helper}
                  </p>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                  {stat.cta}
                </div>
              </div>
            </Link>
          )
        })}
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
        {featureCards.map((feature) => {
          const Icon = feature.icon

          return (
            <Link
              key={feature.title}
              to={feature.href}
              className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.38)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_28px_55px_-34px_rgba(14,165,233,0.35)]"
            >
              <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${feature.accent}`} />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-2xl p-3 shadow-sm ${feature.iconTone}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition duration-300 group-hover:border-sky-200 group-hover:text-sky-600">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-500">{feature.description}</p>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-colors group-hover:text-sky-600">
                  {feature.cta}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          )
        })}
      </section>
    </div>
  )
}

export default HomePage
