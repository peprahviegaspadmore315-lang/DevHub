import { useState } from 'react'
import CourseCard from '@/components/CourseCard'

const coursesMock = [
  { id: 1, title: 'JavaScript Basics', difficulty: 'BEGINNER', thumbnail: 'javascript.png', lessons: 20, description: 'Learn core JS syntax, variables and functions.' },
  { id: 2, title: 'React for Beginners', difficulty: 'INTERMEDIATE', thumbnail: 'react.png', lessons: 18, description: 'Build dynamic UIs with React components and hooks.' },
  { id: 3, title: 'Node.js API Development', difficulty: 'ADVANCED', thumbnail: 'nodejs.png', lessons: 22, description: 'Create RESTful APIs with Node and Express.' },
]


const Courses = () => {
  const [courses] = useState(coursesMock)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-5">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Programming Tutorials</h1>
          <p className="text-gray-500">Learn from real projects and build production-level skills.</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-5">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            difficulty={course.difficulty}
            description={course.description}
            lessons={course.lessons}
            thumbnail={course.thumbnail}
          />
        ))}
      </div>
    </div>
  )
}

export default Courses
