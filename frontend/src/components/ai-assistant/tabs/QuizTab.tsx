import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCcw,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react'

import { useToast } from '@/components/ui/toast-1'
import { useAIAssistant } from '@/contexts/AIAssistantContext'

import '../AIAssistant.css'

type GeneratedQuizQuestion = {
  correctIndex: number
  explanation: string
  options: string[]
  question: string
}

type GeneratedQuizResponse = {
  live?: boolean
  questions?: unknown
  sourceLabel?: string
  statusMessage?: string
  timeLimitSeconds?: number
}

const FALLBACK_QUESTION_COUNT = 5
const DEFAULT_TIME_PER_QUESTION_SECONDS = 60
const MIN_QUIZ_TIME_SECONDS = 120

const normalizeQuestionKey = (question: string) => question.trim().toLowerCase()

const resolveQuizTimeLimit = (timeLimitSeconds: number | null | undefined, questionCount: number) => {
  const fallbackLimit = Math.max(
    MIN_QUIZ_TIME_SECONDS,
    questionCount * DEFAULT_TIME_PER_QUESTION_SECONDS
  )

  if (typeof timeLimitSeconds !== 'number' || !Number.isFinite(timeLimitSeconds)) {
    return fallbackLimit
  }

  return Math.max(MIN_QUIZ_TIME_SECONDS, Math.round(timeLimitSeconds))
}

const formatTimerLabel = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const shuffleArray = <T,>(items: T[]) => {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]]
  }

  return nextItems
}

const randomizeQuestionOptions = (question: GeneratedQuizQuestion): GeneratedQuizQuestion => {
  const correctOption = question.options[question.correctIndex]
  const options = shuffleArray(question.options)

  return {
    ...question,
    options,
    correctIndex: options.indexOf(correctOption),
  }
}

