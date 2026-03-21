import { useParams, Link } from 'react-router-dom'

const Lesson = () => {
  const { lessonId, courseId } = useParams()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Lesson {lessonId ?? 1}</h1>
      <p className="text-gray-600">Course ID: {courseId ?? 'N/A'}</p>
      <article className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Introduction</h2>
        <p className="text-gray-700">This lesson walks you through the fundamentals of building apps in a simple, practical way.</p>
      </article>
      <div className="flex gap-2">
        <Link to={`/courses/${courseId}`} className="px-4 py-2 rounded bg-gray-100 text-gray-700">Back to course</Link>
        <Link to="/editor" className="px-4 py-2 rounded bg-primary-600 text-white">Open Editor</Link>
      </div>
    </div>
  )
}

export default Lesson
