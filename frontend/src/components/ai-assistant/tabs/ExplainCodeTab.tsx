import { useEffect, useMemo, useState } from 'react'
import {
  BookOpenText,
  Braces,
  CheckCircle2,
  Code2,
  Copy,
  FileCode2,
  Maximize2,
  Minimize2,
  Minus,
  Pause,
  Play,
  Plus,
  Sparkles,
  Square,
  Volume2,
  Wand2,
} from 'lucide-react'
import { createPortal } from 'react-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { useAIAssistant, type AIAssistantLearningContext } from '@/contexts/AIAssistantContext'
import { getApiUrl } from '@/services/api-client'

import '../AIAssistant.css'

const languageOptions = [
  { label: 'Auto-detect language', value: '' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'Python', value: 'Python' },
  { label: 'HTML', value: 'HTML' },
  { label: 'CSS', value: 'CSS' },
  { label: 'React', value: 'React' },
  { label: 'Java', value: 'Java' },
  { label: 'SQL', value: 'SQL' },
  { label: 'C++', value: 'C++' },
]

const normalizeLanguageOption = (language?: string | null) => {
  if (!language) {
    return ''
  }

  const normalized = language.trim().toLowerCase()
  const option = languageOptions.find(
    (item) => item.value.toLowerCase() === normalized
  )

  return option?.value ?? ''
}

const getLearningFocusTitle = (context: AIAssistantLearningContext | null) =>
  context?.topicTitle || context?.lessonTitle || context?.courseTitle || 'your current lesson'

const getSyntaxLanguage = (language?: string | null) => {
  switch (language?.trim().toLowerCase()) {
    case 'javascript':
      return 'javascript'
    case 'typescript':
      return 'typescript'
    case 'python':
      return 'python'
    case 'html':
      return 'markup'
    case 'css':
      return 'css'
    case 'react':
      return 'tsx'
    case 'java':
      return 'java'
    case 'sql':
      return 'sql'
    case 'c++':
      return 'cpp'
    default:
      return 'javascript'
  }
}

type ParsedExplanation = {
  concepts: string[]
  fallbackNotes: string[]
  lineNotes: Map<number, string[]>
  overview: string[]
  practice: string[]
}

const stripMarkdown = (value: string) =>
  value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[•*-]\s*/, '')
    .trim()

const getCommentLines = (lines: string[], language?: string | null) => {
  const normalized = language?.trim().toLowerCase()

  if (normalized === 'python') {
    return lines.map((line) => (line ? `# ${line}` : '#'))
  }

  if (normalized === 'html') {
    return lines.map((line) => `<!-- ${line} -->`)
  }

  if (normalized === 'css') {
    return lines.map((line) => `/* ${line} */`)
  }

  return lines.map((line) => (line ? `// ${line}` : '//'))
}