const fallbackQuestionSets: Record<string, GeneratedQuizQuestion[]> = {
  css: [
    {
      question: 'Which CSS property controls the text color of an element?',
      options: ['font-color', 'text-color', 'color', 'foreground'],
      correctIndex: 2,
      explanation: "Use `color` to set text color. Backgrounds are handled separately.",
    },
    {
      question: 'What does `display: flex` create?',
      options: ['A sticky element', 'A flex container', 'A grid area', 'A hidden block'],
      correctIndex: 1,
      explanation: 'A flex container lets you align and distribute child elements with Flexbox.',
    },
    {
      question: 'Which property adds spacing inside an element border?',
      options: ['margin', 'gap', 'padding', 'inset'],
      correctIndex: 2,
      explanation: 'Padding is the internal space between content and the element border.',
    },
    {
      question: 'How do you target a class named `card` in CSS?',
      options: ['#card', '.card', 'card()', '@card'],
      correctIndex: 1,
      explanation: 'Class selectors use a dot before the class name.',
    },
    {
      question: 'Which declaration centers inline text horizontally?',
      options: ['justify-content: center', 'align-items: center', 'text-align: center', 'margin: auto'],
      correctIndex: 2,
      explanation: '`text-align: center` controls the horizontal alignment of inline content.',
    },
    {
      question: 'Which selector targets an element with the id `hero`?',
      options: ['.hero', '#hero', 'hero', '*hero'],
      correctIndex: 1,
      explanation: 'ID selectors use `#` before the id name.',
    },
    {
      question: 'Which property is commonly used to create space between flex or grid children?',
      options: ['gap', 'padding', 'margin-inline', 'display'],
      correctIndex: 0,
      explanation: '`gap` creates spacing between items in flex and grid layouts.',
    },
    {
      question: 'What happens when you set `display: none`?',
      options: ['The element becomes transparent', 'The element is hidden and removed from layout', 'The element stays visible but inactive', 'Only text disappears'],
      correctIndex: 1,
      explanation: '`display: none` hides the element completely and removes its layout space.',
    },
  ],
  html: [
    {
      question: 'Which element is used to create a hyperlink?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correctIndex: 1,
      explanation: 'The anchor tag, `<a>`, creates a hyperlink.',
    },
    {
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Transfer Machine Language',
        'Hyperlink and Text Management Language',
        'Home Tool Markup Language',
      ],
      correctIndex: 0,
      explanation: 'HTML stands for Hyper Text Markup Language.',
    },
    {
      question: 'Which element contains document metadata?',
      options: ['<body>', '<footer>', '<meta>', '<head>'],
      correctIndex: 3,
      explanation: 'The `<head>` element contains metadata, title, styles, and other document-level information.',
    },
    {
      question: 'Which tag creates the largest default heading?',
      options: ['<h6>', '<heading>', '<h1>', '<title>'],
      correctIndex: 2,
      explanation: '`<h1>` is the largest heading level by default.',
    },
    {
      question: 'Which attribute is used for an image source URL?',
      options: ['href', 'src', 'path', 'alt'],
      correctIndex: 1,
      explanation: 'Images load with the `src` attribute.',
    },
    {
      question: 'Which element is best suited for the main heading of a page?',
      options: ['<h1>', '<title>', '<header>', '<strong>'],
      correctIndex: 0,
      explanation: '`<h1>` is typically used for the primary page heading.',
    },
    {
      question: 'Which tag creates an unordered list?',
      options: ['<ol>', '<li>', '<ul>', '<dl>'],
      correctIndex: 2,
      explanation: '`<ul>` creates a bulleted unordered list.',
    },
    {
      question: 'Where should page metadata such as title and linked stylesheets go?',
      options: ['<body>', '<head>', '<footer>', '<section>'],
      correctIndex: 1,
      explanation: 'Metadata belongs inside the document `<head>`.',
    },
  ],
  javascript: [
    {
      question: 'Which keyword declares a block-scoped variable?',
      options: ['var', 'let', 'const', 'block'],
      correctIndex: 1,
      explanation: '`let` creates a block-scoped variable that can be reassigned.',
    },
    {
      question: 'What does `===` compare in JavaScript?',
      options: ['Only value', 'Only type', 'Value and type', 'Object references only'],
      correctIndex: 2,
      explanation: '`===` is strict equality, so it checks both value and type.',
    },
    {
      question: 'Which array method returns a new transformed array?',
      options: ['forEach()', 'map()', 'push()', 'find()'],
      correctIndex: 1,
      explanation: '`map()` transforms every item and returns a new array.',
    },
    {
      question: "What is the result of `2 + '2'`?",
      options: ['4', "'22'", 'NaN', 'Error'],
      correctIndex: 1,
      explanation: 'JavaScript coerces the number into a string and concatenates the values.',
    },
    {
      question: 'What is an arrow function?',
      options: [
        'A function that points to another function',
        'A shorter function syntax using `=>`',
        'A loop shorthand',
        'A deprecated function format',
      ],
      correctIndex: 1,
      explanation: 'Arrow functions provide a concise function syntax using the `=>` token.',
    },
    {
      question: 'Which method removes the last item from an array?',
      options: ['shift()', 'push()', 'pop()', 'slice()'],
      correctIndex: 2,
      explanation: '`pop()` removes and returns the last array item.',
    },
    {
      question: 'What does `const` prevent you from doing?',
      options: ['Reading a variable', 'Reassigning the variable binding', 'Declaring objects', 'Using arrays'],
      correctIndex: 1,
      explanation: '`const` prevents reassignment of the binding, though object contents can still change.',
    },
    {
      question: 'Which statement is true about `let`?',
      options: ['It is globally scoped only', 'It is block-scoped', 'It must store strings', 'It is deprecated'],
      correctIndex: 1,
      explanation: '`let` is block-scoped, unlike `var`.',
    },
  ],
  python: [
    {
      question: 'How do you print output in Python?',
      options: ['console.log()', 'print()', 'echo()', 'printf()'],
      correctIndex: 1,
      explanation: '`print()` is the standard Python function for output.',
    },
    {
      question: 'Which symbol starts a Python comment?',
      options: ['//', '#', '--', '/*'],
      correctIndex: 1,
      explanation: 'Python uses `#` for single-line comments.',
    },
    {
      question: 'Which keyword defines a function in Python?',
      options: ['function', 'define', 'def', 'func'],
      correctIndex: 2,
      explanation: 'Python functions are declared with `def`.',
    },
    {
      question: 'Which data type is immutable?',
      options: ['List', 'Set', 'Dictionary', 'Tuple'],
      correctIndex: 3,
      explanation: 'Tuples cannot be changed after creation.',
    },
    {
      question: "What does `bool('')` return?",
      options: ['True', 'False', 'None', 'Error'],
      correctIndex: 1,
      explanation: 'An empty string is falsy in Python.',
    },
    {
      question: 'Which brackets are used to create a list in Python?',
      options: ['()', '{}', '[]', '<>'],
      correctIndex: 2,
      explanation: 'Python lists use square brackets.',
    },
    {
      question: 'Which keyword is commonly used for conditional branching?',
      options: ['for', 'if', 'def', 'import'],
      correctIndex: 1,
      explanation: '`if` handles conditional branching in Python.',
    },
    {
      question: 'What does a tuple provide compared with a list?',
      options: ['Mutability', 'Guaranteed sorting', 'Immutability', 'Automatic printing'],
      correctIndex: 2,
      explanation: 'Tuples are immutable once created.',
    },
  ],
  generic: [
    {
      question: 'What is the main purpose of a variable?',
      options: [
        'To repeat code automatically',
        'To store and label data',
        'To style the interface',
        'To replace comments',
      ],
      correctIndex: 1,
      explanation: 'Variables give data a name so you can reuse and update it later.',
    },
    {
      question: 'What does a function help you do?',
      options: [
        'Store CSS styles',
        'Organize reusable logic',
        'Delete errors automatically',
        'Create database tables',
      ],
      correctIndex: 1,
      explanation: 'Functions package logic into reusable blocks.',
    },
    {
      question: 'What is debugging?',
      options: [
        'Making code look cleaner',
        'Converting code to another language',
        'Finding and fixing problems in code',
        'Deleting every warning',
      ],
      correctIndex: 2,
      explanation: 'Debugging is the process of finding, understanding, and fixing issues.',
    },
    {
      question: 'What does an `if` statement do?',
      options: [
        'Creates a new variable',
        'Runs code conditionally',
        'Repeats code forever',
        'Formats code output',
      ],
      correctIndex: 1,
      explanation: '`if` statements decide whether a block should run based on a condition.',
    },
    {
      question: 'Why are examples useful when learning a topic?',
      options: [
        'They replace theory completely',
        'They show how an idea works in practice',
        'They reduce the need for syntax',
        'They only help advanced learners',
      ],
      correctIndex: 1,
      explanation: 'Examples help connect abstract concepts to practical usage.',
    },
    {
      question: 'What is the benefit of breaking a problem into smaller steps?',
      options: [
        'It makes the code longer by default',
        'It makes the solution easier to reason about',
        'It removes the need for testing',
        'It guarantees there will be no bugs',
      ],
      correctIndex: 1,
      explanation: 'Smaller steps make logic easier to understand, build, and debug.',
    },
    {
      question: 'What is one good reason to use comments in code?',
      options: [
        'To replace clear naming',
        'To explain intent when the code alone is not obvious',
        'To make code execute faster',
        'To avoid writing functions',
      ],
      correctIndex: 1,
      explanation: 'Good comments explain intent or context that is not obvious from the code itself.',
    },
    {
      question: 'Why is testing useful?',
      options: [
        'It automatically writes production code',
        'It helps confirm code behaves as expected',
        'It removes the need to debug',
        'It replaces design decisions',
      ],
      correctIndex: 1,
      explanation: 'Testing helps verify that code works as intended and catches regressions.',
    },
  ],
}

