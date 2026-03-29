/**
 * CodeExampleCard Component
 * Displays code examples with syntax highlighting and execution capabilities
 */

import { useState } from 'react'
import { CodeExampleDTO } from '@/services/learningContentApi'
import { Copy, Play } from 'lucide-react'

interface CodeExampleCardProps {
  example: CodeExampleDTO
}

const CodeExampleCard = ({ example }: CodeExampleCardProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(example.codeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRun = () => {
    // Open in code editor
    window.location.href = `/editor?code=${encodeURIComponent(
      example.codeContent
    )}&language=${example.language}`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{example.title}</h3>
          {example.description && (
            <p className="text-sm text-gray-600 mt-1">{example.description}</p>
          )}
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
          {example.language}
        </span>
      </div>

      {/* Code */}
      <div className="bg-gray-900 text-gray-100 p-6 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed">
          <code>{example.codeContent}</code>
        </pre>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {example.outputExpected && (
            <p>Expected output: {example.outputExpected}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors font-medium"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {example.isExecutable && (
            <button
              onClick={handleRun}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors font-medium"
            >
              <Play className="h-4 w-4" />
              Run Code
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeExampleCard
