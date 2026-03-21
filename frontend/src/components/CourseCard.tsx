import { Link } from 'react-router-dom'

type CourseCardProps = {
  id: number
  title: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  description: string
  lessons: number
  thumbnail: string
  progress: number
}

const difficultyClass = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
  ADVANCED: 'bg-red-100 text-red-800',
}

const CourseCard = ({ id, title, difficulty, description, lessons, thumbnail, progress }: CourseCardProps) => {
  const imageUrl = `/${thumbnail}`
  const fallbackUrl = '/placeholder.png'

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="h-40 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement
            if (!img.src.endsWith('/placeholder.png')) {
              img.src = fallbackUrl
            } else {
              img.style.display = 'none'
            }
          }}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 min-h-[3.5rem]">{description}</p>
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${difficultyClass[difficulty]}`}>
            {difficulty}
          </span>
          <span className="text-xs text-gray-500">{lessons} lessons</span>
        </div>

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>

        <Link
          to={`/courses/${id}`}
          className="inline-block rounded bg-[#317EFB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#256ad4]"
        >
          Open course
        </Link>
      </div>
    </article>
  )
}

export default CourseCard