const inferQuestionSetKey = (topic: string, content: string) => {
  const combined = `${topic} ${content}`.toLowerCase()

  if (combined.includes('javascript') || combined.includes('array') || combined.includes('js')) {
    return 'javascript'
  }

  if (combined.includes('python')) {
    return 'python'
  }

  if (combined.includes('html')) {
    return 'html'
  }

  if (combined.includes('css') || combined.includes('flex') || combined.includes('grid')) {
    return 'css'
  }

  return 'generic'
}

const buildFallbackQuiz = (
  topic: string,
  content: string,
  count = FALLBACK_QUESTION_COUNT,
  excludeQuestions: string[] = []
) => {
  const questionPool = shuffleArray(fallbackQuestionSets[inferQuestionSetKey(topic, content)])
  const excludedKeys = new Set(excludeQuestions.map(normalizeQuestionKey))
  const selected: GeneratedQuizQuestion[] = []
  const usedKeys = new Set<string>()

  for (const question of questionPool) {
    const questionKey = normalizeQuestionKey(question.question)
    if (excludedKeys.has(questionKey) || usedKeys.has(questionKey)) {
      continue
    }

    usedKeys.add(questionKey)
    selected.push(randomizeQuestionOptions(question))

    if (selected.length >= count) {
      return selected
    }
  }

  for (const question of questionPool) {
    const questionKey = normalizeQuestionKey(question.question)
    if (usedKeys.has(questionKey)) {
      continue
    }

    usedKeys.add(questionKey)
    selected.push(randomizeQuestionOptions(question))

    if (selected.length >= count) {
      break
    }
  }

  return selected
}

