import React from 'react'
import { ArrowRight, Bot, Sparkles, Target } from 'lucide-react'

import { useAIAssistant } from '@/contexts/AIAssistantContext'

type SmartQuizLauncherProps = {
  topic?: string
  content?: string
  language?: string
  className?: string
}

export const SmartQuizLauncher: React.FC<SmartQuizLauncherProps> = ({
  topic,
  content,
  language,
  className,
}) => {
  const { openAssistantTab, setLearningContext } = useAIAssistant()

  const handleLaunch = () => {
    if (topic || content || language) {
      setLearningContext({
        source: 'smart-quiz-launcher',
        route: window.location.pathname + window.location.search,
        language: language || undefined,
        topicTitle: topic || undefined,
        topicSummary: content || undefined,
        lessonContent: content || undefined,
      })
    }

    openAssistantTab('quiz')
  }

  return (
    <div className={className ?? ''}>
      <div className="relative overflow-hidden rounded-[1.8rem] border border-orange-200/70 bg-[linear-gradient(135deg,#fffaf3_0%,#fff0da_52%,#ffe5c4_100%)] p-5 text-slate-900 shadow-[0_22px_44px_-30px_rgba(234,88,12,0.55)]">
        <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-orange-700 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Robot AI Quiz
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-orange-600">
              <Target className="h-3.5 w-3.5" />
              5 guided checks
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">
                Turn this lesson into a polished mini quiz.
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                DevHub AI opens straight into quiz mode and builds a focused practice flow from
                your current topic, not a generic list of questions.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLaunch}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316_0%,#ea580c_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_-18px_rgba(234,88,12,0.85)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_36px_-20px_rgba(234,88,12,0.9)]"
            >
              <Bot className="h-4 w-4" />
              Launch AI quiz
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            {topic ? (
              <span className="rounded-full border border-orange-200/70 bg-white/80 px-3 py-1.5 font-medium">
                Topic: {topic}
              </span>
            ) : null}
            {language ? (
              <span className="rounded-full border border-orange-200/70 bg-white/80 px-3 py-1.5 font-medium">
                Language: {language.toUpperCase()}
              </span>
            ) : null}
            <span className="rounded-full border border-orange-200/70 bg-white/80 px-3 py-1.5 font-medium">
              Guided onboarding-style layout
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
