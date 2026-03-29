/**
 * LessonViewer Component
 * Displays a complete lesson with:
 * - Explanation and learning content
 * - Code examples with syntax highlighting
 * - Embedded YouTube videos
 * - Practice exercises
 * - Key concepts/glossary
 * - Progress tracking
 */

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { learningAPI, LessonDetailDTO } from '@/services/learningContentApi'
import { useAuthStore } from '@/store'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'
import CodeExampleCard from './CodeExampleCard'
import ExerciseCard from './ExerciseCard'
import ConceptGlossary from './ConceptGlossary'

const LessonViewer = () => {
  const { topicSlug, lessonSlug } = useParams<{
    topicSlug: string
    lessonSlug: string
  }>()
  const [lesson, setLesson] = useState<LessonDetailDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<
    'content' | 'code' | 'video' | 'exercise' | 'concepts'
  >('content')
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchLesson = async () => {
      if (!topicSlug || !lessonSlug) return

      try {
        setLoading(true)
        const data = await learningAPI.getLessonDetail(
          topicSlug,
          lessonSlug,
          user?.id
        )
        setLesson(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load lesson'
        )
        console.error('Error fetching lesson:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [topicSlug, lessonSlug, user?.id])

  const handleMarkComplete = async () => {
    if (!lesson) return
    try {
      if (!user?.id) {
        alert('Please log in to track progress')
        return
      }
      await learningAPI.markLessonComplete(lesson.id)
      // Update UI
      setLesson((prev) =>
        prev
          ? {
              ...prev,
              progress: {
                completed: true,
                progressPercentage: 100,
                completedAt: new Date().toISOString(),
              },
            }
          : null
      )
    } catch (err) {
      console.error('Error marking lesson complete:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error || 'Lesson not found'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {lesson.title}
          </h1>
          {lesson.progress?.completed && (
            <CheckCircle className="h-8 w-8 text-green-600" />
          )}
        </div>

        <div className="flex items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{lesson.estimatedTimeMinutes} minutes</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            lesson.difficultyLevel === 'BEGINNER'
              ? 'bg-green-100 text-green-800'
              : lesson.difficultyLevel === 'INTERMEDIATE'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {lesson.difficultyLevel}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-8 flex gap-8">
        {[
          { id: 'content', label: 'Learn', count: 1 },
          {
            id: 'code',
            label: 'Code Examples',
            count: lesson.codeExamples.length,
          },
          {
            id: 'video',
            label: 'Videos',
            count: lesson.videoReferences.length,
          },
          {
            id: 'exercise',
            label: 'Exercises',
            count: lesson.exercises.length,
          },
          {
            id: 'concepts',
            label: 'Concepts',
            count: lesson.concepts.length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(
                tab.id as
                  | 'content'
                  | 'code'
                  | 'video'
                  | 'exercise'
                  | 'concepts'
              )
            }
            className={`pb-4 px-4 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mb-12">
        {/* Learn Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Explanation
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {lesson.explanation}
              </p>
            </div>

            {/* HTML Content */}
            {lesson.contentHtml && (
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
                />
              </div>
            )}

            {/* Complete Button */}
            <div className="flex justify-end">
              <button
                onClick={handleMarkComplete}
                disabled={lesson.progress?.completed}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  lesson.progress?.completed
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {lesson.progress?.completed
                  ? '✓ Completed'
                  : 'Mark as Complete'}
              </button>
            </div>
          </div>
        )}

        {/* Code Examples Tab */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            {lesson.codeExamples.length > 0 ? (
              lesson.codeExamples.map((example) => (
                <CodeExampleCard key={example.id} example={example} />
              ))
            ) : (
              <p className="text-gray-600">No code examples available</p>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            {/* {lesson.videoReferences.length > 0 ? (
              <VideoSection video={lesson.videoReferences[0]} />
            ) : (
              <p className="text-gray-600">No videos available</p>
            )} */}
            <p className="text-gray-600">Videos coming soon</p>
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === 'exercise' && (
          <div className="space-y-6">
            {lesson.exercises.length > 0 ? (
              lesson.exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))
            ) : (
              <p className="text-gray-600">No exercises available</p>
            )}
          </div>
        )}

        {/* Concepts Tab */}
        {activeTab === 'concepts' && (
          <div>
            {lesson.concepts.length > 0 ? (
              <ConceptGlossary concepts={lesson.concepts} />
            ) : (
              <p className="text-gray-600">No concepts available</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonViewer
