import { Award, BookOpen, Code2, Lightbulb, Sparkles } from 'lucide-react'
import InteractiveSelector from '@/components/ui/interactive-selector'
import { courseData, type CourseData } from '@/data/courseData'

const CoursesPage = () => {
  const getShowcasePresentation = (course: CourseData) => {
    const slug = course.slug.toLowerCase()
    const title = course.title.toLowerCase()

    if (slug.includes('html') || title.includes('html')) {
      return {
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        icon: <BookOpen className="h-6 w-6 text-white" />,
      }
    }

    if (slug.includes('css') || title.includes('css')) {
      return {
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        icon: <Lightbulb className="h-6 w-6 text-white" />,
      }
    }

    if (slug.includes('java') || title.includes('java')) {
      return {
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        icon: <Code2 className="h-6 w-6 text-white" />,
      }
    }

    if (slug.includes('python') || title.includes('python')) {
      return {
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
        icon: <Sparkles className="h-6 w-6 text-white" />,
      }
    }

    return {
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      icon: <Award className="h-6 w-6 text-white" />,
    }
  }

  const showcaseCourses = courseData.slice(0, 5).map((course) => {
    const presentation = getShowcasePresentation(course)

    return {
      title: course.title,
      description: course.description || 'Follow the guided lessons and build practical confidence one topic at a time.',
      image: presentation.image,
      icon: presentation.icon,
      link: `/courses/${course.id}`,
      meta: `${course.difficulty} · ${course.lessons.length} lessons`,
    }
  })

  return (
    <div className="space-y-6">
      <InteractiveSelector
        heading="Explore the course library with momentum"
        description="Start with a few standout learning paths, then use search and category filters to narrow down the rest of the catalog."
        items={showcaseCourses}
      />
    </div>
  )
}

export default CoursesPage