const sanitizeQuestions = (input: unknown): GeneratedQuizQuestion[] => {
  if (!Array.isArray(input)) {
    return []
  }

  return input
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null
      }

      const rawQuestion = entry as Partial<GeneratedQuizQuestion>
      const options = Array.isArray(rawQuestion.options)
        ? rawQuestion.options.filter((option): option is string => typeof option === 'string' && option.trim().length > 0)
        : []

      if (!rawQuestion.question || typeof rawQuestion.question !== 'string' || options.length < 2) {
        return null
      }

      const maxIndex = options.length - 1
      const safeCorrectIndex =
        typeof rawQuestion.correctIndex === 'number'
          ? Math.min(Math.max(rawQuestion.correctIndex, 0), maxIndex)
          : 0

      return {
        question: rawQuestion.question,
        options,
        correctIndex: safeCorrectIndex,
        explanation: typeof rawQuestion.explanation === 'string' ? rawQuestion.explanation : '',
      }
    })
    .filter((question): question is GeneratedQuizQuestion => Boolean(question))
}

const QuizTab: React.FC = () => {
  const { learningContext } = useAIAssistant()
  const { showToast } = useToast()

  const inferredTopic = useMemo(
    () =>
      learningContext?.topicTitle ||
      learningContext?.lessonTitle ||
      learningContext?.courseTitle ||
      '',
    [learningContext]
  )

  const learningExcerpt = useMemo(
    () =>
      (
        learningContext?.lessonContent ||
        learningContext?.topicSummary ||
        learningContext?.codeExample ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 3200),
    [learningContext]
  )

  const [topic, setTopic] = useState(inferredTopic)
  const [questions, setQuestions] = useState<GeneratedQuizQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(
    resolveQuizTimeLimit(undefined, FALLBACK_QUESTION_COUNT)
  )
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(
    resolveQuizTimeLimit(undefined, FALLBACK_QUESTION_COUNT)
  )
  const [timedOut, setTimedOut] = useState(false)
  const [generationMode, setGenerationMode] = useState<'live' | 'fallback' | null>(null)
  const [usedQuestionTexts, setUsedQuestionTexts] = useState<string[]>([])
  const [historyScope, setHistoryScope] = useState('')

  useEffect(() => {
    if (!topic.trim() && inferredTopic) {
      setTopic(inferredTopic)
    }
  }, [inferredTopic, topic])

  const focusTopic = topic.trim() || inferredTopic
  const answeredCount = Object.keys(selectedAnswers).length
  const score = useMemo(
    () =>
      questions.reduce((total, question, index) => {
        return total + (selectedAnswers[index] === question.correctIndex ? 1 : 0)
      }, 0),
    [questions, selectedAnswers]
  )
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const currentPrompt = questions[currentQuestion]
  const timerLabel = formatTimerLabel(timeRemainingSeconds)
  const isTimerCritical = timeRemainingSeconds <= 60

  const resetQuizState = () => {
    setSelectedAnswers({})
    setCurrentQuestion(0)
    setSubmitted(false)
    setTimedOut(false)
  }

  useEffect(() => {
    if (questions.length === 0 || submitted) {
      return
    }

    if (timeRemainingSeconds <= 0) {
      setTimedOut(true)
      setSubmitted(true)
      showToast('Time is up. DevHub scored the quiz with your current answers.', 'info', 'top-right')
      return
    }

    const timeoutId = window.setTimeout(() => {
      setTimeRemainingSeconds((previous) => Math.max(previous - 1, 0))
    }, 1000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [questions.length, showToast, submitted, timeRemainingSeconds])

  const handleGenerate = async () => {
    if (!focusTopic) {
      showToast('Add a topic first so DevHub can build the quiz around something specific.', 'info', 'top-right')
      return
    }

    const nextScope = `${focusTopic.toLowerCase()}::${learningContext?.language || ''}`
    const excludedQuestions = historyScope === nextScope ? usedQuestionTexts : []

    if (historyScope !== nextScope) {
      setUsedQuestionTexts([])
      setHistoryScope(nextScope)
    }

    setIsLoading(true)
    resetQuizState()

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: focusTopic,
          content: learningExcerpt || focusTopic,
          language: learningContext?.language,
          excludeQuestions: excludedQuestions,
          generationNonce:
            typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          questionCount: FALLBACK_QUESTION_COUNT,
          preferredTimeLimitSeconds: resolveQuizTimeLimit(undefined, FALLBACK_QUESTION_COUNT),
        }),
      })

      if (!response.ok) {
        throw new Error(`Quiz request failed with status ${response.status}`)
      }

      const data = (await response.json()) as GeneratedQuizResponse
      const nextQuestions = sanitizeQuestions(data.questions)

      if (nextQuestions.length === 0) {
        throw new Error('Quiz generator returned no questions')
      }

      setQuestions(nextQuestions)
      const nextTimeLimit = resolveQuizTimeLimit(data.timeLimitSeconds, nextQuestions.length)
      setTimeLimitSeconds(nextTimeLimit)
      setTimeRemainingSeconds(nextTimeLimit)
      setGenerationMode(data.live ? 'live' : 'fallback')
      setUsedQuestionTexts((previous) => {
        const nextHistory = new Set([
          ...(historyScope === nextScope ? previous : []),
          ...nextQuestions.map((question) => question.question),
        ])

        return Array.from(nextHistory)
      })

      if (data.live) {
        showToast(
          data.statusMessage || 'DevHub generated a fresh live quiz for you.',
          'success',
          'top-right'
        )
      } else if (data.statusMessage) {
        showToast(data.statusMessage, 'warning', 'top-right')
      }
    } catch (error) {
      console.error('AI quiz generation error:', error)
      const fallbackQuestions = buildFallbackQuiz(
        focusTopic,
        learningExcerpt || focusTopic,
        FALLBACK_QUESTION_COUNT,
        excludedQuestions
      )
      setQuestions(fallbackQuestions)
      const fallbackTimeLimit = resolveQuizTimeLimit(undefined, fallbackQuestions.length)
      setTimeLimitSeconds(fallbackTimeLimit)
      setTimeRemainingSeconds(fallbackTimeLimit)
      setGenerationMode('fallback')
      setUsedQuestionTexts((previous) => {
        const nextHistory = new Set([
          ...(historyScope === nextScope ? previous : []),
          ...fallbackQuestions.map((question) => question.question),
        ])

        return Array.from(nextHistory)
      })
      showToast(
        'Live quiz generation is unavailable, so DevHub built a local practice set instead.',
        'warning',
        'top-right'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (questionIndex: number, selectedOption: number) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [questionIndex]: selectedOption,
    }))
  }

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      showToast('Answer every question first so I can score the full set.', 'info', 'top-right')
      return
    }

    setSubmitted(true)
  }

  const assistantSubtitle = learningContext
    ? `Quiz mode is grounded in ${inferredTopic}${learningContext.language ? ` and tuned for ${learningContext.language.toUpperCase()}` : ''}.`
    : 'Turn any topic into a short, guided knowledge check with a softer onboarding-style layout.'

  const selectedCurrentAnswer =
    typeof selectedAnswers[currentQuestion] === 'number'
      ? selectedAnswers[currentQuestion]
      : null

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-[1.8rem] border border-orange-100 bg-[linear-gradient(135deg,#fffaf3_0%,#fff1dd_52%,#ffe4c4_100%)] p-4 shadow-[0_24px_42px_-30px_rgba(234,88,12,0.5)]">
        <div className="absolute -right-8 top-0 h-28 w-28 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-orange-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Guided quiz mode
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-orange-600">
              <Target className="h-3.5 w-3.5" />
              5 question flow
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm">
              <Clock3 className="h-3.5 w-3.5" />
              Timed session
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
              Build a polished quiz around {focusTopic || 'your current lesson'}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {assistantSubtitle}
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-white/80 bg-white/85 p-3 shadow-sm backdrop-blur">
            <label className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Topic focus
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Try JavaScript arrays, CSS Grid, HTML forms..."
                className="min-w-0 flex-1 rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f97316_0%,#ea580c_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_-20px_rgba(234,88,12,0.85)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                {isLoading ? 'Building quiz...' : 'Generate quiz'}
              </button>
            </div>

            {learningContext ? (
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                {inferredTopic ? (
                  <span className="rounded-full border border-orange-100 bg-orange-50/70 px-3 py-1.5 font-medium">
                    Lesson: {inferredTopic}
                  </span>
                ) : null}
                {learningContext.language ? (
                  <span className="rounded-full border border-orange-100 bg-orange-50/70 px-3 py-1.5 font-medium">
                    Language: {learningContext.language.toUpperCase()}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-slate-50/90 px-4 py-5 text-sm leading-6 text-slate-500">
          {learningContext
            ? `Generate a quiz and I’ll turn ${inferredTopic || 'this lesson'} into a short guided check with softer cards, clearer progress, and instant scoring.`
            : 'Generate a quiz to turn any topic into a clean onboarding-style practice flow.'}
        </div>
      ) : null}

      {questions.length > 0 ? (
        <>
          <div className="flex items-center justify-between gap-3 rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Progress
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isTimerCritical && !submitted
                    ? 'bg-rose-50 text-rose-700'
                    : 'bg-sky-50 text-sky-700'
                }`}
              >
                {submitted ? `Time used ${formatTimerLabel(timeLimitSeconds - timeRemainingSeconds)}` : `Time left ${timerLabel}`}
              </div>
              <div className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                {submitted ? `${percentage}% score` : `Question ${currentQuestion + 1}/${questions.length}`}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <div
              className={`h-2 transition-all duration-1000 ${
                isTimerCritical && !submitted ? 'bg-rose-500' : 'bg-sky-500'
              }`}
              style={{
                width: `${Math.max(
                  0,
                  Math.min(
                    100,
                    timeLimitSeconds > 0
                      ? (timeRemainingSeconds / timeLimitSeconds) * 100
                      : 100
                  )
                )}%`,
              }}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {questions.map((_, index) => {
              const isActive = index === currentQuestion
              const isAnswered = typeof selectedAnswers[index] === 'number'

              return (
                <button
                  key={`quiz-step-${index}`}
                  type="button"
                  onClick={() => setCurrentQuestion(index)}
                  className={`inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition ${
                    isActive
                      ? 'border-orange-300 bg-orange-500 text-white shadow-[0_14px_28px_-18px_rgba(234,88,12,0.8)]'
                      : isAnswered
                        ? 'border-orange-100 bg-orange-50 text-orange-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-orange-200 hover:text-orange-600'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>

          {currentPrompt ? (
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-[0_24px_40px_-32px_rgba(15,23,42,0.35)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Question {currentQuestion + 1}
                  </p>
                  <h4 className="mt-2 text-base font-semibold leading-7 text-slate-950">
                    {currentPrompt.question}
                  </h4>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {currentPrompt.options.map((option, optionIndex) => {
                  const isSelected = selectedCurrentAnswer === optionIndex
                  const isCorrect = currentPrompt.correctIndex === optionIndex
                  const showCorrect = submitted && isCorrect
                  const showIncorrect = submitted && isSelected && !isCorrect

                  return (
                    <button
                      key={`${currentQuestion}-${optionIndex}`}
                      type="button"
                      onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                      disabled={submitted}
                      className={`flex w-full items-start gap-3 rounded-[1.35rem] border px-4 py-3 text-left transition ${
                        showCorrect
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                          : showIncorrect
                            ? 'border-rose-200 bg-rose-50 text-rose-900'
                            : isSelected
                              ? 'border-orange-300 bg-orange-50 text-slate-900 shadow-[0_16px_26px_-24px_rgba(234,88,12,0.5)]'
                              : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-orange-200 hover:bg-orange-50/60'
                      }`}
                    >
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                          showCorrect
                            ? 'bg-emerald-600 text-white'
                            : showIncorrect
                              ? 'bg-rose-600 text-white'
                              : isSelected
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-slate-500 shadow-sm'
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className="pt-1 text-sm leading-6">{option}</span>
                    </button>
                  )
                })}
              </div>

              {submitted && currentPrompt.explanation ? (
                <div className="mt-4 rounded-[1.25rem] border border-orange-100 bg-orange-50/80 px-4 py-3 text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-orange-700">Why this works:</span>{' '}
                  {currentPrompt.explanation}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentQuestion((previous) => Math.max(previous - 1, 0))}
                  disabled={currentQuestion === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Regenerate
                  </button>

                  {submitted ? (
                    <button
                      type="button"
                      onClick={() => {
                        void handleGenerate()
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Try another set
                    </button>
                  ) : currentQuestion < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestion((previous) => Math.min(previous + 1, questions.length - 1))}
                      className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316_0%,#ea580c_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_30px_-20px_rgba(234,88,12,0.85)] transition hover:-translate-y-0.5"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316_0%,#ea580c_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_30px_-20px_rgba(234,88,12,0.85)] transition hover:-translate-y-0.5"
                    >
                      Score quiz
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {submitted ? (
            <div className="rounded-[1.8rem] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#fff1e3_50%,#ffffff_100%)] p-4 shadow-[0_22px_40px_-30px_rgba(234,88,12,0.4)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-[0_18px_26px_-18px_rgba(234,88,12,0.8)]">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-slate-950">
                    {percentage >= 80 ? 'Strong work.' : percentage >= 60 ? 'Solid foundation.' : 'Good start.'}
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    You answered {score} out of {questions.length} correctly on {focusTopic || 'this topic'}{timedOut ? ' before the timer ran out.' : '.'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-[1.2rem] border border-white/80 bg-white/85 px-4 py-3 text-center shadow-sm">
                    <p className="text-2xl font-semibold text-slate-950">{percentage}%</p>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Score
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-emerald-100 bg-emerald-50/90 px-4 py-3 text-center shadow-sm">
                    <p className="inline-flex items-center justify-center gap-1 text-2xl font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      {score}
                    </p>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-600">
                      Correct
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-rose-100 bg-rose-50/90 px-4 py-3 text-center shadow-sm">
                    <p className="inline-flex items-center justify-center gap-1 text-2xl font-semibold text-rose-700">
                      <XCircle className="h-4 w-4" />
                      {questions.length - score}
                    </p>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-rose-600">
                      Missed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 font-medium">
                  Quiz time: {formatTimerLabel(timeLimitSeconds)}
                </span>
                <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 font-medium">
                  Completed in {formatTimerLabel(timeLimitSeconds - timeRemainingSeconds)}
                </span>
                <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 font-medium">
                  Source: {generationMode === 'live' ? 'Live AI' : 'Local fallback'}
                </span>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default QuizTab
