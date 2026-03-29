/**
 * ExerciseCard Component
 * Displays practice exercises with starter code and solution hints
 */

import { useState } from 'react'
import { ExerciseDTO } from '@/services/learningContentApi'
import { ChevronDown, Copy } from 'lucide-react'

interface ExerciseCardProps {
  exercise: ExerciseDTO
}

const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const [showSolution, setShowSolution] = useState(false)

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {exercise.title}
            </h3>
            <p className="text-gray-600 mt-1">{exercise.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
            exercise.difficulty === 'BEGINNER'
              ? 'bg-green-100 text-green-800'
              : exercise.difficulty === 'INTERMEDIATE'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Starter Code Section */}
        {exercise.starterCode && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Starter Code</h4>
              <button
                onClick={() => handleCopyCode(exercise.starterCode)}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed">
                <code>{exercise.starterCode}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {/* <button
            onClick={() => setAttemptOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Play className="h-4 w-4" />
            Try It Yourself
          </button> */}
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showSolution ? 'rotate-180' : ''
              }`}
            />
            Solution
          </button>
        </div>

        {/* Solution Section */}
        {showSolution && exercise.solutionCode && (
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <h4 className="font-semibold text-gray-900">Solution</h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-3">
                Here's one way to solve this exercise:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed">
                  <code>{exercise.solutionCode}</code>
                </pre>
              </div>
              <button
                onClick={() => handleCopyCode(exercise.solutionCode || '')}
                className="mt-3 flex items-center gap-2 px-3 py-2 text-sm bg-white hover:bg-gray-50 rounded transition-colors border border-green-200"
              >
                <Copy className="h-4 w-4" />
                Copy Solution
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExerciseCard
