import { useState, useEffect } from 'react'
import CourseCard from '@/components/CourseCard'
import { courseData, CourseData } from '@/data/courseData'

const CoursesPage = () => {
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const categorySet = new Set(courseData.map((c) => c.category))
    setCategories(Array.from(categorySet))
    setLoading(false)
  }, [])

  const filteredCourses = courseData.filter((course) => {
    const matchesCategory = selectedCategory ? course.category === selectedCategory : true
    const matchesSearch = course.title.toLowerCase().includes(searchText.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const mapCourseToCard = (course: CourseData) => {
    const slug = (course.slug ?? '').toLowerCase()
    const title = (course.title ?? '').toLowerCase()

    const thumbnailLookup: Record<string, string> = {
      'html-tutorial': 'html.png',
      'css-tutorial': 'css.png',
      'javascript-tutorial': 'javascript.png',
      'python-tutorial': 'python.png',
    }

    let thumbnail = 'placeholder.png'

    if (thumbnailLookup[slug]) {
      thumbnail = thumbnailLookup[slug]
    } else if (title.includes('javascript')) {
      thumbnail = 'javascript.png'
    } else if (title.includes('python')) {
      thumbnail = 'python.png'
    } else if (title.includes('css')) {
      thumbnail = 'css.png'
    } else if (title.includes('html')) {
      thumbnail = 'html.png'
    }

    const progress = Math.min(Math.max((course.id || 1) * 15 % 100, 5), 95)

    return {
      ...course,
      imageFilename: thumbnail,
      description: course.description || 'Get hands-on experience with this course.',
      lessonsCount: course.lessons.length,
      progress,
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
          <p className="text-gray-500">Choose from our collection of programming tutorials</p>
        </div>
        <div className="w-full md:w-96">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const mapped = mapCourseToCard(course)
            return (
              <CourseCard
                key={mapped.id}
                id={mapped.id}
                title={mapped.title}
                difficulty={mapped.difficulty}
                description={mapped.description}
                lessons={mapped.lessonsCount}
                thumbnail={mapped.imageFilename}
                progress={mapped.progress}
              />
            )
          })}
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No courses found in this category.</p>
        </div>
      )}
    </div>
  )
}

export default CoursesPage