const parseExplanation = (explanation: string): ParsedExplanation => {
  const parsed: ParsedExplanation = {
    concepts: [],
    fallbackNotes: [],
    lineNotes: new Map<number, string[]>(),
    overview: [],
    practice: [],
  }

  let currentSection: 'overview' | 'breakdown' | 'concepts' | 'practice' | 'misc' = 'misc'

  for (const rawLine of explanation.split(/\r?\n/)) {
    const trimmed = rawLine.trim()
    if (!trimmed) {
      continue
    }

    const headingMatch = trimmed.match(/^##+\s+(.*)$/)
    if (headingMatch) {
      const heading = headingMatch[1].trim().toLowerCase()

      if (heading.includes('what this code does')) {
        currentSection = 'overview'
      } else if (heading.includes('line by line')) {
        currentSection = 'breakdown'
      } else if (heading.includes('key concepts')) {
        currentSection = 'concepts'
      } else if (heading.includes('try it yourself')) {
        currentSection = 'practice'
      } else {
        currentSection = 'misc'
      }

      continue
    }

    const cleaned = stripMarkdown(trimmed)
    if (!cleaned) {
      continue
    }

    if (currentSection === 'breakdown') {
      const lineMatch = cleaned.match(/^Line\s+(\d+):\s*(.+)$/i)
      if (lineMatch) {
        const lineNumber = Number.parseInt(lineMatch[1], 10)
        const note = lineMatch[2].trim()
        const existing = parsed.lineNotes.get(lineNumber) ?? []
        parsed.lineNotes.set(lineNumber, [...existing, note])
        continue
      }
    }

    if (currentSection === 'overview') {
      parsed.overview.push(cleaned)
    } else if (currentSection === 'concepts') {
      parsed.concepts.push(cleaned)
    } else if (currentSection === 'practice') {
      parsed.practice.push(cleaned)
    } else {
      parsed.fallbackNotes.push(cleaned)
    }
  }

  return parsed
}

const buildAnnotatedCode = ({
  code,
  explanation,
  language,
}: {
  code: string
  explanation: string
  language?: string | null
}) => {
  if (!code.trim()) {
    return ''
  }

  const parsed = parseExplanation(explanation)
  const codeLines = code.split(/\r?\n/)
  const output: string[] = []

  const pushCommentSection = (title: string, lines: string[]) => {
    const normalizedLines = lines.map(stripMarkdown).filter(Boolean)
    if (!normalizedLines.length) {
      return
    }

    output.push(...getCommentLines([title, ...normalizedLines], language))
    output.push('')
  }

  if (parsed.overview.length) {
    pushCommentSection('DevHub overview', parsed.overview)
  } else if (!parsed.lineNotes.size && parsed.fallbackNotes.length) {
    pushCommentSection('DevHub explanation', parsed.fallbackNotes)
  }

  codeLines.forEach((line, index) => {
    const lineNumber = index + 1
    const lineNotes = parsed.lineNotes.get(lineNumber) ?? []

    if (lineNotes.length) {
      output.push(
        ...getCommentLines(
          lineNotes.map((note, noteIndex) =>
            noteIndex === 0 ? `DevHub on line ${lineNumber}: ${note}` : note
          ),
          language
        )
      )
    }

    output.push(line)
  })

  output.push('')

  if (parsed.concepts.length) {
    pushCommentSection('Key concepts to notice', parsed.concepts)
  }

  if (parsed.practice.length) {
    pushCommentSection('Try it yourself next', parsed.practice)
  }

  if (!parsed.overview.length && parsed.lineNotes.size && parsed.fallbackNotes.length) {
    pushCommentSection('Extra DevHub notes', parsed.fallbackNotes)
  }

  return output.join('\n').trim()
}

const buildExplainFallbackPrompt = ({
  code,
  language,
  focusTitle,
}: {
  code: string
  language: string
  focusTitle: string
}) => {
  const languageLabel = language || 'programming'

  return [
    `Explain this ${languageLabel} code for a beginner.`,
    `If relevant, connect the explanation lightly to ${focusTitle}.`,
    'Use this format:',
    '## What This Code Does',
    '## Line by Line Breakdown',
    '## Key Concepts',
    '## Try It Yourself',
    '',
    `\`\`\`${getSyntaxLanguage(language)}`,
    code,
    '```',
  ].join('\n')
}

const getSpeechSupportMessage = () => {
  if (
    typeof window === 'undefined' ||
    typeof window.speechSynthesis === 'undefined' ||
    typeof (window as any).SpeechSynthesisUtterance === 'undefined'
  ) {
    return 'Explanation loaded, but automatic reading is not supported in this browser.'
  }

  return 'Explanation loaded, but DevHub could not start reading automatically. You can still press Read or use the Reading tab.'
}

const clampScale = (value: number) =>
  Math.min(1.7, Math.max(0.9, Number(value.toFixed(2))))

const ExplainCodeTab = () => {
  const {
    learningContext,
    explainCodeDraft,
    setExplainCodeDraft,
    explainLanguageDraft,
    setExplainLanguageDraft,
    readingText,
    isReading,
    isPaused,
    startReading,
    pauseReading,
    stopReading,
    openAssistantTab,
  } = useAIAssistant()

  const [explanation, setExplanation] = useState('')
  const [submittedCode, setSubmittedCode] = useState('')
  const [submittedLanguage, setSubmittedLanguage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [readingNotice, setReadingNotice] = useState('')
  const [copied, setCopied] = useState(false)
  const [sourceFontScale, setSourceFontScale] = useState(1)
  const [previewFontScale, setPreviewFontScale] = useState(1)
  const [previewWrapLongLines, setPreviewWrapLongLines] = useState(true)
  const [expandedSurface, setExpandedSurface] = useState<'source' | 'preview' | null>(null)

  const focusTitle = getLearningFocusTitle(learningContext)
  const lessonCodeExample = learningContext?.codeExample?.trim() ?? ''
  const selectedLanguage =
    normalizeLanguageOption(explainLanguageDraft) ||
    normalizeLanguageOption(learningContext?.language)
  const normalizedExplanation = explanation.trim()
  const isExplanationLoadedForReading =
    normalizedExplanation.length > 0 &&
    readingText.trim() === normalizedExplanation
  const isReadingThisExplanation = isExplanationLoadedForReading && isReading
  const isPausedOnThisExplanation = isExplanationLoadedForReading && isPaused
  const hasDraftChangedSinceExplanation =
    submittedCode.trim().length > 0 &&
    explainCodeDraft.trim().length > 0 &&
    explainCodeDraft.trim() !== submittedCode.trim()
  const submittedLineCount = useMemo(() => {
    if (!submittedCode.trim()) {
      return 0
    }

    return submittedCode.split(/\r?\n/).length
  }, [submittedCode])
  const syntaxLanguage = useMemo(
    () => getSyntaxLanguage(submittedLanguage || selectedLanguage),
    [selectedLanguage, submittedLanguage]
  )
  const annotatedCode = useMemo(
    () =>
      buildAnnotatedCode({
        code: submittedCode,
        explanation: normalizedExplanation,
        language: submittedLanguage || selectedLanguage,
      }),
    [normalizedExplanation, selectedLanguage, submittedCode, submittedLanguage]
  )
  const sourceFontSize = useMemo(
    () => `${(0.92 * sourceFontScale).toFixed(2)}rem`,
    [sourceFontScale]
  )
  const previewFontSize = useMemo(
    () => `${(0.82 * previewFontScale).toFixed(2)}rem`,
    [previewFontScale]
  )

  useEffect(() => {
    if (!explainCodeDraft.trim() && lessonCodeExample) {
      setExplainCodeDraft(lessonCodeExample)
    }
  }, [explainCodeDraft, lessonCodeExample, setExplainCodeDraft])

  useEffect(() => {
    if (!explainLanguageDraft && learningContext?.language) {
      setExplainLanguageDraft(normalizeLanguageOption(learningContext.language))
    }
  }, [explainLanguageDraft, learningContext?.language, setExplainLanguageDraft])

  useEffect(() => {
    if (!expandedSurface) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedSurface(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedSurface])

  const handleExplain = async () => {
    const normalizedCode = explainCodeDraft.trim()
    if (!normalizedCode) {
      setErrorMessage('Paste code first so DevHub has something real to explain.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setReadingNotice('')
    setCopied(false)

    try {
      let nextExplanation = ''

      const response = await fetch(getApiUrl('/api/ai/explain-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: normalizedCode,
          language: selectedLanguage || null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        nextExplanation =
          typeof data.reply === 'string' ? data.reply.trim() : ''
      }

      if (!nextExplanation) {
        console.warn('Dedicated explain-code endpoint unavailable, falling back to AI chat.')

        const fallbackResponse = await fetch(getApiUrl('/api/ai/chat'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: buildExplainFallbackPrompt({
              code: normalizedCode,
              language: selectedLanguage,
              focusTitle,
            }),
            context: {
              ...(learningContext ?? {}),
              tool: 'explain-code',
              language: selectedLanguage || learningContext?.language || '',
              selectedCode: normalizedCode,
              codeExample: normalizedCode,
            },
          }),
        })

        if (!fallbackResponse.ok) {
          throw new Error('Failed to explain code')
        }

        const fallbackData = await fallbackResponse.json()
        nextExplanation =
          typeof fallbackData.reply === 'string' ? fallbackData.reply.trim() : ''
      }

      if (!nextExplanation) {
        throw new Error('No explanation returned')
      }

      setSubmittedCode(normalizedCode)
      setSubmittedLanguage(selectedLanguage || 'Auto-detect')
      setExplanation(nextExplanation)

      try {
        startReading(nextExplanation)
      } catch (readingError) {
        console.error(readingError)
        setReadingNotice(getSpeechSupportMessage())
      }
    } catch (error) {
      console.error(error)
      setExplanation('')
      setErrorMessage(
        'DevHub could not explain that code right now. Try again, or shorten the snippet and retry.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyAnnotatedCode = async () => {
    if (!annotatedCode.trim()) {
      return
    }

    try {
      await navigator.clipboard.writeText(annotatedCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      console.error(error)
      setErrorMessage('Copy failed in this browser. You can still select the annotated code manually.')
    }
  }

  const handleUseLessonExample = () => {
    if (!lessonCodeExample) {
      return
    }

    setExplainCodeDraft(lessonCodeExample)
    setErrorMessage('')
  }

  const handleClear = () => {
    setExplainCodeDraft('')
    setExplanation('')
    setSubmittedCode('')
    setSubmittedLanguage('')
    setErrorMessage('')
    setReadingNotice('')
    setCopied(false)
  }

  const handleReadExplanation = () => {
    if (!normalizedExplanation) {
      return
    }

    setReadingNotice('')

    try {
      startReading(normalizedExplanation)
    } catch (readingError) {
      console.error(readingError)
      setReadingNotice(getSpeechSupportMessage())
    }
  }

  const adjustSourceFontScale = (delta: number) => {
    setSourceFontScale((currentScale) => clampScale(currentScale + delta))
  }

  const adjustPreviewFontScale = (delta: number) => {
    setPreviewFontScale((currentScale) => clampScale(currentScale + delta))
  }

  const expandedSurfaceModal =
    expandedSurface && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-slate-950/78 backdrop-blur-sm"
              onClick={() => setExpandedSurface(null)}
            />

            <div className="relative z-10 flex h-[min(92vh,960px)] w-[min(1180px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-slate-950 shadow-[0_35px_120px_-45px_rgba(15,23,42,1)]">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(56,189,248,0.08)_100%)] px-5 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {expandedSurface === 'source' ? 'Large code editor' : 'Large annotated walkthrough'}
                  </p>
                  <p className="text-xs leading-5 text-slate-400">
                    {expandedSurface === 'source'
                      ? 'Use the larger editor when the snippet is long and you want more room before asking for an explanation.'
                      : 'Use the larger walkthrough when comment lines or code lines feel cramped in the regular assistant panel.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      expandedSurface === 'source'
                        ? adjustSourceFontScale(-0.1)
                        : adjustPreviewFontScale(-0.1)
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <Minus className="h-3.5 w-3.5" />
                    Smaller
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      expandedSurface === 'source'
                        ? adjustSourceFontScale(0.1)
                        : adjustPreviewFontScale(0.1)
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Larger
                  </button>
                  {expandedSurface === 'preview' && (
                    <button
                      type="button"
                      onClick={() => setPreviewWrapLongLines((currentState) => !currentState)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        previewWrapLongLines
                          ? 'border-sky-300/40 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15'
                          : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {previewWrapLongLines ? 'Wrapped lines' : 'One-line scroll'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setExpandedSurface(null)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <Minimize2 className="h-3.5 w-3.5" />
                    Close large view
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-slate-950">
                {expandedSurface === 'source' ? (
                  <textarea
                    value={explainCodeDraft}
                    onChange={(event) => setExplainCodeDraft(event.target.value)}
                    className="h-full min-h-[420px] w-full resize-none bg-slate-950 px-6 py-6 font-mono text-slate-100 outline-none"
                    style={{
                      fontSize: sourceFontSize,
                      lineHeight: 1.8,
                    }}
                    placeholder="Paste the code you want DevHub to explain..."
                  />
                ) : (
                  <SyntaxHighlighter
                    language={syntaxLanguage}
                    style={vscDarkPlus}
                    showLineNumbers
                    wrapLongLines={previewWrapLongLines}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      background: 'transparent',
                      fontSize: previewFontSize,
                      padding: '1.5rem',
                      minHeight: '100%',
                    }}
                    lineNumberStyle={{
                      minWidth: '2.4em',
                      color: 'rgba(148, 163, 184, 0.78)',
                    }}
                  >
                    {annotatedCode}
                  </SyntaxHighlighter>
                )}
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <div className="ai-tab-content">
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,rgba(14,165,233,0.08)_0%,rgba(56,189,248,0.03)_45%,rgba(249,115,22,0.08)_100%)] p-5 shadow-[0_28px_65px_-45px_rgba(14,165,233,0.55)]">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="absolute bottom-0 left-4 h-20 w-20 rounded-full bg-orange-200/35 blur-3xl" />

          <div className="relative space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              <Sparkles className="h-3.5 w-3.5" />
              Explain And Read
            </div>
            <div className="space-y-1">
              <h3 className="text-[1.15rem] font-semibold text-slate-900">
                Break down code and read the explanation aloud
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Paste a snippet, get a beginner-friendly explanation, and let DevHub start reading it immediately.
                {learningContext
                  ? ` I can also keep it grounded in ${focusTitle}.`
                  : ''}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_30px_70px_-55px_rgba(15,23,42,0.45)]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Code2 className="h-4 w-4 text-sky-500" />
                Code to explain
              </div>
              <p className="text-sm leading-6 text-slate-500">
                Best for short to medium snippets where you want a line-by-line explanation.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {lessonCodeExample && (
                <button
                  type="button"
                  onClick={handleUseLessonExample}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                >
                  <BookOpenText className="h-3.5 w-3.5" />
                  Use current lesson example
                </button>
              )}

              <button
                type="button"
                onClick={handleClear}
                disabled={!explainCodeDraft && !explanation}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            <label className="flex min-w-[14rem] flex-1 flex-col gap-1.5 text-sm font-medium text-slate-700">
              Language
              <select
                value={selectedLanguage}
                onChange={(event) => setExplainLanguageDraft(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              >
                {languageOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Resize the code view when the snippet feels cramped.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => adjustSourceFontScale(-0.1)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Minus className="h-3.5 w-3.5" />
                Smaller text
              </button>
              <button
                type="button"
                onClick={() => adjustSourceFontScale(0.1)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Larger text
              </button>
              <button
                type="button"
                onClick={() => setExpandedSurface('source')}
                className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Open larger editor
              </button>
            </div>
          </div>

          <textarea
            value={explainCodeDraft}
            onChange={(event) => setExplainCodeDraft(event.target.value)}
            placeholder="Paste the code you want DevHub to explain..."
            rows={11}
            className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            style={{
              fontSize: sourceFontSize,
            }}
          />

          {errorMessage && (
            <p className="mt-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          )}

          {hasDraftChangedSinceExplanation && !errorMessage && (
            <p className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              You changed the code after the last explanation. Tap explain again to refresh the breakdown and audio.
            </p>
          )}

          {readingNotice && !errorMessage && (
            <p className="mt-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              {readingNotice}
            </p>
          )}

          <button
            type="button"
            onClick={handleExplain}
            disabled={isLoading || !explainCodeDraft.trim()}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(135deg,#0ea5e9_0%,#2563eb_58%,#1d4ed8_100%)] px-4 py-4 text-sm font-semibold text-white shadow-[0_22px_45px_-28px_rgba(37,99,235,0.85)] transition hover:translate-y-[-1px] hover:shadow-[0_28px_55px_-28px_rgba(37,99,235,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Wand2 className="h-4 w-4" />
            {isLoading ? 'Explaining and preparing audio...' : 'Explain Code And Start Reading'}
          </button>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_30px_70px_-55px_rgba(15,23,42,0.45)]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Volume2 className="h-4 w-4 text-sky-500" />
                Annotated output
              </div>
              <p className="text-sm leading-6 text-slate-500">
                {isReadingThisExplanation
                  ? 'DevHub is reading this explanation aloud right now while keeping the submitted code visible beside it.'
                  : isPausedOnThisExplanation
                    ? 'Reading is paused. Resume whenever you are ready.'
                    : 'When an explanation is ready, DevHub will show the code and explanation together and can read it aloud immediately.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopyAnnotatedCode}
                disabled={!annotatedCode.trim()}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? 'Copied' : 'Copy annotated code'}
              </button>
              <button
                type="button"
                onClick={() => openAssistantTab('reading')}
                disabled={!normalizedExplanation}
                className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Open Reading Studio
              </button>
            </div>
          </div>

          {normalizedExplanation ? (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                  <Braces className="h-3.5 w-3.5" />
                  {submittedLanguage || 'Auto-detected'}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  <FileCode2 className="h-3.5 w-3.5" />
                  {submittedLineCount} {submittedLineCount === 1 ? 'line' : 'lines'}
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isReadingThisExplanation
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : isPausedOnThisExplanation
                        ? 'border border-amber-200 bg-amber-50 text-amber-700'
                        : 'border border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isReadingThisExplanation
                    ? 'Audio is playing'
                    : isPausedOnThisExplanation
                      ? 'Audio is paused'
                      : 'Audio ready'}
                </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={handleReadExplanation}
                  disabled={isReadingThisExplanation}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Play className="h-4 w-4" />
                  {isPausedOnThisExplanation ? 'Resume' : isReadingThisExplanation ? 'Reading' : 'Read'}
                </button>
                <button
                  type="button"
                  onClick={pauseReading}
                  disabled={!isReadingThisExplanation}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </button>
                <button
                  type="button"
                  onClick={stopReading}
                  disabled={!isReadingThisExplanation && !isPausedOnThisExplanation}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-amber-100 px-3 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </button>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950 shadow-[0_28px_60px_-45px_rgba(15,23,42,0.95)]">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(56,189,248,0.08)_100%)] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Annotated code walkthrough</p>
                    <p className="text-xs leading-5 text-slate-400">
                      DevHub merged the explanation into the snippet as comment lines so you can read the code and guidance in one place.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                      {submittedLanguage || 'Auto'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewWrapLongLines((currentState) => !currentState)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                        previewWrapLongLines
                          ? 'border-sky-300/30 bg-sky-400/10 text-sky-100 hover:bg-sky-400/15'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {previewWrapLongLines ? 'Wrapped lines' : 'One-line scroll'}
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustPreviewFontScale(-0.1)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                    >
                      <Minus className="h-3.5 w-3.5" />
                      Smaller
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustPreviewFontScale(0.1)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Larger
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedSurface('preview')}
                      className="inline-flex items-center gap-1 rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100 transition hover:bg-sky-400/15"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      Larger view
                    </button>
                  </div>
                </div>

                <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-sm font-semibold text-white">
                    {isReadingThisExplanation
                      ? 'DevHub is reading the explanation from this annotated snippet right now.'
                      : isPausedOnThisExplanation
                        ? 'Audio is paused, and the inline comments stay here so you can keep reading manually.'
                        : 'The spoken explanation is ready, and the inline comments stay attached to each part of the code.'}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Your original code is unchanged. DevHub only adds readable comment lines in this preview.
                  </p>
                </div>

                <SyntaxHighlighter
                  language={syntaxLanguage}
                  style={vscDarkPlus}
                  showLineNumbers
                  wrapLongLines={previewWrapLongLines}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: 'transparent',
                    fontSize: previewFontSize,
                    padding: '1rem',
                    minHeight: '100%',
                  }}
                  lineNumberStyle={{
                    minWidth: '2em',
                    color: 'rgba(148, 163, 184, 0.75)',
                  }}
                >
                  {annotatedCode}
                </SyntaxHighlighter>
              </div>
            </>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-500 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800">Ready when your code is</h4>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Paste a snippet above, tap explain, and DevHub will generate the explanation here and begin reading it aloud.
              </p>
            </div>
          )}
        </section>
      </div>
      {expandedSurfaceModal}
    </div>
  )
}

export default ExplainCodeTab
