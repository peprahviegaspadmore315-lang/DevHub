import React from 'react'
import { Code2, Sparkles } from 'lucide-react'

import { useAIAssistant } from '@/contexts/AIAssistantContext'

type ExplainCodeButtonProps = {
  code?: string
  language?: string
}

const normalizeLanguage = (language?: string) => {
  switch (language?.trim().toLowerCase()) {
    case 'javascript':
      return 'JavaScript'
    case 'typescript':
      return 'TypeScript'
    case 'python':
      return 'Python'
    case 'html':
      return 'HTML'
    case 'css':
      return 'CSS'
    case 'react':
      return 'React'
    case 'java':
      return 'Java'
    case 'sql':
      return 'SQL'
    case 'c++':
      return 'C++'
    default:
      return ''
  }
}

export const ExplainCodeButton: React.FC<ExplainCodeButtonProps> = ({
  code,
  language,
}) => {
  const {
    learningContext,
    setLearningContext,
    setExplainCodeDraft,
    setExplainLanguageDraft,
    openAssistantTab,
  } = useAIAssistant()

  const normalizedCode = code?.trim() ?? ''
  const hasCode = normalizedCode.length > 0

  const handleClick = () => {
    if (!hasCode) {
      return
    }

    const normalizedLanguage =
      normalizeLanguage(language) || normalizeLanguage(learningContext?.language)

    setExplainCodeDraft(normalizedCode)
    setExplainLanguageDraft(normalizedLanguage)
    setLearningContext({
      ...(learningContext ?? { source: 'explain-code-button' }),
      source: learningContext?.source ?? 'explain-code-button',
      language: language?.trim() ?? learningContext?.language,
      codeExample: normalizedCode,
    })
    openAssistantTab('explain')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!hasCode}
      className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#f97316_0%,#fb923c_45%,#f59e0b_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_44px_-28px_rgba(249,115,22,0.85)] transition hover:translate-y-[-1px] hover:shadow-[0_28px_50px_-28px_rgba(249,115,22,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {hasCode ? <Sparkles className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
      {hasCode
        ? `Explain this ${language ? language.toUpperCase() : 'code'}`
        : 'Paste code to unlock explanation'}
    </button>
  )
}
