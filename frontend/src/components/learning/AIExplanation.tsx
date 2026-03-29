import React from 'react'

interface AIExplanationProps {
  topicTitle?: string
  topicContent?: string
  language?: string
  className?: string
}

const AIExplanation: React.FC<AIExplanationProps> = ({ topicTitle, topicContent, language = 'unknown', className = '' }) => {
  return (
    <div className={`ai-explanation ${className}`}>
      <p><strong>{topicTitle}</strong> ({language}) explanation placeholder</p>
      <p>{topicContent || 'No content available yet.'}</p>
    </div>
  )
}

export default AIExplanation
