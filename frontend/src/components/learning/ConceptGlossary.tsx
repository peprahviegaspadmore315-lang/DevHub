/**
 * ConceptGlossary Component
 * Displays key terms and concepts for a lesson
 */

import { useState } from 'react'
import { ConceptDTO } from '@/services/learningContentApi'
import { ChevronDown } from 'lucide-react'

interface ConceptGlossaryProps {
  concepts: ConceptDTO[]
}

const ConceptGlossary = ({ concepts }: ConceptGlossaryProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Concepts</h3>
      {concepts.map((concept) => (
        <div
          key={concept.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() =>
              setExpandedId(expandedId === concept.id ? null : concept.id)
            }
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 text-left">
              {concept.term}
            </h4>
            <ChevronDown
              className={`h-5 w-5 text-gray-600 transition-transform ${
                expandedId === concept.id ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedId === concept.id && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 space-y-3">
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Definition</h5>
                <p className="text-gray-700">{concept.definition}</p>
              </div>

              {concept.example && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Example</h5>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                    <code>{concept.example}</code>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ConceptGlossary
