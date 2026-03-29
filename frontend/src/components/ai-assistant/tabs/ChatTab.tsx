import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Bot,
  ImageIcon,
  Lightbulb,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { createPortal } from 'react-dom'

import {
  PromptBox,
  learningPromptTools,
  type PromptSubmitPayload,
} from '@/components/ui/chatgpt-prompt-input'
import { OrbitalLoader } from '@/components/ui/orbital-loader'
import { useToast } from '@/components/ui/toast-1'
import {
  useAIAssistant,
  type AIAssistantLearningContext,
} from '@/contexts/AIAssistantContext'
import { useAuthStore } from '@/store'

import '../AIAssistant.css'

interface ChatMessage {
  attachmentName?: string
  attachmentPreview?: string
  content: string
  generatedImageUrl?: string
  id: string
  live?: boolean
  providerLabel?: string
  role: 'assistant' | 'user'
  sourceLabel?: string
  statusMessage?: string
  toolId?: string
}

interface AIChatStatus {
  configured: boolean
  enabled: boolean
  live: boolean
  message?: string
  provider?: string
  providerLabel?: string
  source?: string
  sourceLabel?: string
}

const starterPrompts = [
  'Explain AI in simple terms.',
  'Summarize this topic for me.',
  'Help me plan a focused study week.',
  'Brainstorm a portfolio project idea.',
  'Help me debug an error in my code.',
]

const technicalHintPattern =
  /(code|coding|program|debug|bug|error|variable|function|loop|array|object|class|algorithm|html|css|javascript|python|react|sql|git|api|framework|library|frontend|backend|database|query|jsx|hook|component)/i

const currentInfoPattern =
  /(today|latest|recent|current|news|weather|score|stock|price|market|president|prime minister|this week|right now)/i

const howToPattern = /(?:how\s+(?:do|can)\s+i|how\s+to)\s+(.+?)[?.!]*$/i
const imageAnalysisRefusalPattern =
  /(?:can't|cannot|unable to|do not|don't)\s+(?:actually\s+)?(?:see|view|inspect|interpret|analyze)\s+(?:the\s+)?(?:image|images|photo|photos|picture|pictures|screenshot|screenshots)|as\s+an?\s+(?:ai|text-based ai|language model)[^.\n]{0,180}(?:can't|cannot|don't|do not)\s+(?:see|view|inspect|analyze)|not\s+equipped\s+with\s+(?:visual|image)\s+perception|my\s+(?:eyes|vision)\s+(?:are|is)\s+purely\s+textual|process(?:es|ing)?\s+(?:the\s+)?words\s+you\s+write|directly\s+inspect\s+images\s+that\s+are\s+attached/i

const clampScale = (value: number) =>
  Math.min(1.7, Math.max(0.9, Number(value.toFixed(2))))

const MAX_VOICE_RECORDING_MS = 30000
const FALLBACK_VOICE_RECORDING_FILE_NAME = 'voice-input.webm'
const preferredVoiceRecordingMimeTypes = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
]

const getSupportedVoiceRecordingMimeType = () => {
  if (
    typeof MediaRecorder === 'undefined' ||
    typeof MediaRecorder.isTypeSupported !== 'function'
  ) {
    return ''
  }

  return (
    preferredVoiceRecordingMimeTypes.find((mimeType) =>
      MediaRecorder.isTypeSupported(mimeType)
    ) ?? ''
  )
}

const createVoiceRecordingFileName = (mimeType?: string | null) => {
  const normalized = mimeType?.toLowerCase() ?? ''

  if (normalized.includes('wav')) {
    return 'voice-input.wav'
  }

  if (normalized.includes('mpeg') || normalized.includes('mp3')) {
    return 'voice-input.mp3'
  }

  if (normalized.includes('mp4') || normalized.includes('aac') || normalized.includes('m4a')) {
    return 'voice-input.m4a'
  }

  if (normalized.includes('ogg')) {
    return 'voice-input.ogg'
  }

  return FALLBACK_VOICE_RECORDING_FILE_NAME
}

const DEVHUB_AI_DISPLAY_NAME = 'DevHub AI'

const getPreferredVoiceLocale = () => {
  if (typeof navigator === 'undefined') {
    return 'en-US'
  }

  return navigator.language || 'en-US'
}

const brandAICopy = (value?: string) =>
  value
    ? value
        .replace(/gemini online/gi, `${DEVHUB_AI_DISPLAY_NAME} online`)
        .replace(/gemini setup needed/gi, `${DEVHUB_AI_DISPLAY_NAME} setup needed`)
        .replace(/\bgemini\b/gi, DEVHUB_AI_DISPLAY_NAME)
    : undefined

const createMarkdownComponents = ({
  fontScale,
  wrapLongLines,
}: {
  fontScale: number
  wrapLongLines: boolean
}) => ({
  code: ({
    inline,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & {
    inline?: boolean
  }) =>
    inline ? (
      <code
        className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.82em] text-sky-700"
        {...props}
      >
        {children}
      </code>
    ) : (
      <pre
        className={`rounded-2xl bg-slate-950 px-4 py-3 text-slate-100 ${
          wrapLongLines
            ? 'overflow-x-auto whitespace-pre-wrap break-words'
            : 'overflow-x-auto whitespace-pre'
        }`}
        style={{
          fontSize: `${(0.92 * fontScale).toFixed(2)}rem`,
          lineHeight: 1.7,
        }}
      >
        <code {...props}>{children}</code>
      </pre>
    ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-3 last:mb-0" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0" {...props}>
      {children}
    </ol>
  ),
})

const normalizeText = (value?: string | null, maxLength = 1400) => {
  if (!value) {
    return ''
  }

  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

const buildImageAwarePrompt = (message: string) => {
  const trimmed = message.trim()

  if (!trimmed) {
    return 'An image is attached. Analyze the image directly, describe what is visible clearly, and answer based on the visible content.'
  }

  return [
    'An image is attached for direct analysis.',
    'Inspect the attached image itself and answer from what is visibly present.',
    'Do not say that you cannot see, inspect, or analyze the image when the attachment is present.',
    `User request: ${trimmed}`,
  ].join('\n')
}

const buildVisionOnlyPrompt = (message: string) => {
  const trimmed = message.trim()

  return [
    'An image is attached.',
    'Inspect the image directly before answering.',
    'Identify the main subject, supporting objects, colors, any visible text, and the overall layout or composition.',
    trimmed
      ? `User request: ${trimmed}`
      : 'Describe the image clearly using what is visibly present.',
    'If the user asks for code, provide the code after a short visual description based on what is visible in the image.',
    'Do not say that you cannot see or analyze the image.',
  ].join('\n')
}

const isLikelyTechnicalMessage = (message: string) =>
  technicalHintPattern.test(message)

const isLikelyCurrentInfoQuestion = (message: string) =>
  currentInfoPattern.test(message)

const getLearningFocusTitle = (context: AIAssistantLearningContext | null) =>
  context?.topicTitle || context?.lessonTitle || context?.courseTitle || 'your current lesson'

const buildContextAwarePrompts = (context: AIAssistantLearningContext | null) => {
  const focusTitle = getLearningFocusTitle(context)

  if (!context) {
    return starterPrompts
  }

  return [
    `Explain ${focusTitle} in simpler terms.`,
    `Give me a practice question about ${focusTitle}.`,
    `Show me an example based on ${focusTitle}.`,
  ]
}

const buildGeneralFallbackReply = ({
  context,
  message,
}: {
  context: AIAssistantLearningContext | null
  message: string
}) => {
  const focusTitle = getLearningFocusTitle(context)
  const normalizedMessage = message.toLowerCase()
  const howToMatch = message.match(howToPattern)

  if (isLikelyCurrentInfoQuestion(message)) {
    return [
      "I can still help with many broader questions locally, but this one sounds like it may need current or live information.",
      "For up-to-date facts like news, weather, prices, scores, or recent events, the connected live AI service is the better path.",
      "If you want, I can still help with background context, comparisons, or a timeless explanation around the topic.",
    ].join('\n\n')
  }

  if (
    /(focus|productive|productivity|time management|procrastinat|discipline|habit|motivat|burnout)/i.test(message)
  ) {
    return [
      "A practical way to improve focus is to make the next action small, visible, and easy to start.",
      "**Try this structure:**",
      "1. Pick one priority for the next session.",
      "2. Break it into a 20-30 minute starting task.",
      "3. Remove one distraction before you begin.",
      "4. Stop briefly afterward and note what slowed you down.",
      "If you want, I can turn that into a custom routine for your exact schedule.",
    ].join('\n\n')
  }

  if (/(study|learn faster|remember|memor|revision|revise|exam prep|practice plan)/i.test(message)) {
    return [
      "A strong study system usually comes from short review cycles, active recall, and consistent practice.",
      "**A simple study plan:**",
      "1. Learn one concept at a time.",
      "2. Summarize it in your own words.",
      "3. Test yourself without looking at notes.",
      "4. Revisit it again later the same day or week.",
      context
        ? `Since you're already working on **${focusTitle}**, I can also build the plan around that topic specifically.`
        : 'If you want, I can turn that into a one-week study plan.',
    ].join('\n\n')
  }

  if (/(resume|cv|cover letter|linkedin|bio|email|message|write|rewrite|draft)/i.test(message)) {
    return [
      "I can help with writing too.",
      "A good draft is usually clearer when it is specific about the goal, written for the reader, and short enough to scan quickly.",
      "If you share the situation and tone you want, I can help draft or rewrite a resume summary, cover letter, email, short message, or personal bio.",
    ].join('\n\n')
  }

  if (/(interview|career|job|portfolio|internship|networking|promotion)/i.test(message)) {
    return [
      "Career questions usually get easier when you break them into positioning, proof, and next steps.",
      "**Positioning:** make it clear what you're good at.",
      "**Proof:** show projects, results, or examples.",
      "**Next step:** pick the one improvement that gives you the most leverage.",
      "If you want, I can help with interview prep, portfolio direction, resume decisions, or choosing what skill to improve next.",
    ].join('\n\n')
  }

  if (/(idea|brainstorm|project idea|portfolio idea|startup idea|side project)/i.test(message)) {
    return [
      "A good brainstorming process starts with one constraint instead of trying to search everything at once.",
      "Useful constraints are: the audience, the problem, the time available, or the skills you want to showcase.",
      "If you want, I can brainstorm beginner project ideas, portfolio ideas, productivity tools, or learning-tool concepts with you.",
    ].join('\n\n')
  }

  if (/(artificial intelligence|\bai\b|machine learning|large language model|\bllm\b)/i.test(message)) {
    return [
      "Artificial intelligence is the broader field of building systems that perform tasks that usually require human-like pattern recognition or decision making.",
      "Machine learning is one approach inside AI, and large language models are a family of AI systems trained on massive amounts of text to understand and generate language.",
      "If you want, I can explain AI from a beginner, practical, or career angle next.",
    ].join('\n\n')
  }

  if (howToMatch?.[1]) {
    return [
      `A practical way to **${howToMatch[1].trim()}** is to turn it into a very small plan you can actually follow.`,
      "**Try this approach:**",
      "1. Define what a good outcome looks like.",
      "2. Start with the smallest meaningful first step.",
      "3. Remove the biggest source of friction.",
      "4. Review what worked and adjust after one short attempt.",
      context
        ? `If you want, I can make that more specific and connect it to **${focusTitle}** where it helps.`
        : 'If you want, tell me your situation and I can tailor that plan.',
    ].join('\n\n')
  }

  return [
    context
      ? `I can help with broader questions too, and I’ll only pull in **${focusTitle}** if it genuinely helps the answer.`
      : 'I can help with broader questions too, not just programming.',
    "The most useful answers usually get better when I know your goal, the situation you're in, and any constraint that matters most.",
    "If you want, send the question again with a little more detail and I’ll make the answer more practical and specific.",
  ].join('\n\n')
}

const buildFallbackReply = ({
  hasImageAttachment = false,
  context,
  message,
  selectedTool,
}: {
  hasImageAttachment?: boolean
  context: AIAssistantLearningContext | null
  message: string
  selectedTool: string | null
}) => {
  const focusTitle = getLearningFocusTitle(context)
  const language = context?.language?.toUpperCase()
  const summary =
    normalizeText(context?.topicSummary, 520) ||
    normalizeText(context?.lessonContent, 520)
  const codeExample = context?.codeExample?.trim()
  const normalizedMessage = message.toLowerCase()

  if (hasImageAttachment) {
    return [
      "I received your screenshot, but the live image-analysis path is unavailable right now, so I cannot inspect the pixels locally.",
      "If DevHub AI is online, resend the screenshot and I can analyze the interface, code, diagram, or error directly from the image.",
      "You can also type one short instruction with it, like **'explain this UI'**, **'find the bug in this screenshot'**, or **'describe what this diagram means'** for a stronger result.",
    ].join('\n\n')
  }

  if (
    normalizedMessage.includes('what is programming') ||
    normalizedMessage.includes('what is coding') ||
    normalizedMessage === 'programming' ||
    normalizedMessage === 'coding'
  ) {
    return [
      "Programming is the process of writing instructions that tell a computer how to perform a task.",
      "Think of it like giving a very literal assistant a recipe: every step has to be clear, ordered, and precise.",
      "**Simple example:**",
      "```javascript\nlet name = 'Ada';\nconsole.log('Hello, ' + name);\n```",
      "**What this does:** it stores a value in a variable and then prints a message using that value.",
      "Most programming questions then build on that same idea: using variables, conditions, loops, functions, and data structures to solve bigger problems.",
      context
        ? `Since you're currently on **${focusTitle}**, I can also connect programming back to this lesson specifically if you want.`
        : "If you want, I can explain programming from a beginner, JavaScript, Python, or web-development angle next.",
    ].join('\n\n')
  }

  if (
    normalizedMessage.includes('variable') ||
    normalizedMessage.includes('function') ||
    normalizedMessage.includes('loop') ||
    normalizedMessage.includes('condition') ||
    normalizedMessage.includes('array') ||
    normalizedMessage.includes('object') ||
    normalizedMessage.includes('class') ||
    normalizedMessage.includes('algorithm') ||
    normalizedMessage.includes('react') ||
    normalizedMessage.includes('python') ||
    normalizedMessage.includes('javascript') ||
    normalizedMessage.includes('html') ||
    normalizedMessage.includes('css') ||
    normalizedMessage.includes('sql') ||
    normalizedMessage.includes('git')
  ) {
    return [
      "I couldn't reach the live AI service, but I can still help with this programming topic.",
      context
        ? `I'll keep the explanation grounded in **${focusTitle}** where that makes sense, while still answering your broader coding question.`
        : "I can still give a practical programming explanation, code example ideas, and debugging direction.",
      "Ask me something specific like:",
      "- `What is a variable in JavaScript?`",
      "- `How do functions work in Python?`",
      "- `Explain loops with an example.`",
      "- `What is React state?`",
      "- `How do I debug this error?`",
    ].join('\n\n')
  }

  if (isLikelyCurrentInfoQuestion(message)) {
    return buildGeneralFallbackReply({ context, message })
  }

  if (!isLikelyTechnicalMessage(message)) {
    return buildGeneralFallbackReply({ context, message })
  }

  if (!context) {
    return [
      "I couldn't reach the live AI service right now.",
      'DevHub can still help locally with programming, study strategy, writing help, brainstorming, and many broader general questions.',
      'For very current facts like live news, weather, prices, or recent events, the connected live AI service is still the better path.',
      'If you want, ask again with a little context and I will give a best-effort answer locally.',
    ].join('\n\n')
  }

  const sections: string[] = [
    context
      ? `I couldn't reach the live AI service, but I can still help using the lesson context for **${focusTitle}**${context.courseTitle ? ` in **${context.courseTitle}**` : ''}.`
      : "I couldn't reach the live AI service just now, but I can still help with local guidance.",
  ]

  if (summary) {
    sections.push(`**Lesson snapshot:** ${summary}`)
  }

  if (
    normalizedMessage.includes('practice') ||
    normalizedMessage.includes('quiz') ||
    normalizedMessage.includes('question')
  ) {
    sections.push(
      `**Practice question:** What is the main purpose of **${focusTitle}**, and how would you explain it to someone learning ${language || 'this topic'} for the first time?`
    )
    sections.push(
      `**What a strong answer should include:** the core idea, when to use it, and one small example from the lesson.`
    )
  } else if (
    normalizedMessage.includes('example') ||
    selectedTool === 'generate-ideas'
  ) {
    sections.push(
      `**How this connects to your question:** a good example should stay close to **${focusTitle}** and keep the explanation practical instead of abstract.`
    )

    if (codeExample) {
      sections.push(`**Example from this lesson:**\n\`\`\`${context?.language || ''}\n${codeExample.slice(0, 800)}\n\`\`\``)
    } else if (summary) {
      sections.push(
        `**Quick example idea:** build a tiny demo that shows the key behavior described in the lesson summary above, then change one part and observe what happens.`
      )
    }
  } else if (
    normalizedMessage.includes('debug') ||
    normalizedMessage.includes('error') ||
    selectedTool === 'explain-code'
  ) {
    sections.push(
      `**Debugging direction:** compare the code you are working on against the lesson's expected pattern for **${focusTitle}**. Start by checking naming, syntax, and whether the code follows the same structure the lesson teaches.`
    )

    if (codeExample) {
      sections.push(
        `**Reference pattern from the lesson:**\n\`\`\`${context?.language || ''}\n${codeExample.slice(0, 800)}\n\`\`\``
      )
    }
  } else {
    sections.push(
      `**How this relates to your question:** ${focusTitle} is the key concept on this page, so the safest way to answer is to connect your question back to the lesson goal, the main concept being taught, and the example pattern shown in the content.`
    )
  }

  sections.push(
    context
      ? `Ask me something like "Explain ${focusTitle} step by step" or "Give me an example from this lesson" and I'll keep the answer tied to the page you're on.`
      : `If you ask about the exact lesson or topic you're viewing, I can make the response much more specific.`
  )

  return sections.join('\n\n')
}

const ChatTab: React.FC = () => {
  const [aiStatus, setAiStatus] = useState<AIChatStatus | null>(null)
  const [isStatusBannerVisible, setIsStatusBannerVisible] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceListening, setIsVoiceListening] = useState(false)
  const [isVoiceTranscribing, setIsVoiceTranscribing] = useState(false)
  const [chatFontScale, setChatFontScale] = useState(1)
  const [chatWrapLongLines, setChatWrapLongLines] = useState(true)
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const liveBannerExpiresAtRef = useRef<number | null>(null)
  const previousAiLiveRef = useRef<boolean | null>(null)
  const statusHideTimeoutRef = useRef<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const voiceRecordingTimeoutRef = useRef<number | null>(null)
  const recordedAudioChunksRef = useRef<Blob[]>([])
  const shouldTranscribeRecordingRef = useRef(false)
  const voiceModeRef = useRef<'speech-recognition' | 'audio-recording' | null>(null)
  const voiceListeningRef = useRef(false)
  const { showToast } = useToast()
  const { learningContext } = useAIAssistant()

  const focusComposer = useCallback(() => {
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
  }, [])

  const toolLookup = useMemo(
    () =>
      Object.fromEntries(
        learningPromptTools.map((tool) => [tool.id, tool.shortName])
      ),
    []
  )

  const contextPrompts = useMemo(
    () => buildContextAwarePrompts(learningContext),
    [learningContext]
  )

  const focusTitle = useMemo(
    () => getLearningFocusTitle(learningContext),
    [learningContext]
  )

  const liveSourceLabel = aiStatus?.sourceLabel || aiStatus?.providerLabel || 'Live AI'
  const assistantMessages = useMemo(
    () => messages.filter((message) => message.role === 'assistant'),
    [messages]
  )
  const latestAssistantMessage = assistantMessages[assistantMessages.length - 1] ?? null
  const expandedMessage =
    messages.find(
      (message) => message.id === expandedMessageId && message.role === 'assistant'
    ) ?? null
  const markdownComponents = useMemo(
    () =>
      createMarkdownComponents({
        fontScale: chatFontScale,
        wrapLongLines: chatWrapLongLines,
      }),
    [chatFontScale, chatWrapLongLines]
  )

  const assistantSubtitle = aiStatus?.live
    ? learningContext
      ? `Using ${liveSourceLabel} while keeping answers grounded in ${focusTitle}${learningContext.courseTitle ? ` from ${learningContext.courseTitle}` : ''} whenever that helps.`
      : `Using ${liveSourceLabel} for general questions, programming help, writing support, and broader learning guidance.`
    : learningContext
      ? `Grounded in ${focusTitle}${learningContext.courseTitle ? ` from ${learningContext.courseTitle}` : ''}, with a local DevHub fallback whenever live AI is not connected.`
      : 'Ask general questions, get programming help, debug code, explore examples, or connect answers back to the lesson you are viewing.'

  const loadStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/status')

      if (!response.ok) {
        throw new Error(`AI status request failed with status ${response.status}`)
      }

      const data = await response.json()

      setAiStatus({
        configured: Boolean(data.configured),
        enabled: Boolean(data.enabled),
        live: Boolean(data.live),
        message:
          typeof data.message === 'string' ? brandAICopy(data.message) : undefined,
        provider: typeof data.provider === 'string' ? data.provider : undefined,
        providerLabel:
          typeof data.providerLabel === 'string'
            ? brandAICopy(data.providerLabel)
            : data.provider === 'gemini'
              ? DEVHUB_AI_DISPLAY_NAME
            : undefined,
        source: typeof data.source === 'string' ? data.source : undefined,
        sourceLabel:
          typeof data.sourceLabel === 'string'
            ? brandAICopy(data.sourceLabel)
            : data.provider === 'gemini' && Boolean(data.live)
              ? `${DEVHUB_AI_DISPLAY_NAME} online`
            : undefined,
      })
    } catch (error) {
      console.error('AI status error:', error)
      setAiStatus((previous) => {
        if (previous?.live || previous?.configured || previous?.enabled) {
          return {
            ...previous,
            message:
              previous.live
                ? brandAICopy(previous.message) ||
                  'DevHub was recently connected to live AI and is checking the connection again in the background.'
                : brandAICopy(previous.message) ||
                  'DevHub is retrying the live AI connection in the background.',
            sourceLabel:
              brandAICopy(previous.sourceLabel) ||
              brandAICopy(previous.providerLabel) ||
              'Checking AI connection',
          }
        }

        return {
          configured: false,
          enabled: false,
          live: false,
          message:
            'DevHub could not confirm a live AI connection yet. It will keep retrying in the background and fall back locally until the backend responds.',
          source: 'local-fallback',
          sourceLabel: 'Local DevHub fallback',
        }
      })
    }
  }, [])

  useEffect(() => {
    void loadStatus()

    const intervalId = window.setInterval(() => {
      void loadStatus()
    }, 15000)

    const handleFocus = () => {
      void loadStatus()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadStatus()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loadStatus])

  useEffect(() => {
    if (!aiStatus) {
      setIsStatusBannerVisible(false)
      liveBannerExpiresAtRef.current = null
      previousAiLiveRef.current = null
      return
    }

    const wasLive = previousAiLiveRef.current
    previousAiLiveRef.current = aiStatus.live

    if (!aiStatus.live) {
      setIsStatusBannerVisible(true)
      liveBannerExpiresAtRef.current = null
      return
    }

    if (wasLive === true && liveBannerExpiresAtRef.current === null) {
      return
    }

    liveBannerExpiresAtRef.current = Date.now() + 7000
    setIsStatusBannerVisible(true)
  }, [aiStatus])

  useEffect(() => {
    if (statusHideTimeoutRef.current !== null) {
      window.clearTimeout(statusHideTimeoutRef.current)
      statusHideTimeoutRef.current = null
    }

    if (!aiStatus?.live || !isStatusBannerVisible || liveBannerExpiresAtRef.current === null) {
      return
    }

    const remainingTime = liveBannerExpiresAtRef.current - Date.now()

    if (remainingTime <= 0) {
      setIsStatusBannerVisible(false)
      liveBannerExpiresAtRef.current = null
      return
    }

    statusHideTimeoutRef.current = window.setTimeout(() => {
      setIsStatusBannerVisible(false)
      liveBannerExpiresAtRef.current = null
      statusHideTimeoutRef.current = null
    }, remainingTime)

    return () => {
      if (statusHideTimeoutRef.current !== null) {
        window.clearTimeout(statusHideTimeoutRef.current)
        statusHideTimeoutRef.current = null
      }
    }
  }, [aiStatus?.live, isStatusBannerVisible])

  const clearVoiceRecordingTimeout = useCallback(() => {
    if (voiceRecordingTimeoutRef.current !== null) {
      window.clearTimeout(voiceRecordingTimeoutRef.current)
      voiceRecordingTimeoutRef.current = null
    }
  }, [])

  const stopRecordedStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null
  }, [])

  const appendTranscriptToComposer = useCallback(
    (transcript: string) => {
      const normalizedTranscript = transcript.replace(/\s+/g, ' ').trim()

      if (!normalizedTranscript) {
        throw new Error('Voice input came back empty. Please try again.')
      }

      setInput((currentValue) =>
        currentValue.trim()
          ? `${currentValue.trim()} ${normalizedTranscript}`
          : normalizedTranscript
      )
      focusComposer()
    },
    [focusComposer]
  )

  const transcribeRecordedAudio = useCallback(
    async (audioBlob: Blob) => {
      if (!audioBlob.size) {
        showToast('No voice input was captured. Try again.', 'warning', 'top-right')
        return
      }

      const formData = new FormData()
      const preferredLocale = getPreferredVoiceLocale()
      formData.append(
        'audio',
        audioBlob,
        createVoiceRecordingFileName(audioBlob.type)
      )
      formData.append('locale', preferredLocale)

      if (learningContext?.language) {
        formData.append('language', learningContext.language)
      }

      if (learningContext?.courseTitle) {
        formData.append('courseTitle', learningContext.courseTitle)
      }

      if (learningContext?.topicTitle) {
        formData.append('topicTitle', learningContext.topicTitle)
      }

      if (learningContext?.lessonTitle) {
        formData.append('lessonTitle', learningContext.lessonTitle)
      }

      setIsVoiceTranscribing(true)

      try {
        const response = await fetch('/api/ai/transcribe', {
          method: 'POST',
          body: formData,
        })

        const payload = await response
          .json()
          .catch(() => null as { message?: string; transcript?: string } | null)

        if (!response.ok) {
          throw new Error(
            payload?.message ||
              'Voice input could not be transcribed right now. Please try again.'
          )
        }

        appendTranscriptToComposer(payload?.transcript || '')
        showToast('Voice input added to your message.', 'success', 'top-right')
      } catch (error) {
        console.warn('Voice transcription error:', error)
        showToast(
          error instanceof Error
            ? error.message
            : 'Voice input could not be transcribed right now. Please try again.',
          'warning',
          'top-right'
        )
      } finally {
        setIsVoiceTranscribing(false)
      }
    },
    [appendTranscriptToComposer, learningContext, showToast]
  )

  const stopFallbackRecording = useCallback(
    (shouldTranscribe: boolean) => {
      shouldTranscribeRecordingRef.current = shouldTranscribe
      clearVoiceRecordingTimeout()

      const recorder = mediaRecorderRef.current
      if (!recorder) {
        stopRecordedStream()
        voiceModeRef.current = null
        voiceListeningRef.current = false
        setIsVoiceListening(false)
        return
      }

      if (recorder.state === 'inactive') {
        stopRecordedStream()
        mediaRecorderRef.current = null
        voiceModeRef.current = null
        voiceListeningRef.current = false
        setIsVoiceListening(false)
        return
      }

      recorder.stop()
    },
    [clearVoiceRecordingTimeout, stopRecordedStream]
  )

  const startFallbackRecording = useCallback(async () => {
    if (
      typeof window === 'undefined' ||
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      showToast('Voice input is not available in this browser.', 'warning', 'top-right')
      focusComposer()
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: true,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      const mimeType = getSupportedVoiceRecordingMimeType()
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)

      mediaStreamRef.current = stream
      mediaRecorderRef.current = recorder
      recordedAudioChunksRef.current = []
      shouldTranscribeRecordingRef.current = true
      voiceModeRef.current = 'audio-recording'

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          recordedAudioChunksRef.current.push(event.data)
        }
      }

      recorder.onerror = (event: Event) => {
        console.warn('Fallback voice recorder error:', event)
        clearVoiceRecordingTimeout()
        stopRecordedStream()
        mediaRecorderRef.current = null
        voiceModeRef.current = null
        voiceListeningRef.current = false
        setIsVoiceListening(false)
        showToast(
          'Voice input could not keep recording. Please try again.',
          'warning',
          'top-right'
        )
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(recordedAudioChunksRef.current, {
          type: recorder.mimeType || mimeType || 'audio/webm',
        })
        const shouldTranscribe = shouldTranscribeRecordingRef.current

        clearVoiceRecordingTimeout()
        stopRecordedStream()
        mediaRecorderRef.current = null
        voiceModeRef.current = null
        voiceListeningRef.current = false
        setIsVoiceListening(false)
        recordedAudioChunksRef.current = []

        if (shouldTranscribe) {
          void transcribeRecordedAudio(audioBlob)
        }
      }

      recorder.start()
      voiceListeningRef.current = true
      setIsVoiceListening(true)
      focusComposer()
      showToast(
        'Listening now. Tap the mic again to finish, or wait a few seconds.',
        'info',
        'top-right'
      )

      voiceRecordingTimeoutRef.current = window.setTimeout(() => {
        showToast('Finishing your voice input...', 'info', 'top-right')
        stopFallbackRecording(true)
      }, MAX_VOICE_RECORDING_MS)

      return true
    } catch (error) {
      console.warn('Voice recording start error:', error)
      clearVoiceRecordingTimeout()
      stopRecordedStream()
      mediaRecorderRef.current = null
      voiceModeRef.current = null
      voiceListeningRef.current = false
      setIsVoiceListening(false)

      const message =
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Microphone access was blocked. Allow microphone permission for this site and try again.'
          : 'Voice input could not access your microphone right now. Please try again.'

      showToast(message, 'warning', 'top-right')
      focusComposer()
      return false
    }
  }, [
    clearVoiceRecordingTimeout,
    focusComposer,
    showToast,
    stopFallbackRecording,
    stopRecordedStream,
    transcribeRecordedAudio,
  ])

  useEffect(() => {
    voiceListeningRef.current = isVoiceListening
  }, [isVoiceListening])

  useEffect(() => {
    return () => {
      clearVoiceRecordingTimeout()
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      stopRecordedStream()
      mediaRecorderRef.current = null
      voiceModeRef.current = null
      voiceListeningRef.current = false
    }
  }, [clearVoiceRecordingTimeout, stopRecordedStream])

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = getPreferredVoiceLocale()
    recognition.maxAlternatives = 3

    recognition.onresult = (event: any) => {
      if (voiceModeRef.current !== 'speech-recognition') {
        return
      }

      const transcript = Array.from(event.results as any)
        .map((result: any) => {
          const alternatives = Array.from(result as any)
          return alternatives.sort(
            (first: any, second: any) => (second?.confidence ?? 0) - (first?.confidence ?? 0)
          )[0]
        })
        .map((result: any) => result.transcript)
        .join(' ')
        .trim()

      if (!transcript) {
        return
      }

      setInput((currentValue) =>
        currentValue.trim() ? `${currentValue.trim()} ${transcript}` : transcript
      )
      focusComposer()
    }

    recognition.onerror = (event: any) => {
      if (voiceModeRef.current !== 'speech-recognition') {
        return
      }

      voiceModeRef.current = null

      if (event?.error === 'no-speech') {
        showToast('I did not catch any speech. Please try again.', 'info', 'top-right')
      } else if (event?.error && event.error !== 'aborted') {
        void startFallbackRecording()
      }

      voiceListeningRef.current = false
      setIsVoiceListening(false)
    }

    recognition.onend = () => {
      if (voiceModeRef.current === 'speech-recognition') {
        voiceModeRef.current = null
      }
      voiceListeningRef.current = false
      setIsVoiceListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      voiceListeningRef.current = false
      recognition.stop()
      recognitionRef.current = null
    }
  }, [focusComposer, showToast, startFallbackRecording])

  useEffect(() => {
    const container = messagesRef.current

    if (!container) {
      return
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
  }, [isLoading, messages])

  useEffect(() => {
    if (!expandedMessageId) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedMessageId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedMessageId])

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt)
    focusComposer()
  }

  const handleVoiceClick = async () => {
    if (isVoiceTranscribing) {
      showToast('Voice input is still being processed. Please wait a moment.', 'info', 'top-right')
      return
    }

    if (voiceModeRef.current === 'audio-recording') {
      showToast('Processing your voice input...', 'info', 'top-right')
      stopFallbackRecording(true)
      focusComposer()
      return
    }

    if (voiceModeRef.current === 'speech-recognition' && voiceListeningRef.current) {
      voiceModeRef.current = null
      voiceListeningRef.current = false
      recognitionRef.current.stop()
      setIsVoiceListening(false)
      focusComposer()
      return
    }

    try {
      if (aiStatus?.live) {
        await startFallbackRecording()
        return
      }

      if (!recognitionRef.current) {
        await startFallbackRecording()
        return
      }

      voiceModeRef.current = 'speech-recognition'
      recognitionRef.current.start()
      voiceListeningRef.current = true
      setIsVoiceListening(true)
      showToast('Listening for your question...', 'info', 'top-right')
    } catch (error) {
      console.warn('Voice input error:', error)
      voiceModeRef.current = null
      voiceListeningRef.current = false
      setIsVoiceListening(false)
      const startedFallback = await startFallbackRecording()

      if (!startedFallback) {
        showToast('Voice input could not start right now. Try again.', 'warning', 'top-right')
      }
    }
  }

  const adjustChatFontScale = (delta: number) => {
    setChatFontScale((currentScale) => clampScale(currentScale + delta))
  }

  const expandedMessageModal =
    expandedMessage && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-slate-950/78 backdrop-blur-sm"
              onClick={() => setExpandedMessageId(null)}
            />

            <div className="relative z-10 flex h-[min(92vh,960px)] w-[min(1180px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_35px_120px_-45px_rgba(15,23,42,1)]">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-5 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">Large chat reader</p>
                  <p className="text-xs leading-5 text-slate-500">
                    Use the larger reader when a DevHub reply or code block feels cramped in the normal chat width.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustChatFontScale(-0.1)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Minus className="h-3.5 w-3.5" />
                    Smaller text
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustChatFontScale(0.1)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Larger text
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatWrapLongLines((currentState) => !currentState)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      chatWrapLongLines
                        ? 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {chatWrapLongLines ? 'Wrapped code' : 'One-line scroll'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedMessageId(null)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <Minimize2 className="h-3.5 w-3.5" />
                    Close large view
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-white px-5 py-5">
                {(expandedMessage.sourceLabel || expandedMessage.statusMessage) && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    {expandedMessage.sourceLabel ? (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${
                          expandedMessage.live
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        {expandedMessage.sourceLabel}
                      </span>
                    ) : null}
                    {expandedMessage.providerLabel ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {expandedMessage.providerLabel}
                      </span>
                    ) : null}
                  </div>
                )}

                <div
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-700 shadow-sm"
                  style={{
                    fontSize: `${(0.98 * chatFontScale).toFixed(2)}rem`,
                    lineHeight: 1.85,
                  }}
                >
                  {expandedMessage.generatedImageUrl ? (
                    <div className="mb-4 overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-50">
                      <img
                        src={expandedMessage.generatedImageUrl}
                        alt="Generated by DevHub AI"
                        className="max-h-[26rem] w-full object-contain"
                      />
                    </div>
                  ) : null}
                  <ReactMarkdown components={markdownComponents}>
                    {expandedMessage.content}
                  </ReactMarkdown>
                  {expandedMessage.statusMessage ? (
                    <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
                      {expandedMessage.statusMessage}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  const handleSend = async ({
    imageFile,
    imagePreview,
    message,
    selectedTool,
  }: PromptSubmitPayload) => {
    const hasImageAttachment = Boolean(imagePreview)
    const userVisibleMessage =
      message.trim() ||
      (hasImageAttachment ? 'Please help me with the attached screenshot.' : '')
    const requestMessage = hasImageAttachment
      ? buildImageAwarePrompt(userVisibleMessage)
      : userVisibleMessage

    if (!requestMessage) {
      return
    }

    const messageId = Date.now().toString()
    const { user } = useAuthStore.getState()
    const recentConversation = [
      ...messages.slice(-4).map((entry) => `${entry.role}: ${entry.content}`),
      `user: ${requestMessage}`,
    ]

    setMessages((previous) => [
      ...previous,
      {
        attachmentName: imageFile?.name,
        attachmentPreview: imagePreview ?? undefined,
        content: userVisibleMessage,
        id: `user-${messageId}`,
        role: 'user',
        toolId: selectedTool ?? undefined,
      },
    ])
    setIsLoading(true)

    try {
      const sendChatRequest = async (payloadMessage: string, visionRetry = false) =>
        fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: payloadMessage,
            context: {
              attachmentName: imageFile?.name,
              attachmentType: imageFile?.type,
              imageDataUrl: imagePreview ?? undefined,
              imageAnalysisRequired: hasImageAttachment || undefined,
              imageAnalysisRetry: visionRetry || undefined,
              source: 'assistant-chat-tab',
              tool: selectedTool ?? undefined,
              topic:
                learningContext?.topicTitle ||
                learningContext?.lessonTitle ||
                learningContext?.courseTitle,
              language: learningContext?.language,
              courseId: learningContext?.courseId,
              courseTitle: learningContext?.courseTitle,
              topicSlug: learningContext?.topicSlug,
              topicTitle: learningContext?.topicTitle,
              topicSummary: normalizeText(learningContext?.topicSummary),
              lessonId: learningContext?.lessonId,
              lessonTitle: learningContext?.lessonTitle,
              lessonContent: normalizeText(learningContext?.lessonContent, 2200),
              codeExample: learningContext?.codeExample?.slice(0, 1200),
              route: learningContext?.route,
              recentConversation: recentConversation.join('\n'),
            },
            userId: user?.id ?? null,
          }),
        })

      const response = await sendChatRequest(requestMessage)

      if (!response.ok) {
        const errorPayload = await response.text().catch(() => '')
        throw new Error(
          `AI chat request failed with status ${response.status}${errorPayload ? `: ${errorPayload}` : ''}`
        )
      }

      let data = await response.json()

      if (
        hasImageAttachment &&
        typeof data.reply === 'string' &&
        imageAnalysisRefusalPattern.test(data.reply)
      ) {
        const retryResponse = await sendChatRequest(buildVisionOnlyPrompt(userVisibleMessage), true)

        if (retryResponse.ok) {
          const retryData = await retryResponse.json()
          if (
            typeof retryData.reply === 'string' &&
            retryData.reply.trim() &&
            !imageAnalysisRefusalPattern.test(retryData.reply)
          ) {
            data = retryData
          }
        }
      }

      const reply =
        typeof data.reply === 'string' && data.reply.trim()
          ? data.reply
          : buildFallbackReply({
              hasImageAttachment,
              context: learningContext,
              message: requestMessage,
              selectedTool,
            })

      const live = Boolean(data.live)
      const providerLabel =
        typeof data.providerLabel === 'string'
          ? brandAICopy(data.providerLabel)
          : data.provider === 'gemini'
            ? DEVHUB_AI_DISPLAY_NAME
            : undefined
      const sourceLabel =
        typeof data.sourceLabel === 'string'
          ? brandAICopy(data.sourceLabel)
          : live
            ? data.provider === 'gemini'
              ? `${DEVHUB_AI_DISPLAY_NAME} online`
              : 'Live AI'
            : 'Local DevHub fallback'
      const statusMessage =
        typeof data.statusMessage === 'string'
          ? brandAICopy(data.statusMessage)
          : undefined

      setAiStatus((previous) => ({
        configured:
          typeof data.configured === 'boolean'
            ? Boolean(data.configured)
            : Boolean(data.live) ||
              Boolean(data.provider) ||
              Boolean(providerLabel) ||
              (previous?.configured ?? false),
        enabled:
          typeof data.enabled === 'boolean'
            ? Boolean(data.enabled)
            : previous?.enabled ?? true,
        live,
        message: statusMessage ?? previous?.message,
        provider:
          typeof data.provider === 'string' ? data.provider : previous?.provider,
        providerLabel: providerLabel ?? previous?.providerLabel,
        source: typeof data.source === 'string' ? data.source : previous?.source,
        sourceLabel,
      }))

      setMessages((previous) => [
        ...previous,
        {
          content: reply,
          generatedImageUrl:
            typeof data.generatedImageUrl === 'string' && data.generatedImageUrl.trim()
              ? data.generatedImageUrl
              : undefined,
          id: `assistant-${Date.now()}`,
          live,
          providerLabel,
          role: 'assistant',
          sourceLabel,
          statusMessage,
        },
      ])
    } catch (error) {
      console.error('AI chat error:', error)
      void loadStatus()
      showToast(
        aiStatus?.message ||
          (learningContext
            ? `Live AI is unavailable, so DevHub used the current ${learningContext.topicTitle ? 'topic' : 'lesson'} context instead.`
            : 'Live AI is unavailable right now, so DevHub is falling back to local guidance until the DevHub AI backend reconnects.'),
        'warning',
        'top-right'
      )
      setMessages((previous) => [
        ...previous,
        {
          content: buildFallbackReply({
            hasImageAttachment,
            context: learningContext,
            message: requestMessage,
            selectedTool,
          }),
          id: `assistant-${Date.now()}`,
          live: false,
          providerLabel: aiStatus?.providerLabel,
          role: 'assistant',
          sourceLabel: 'Local DevHub fallback',
          statusMessage:
            aiStatus?.message ||
            'The live AI backend is unavailable, so this answer came from the local fallback.',
        },
      ])
    } finally {
      setIsLoading(false)
      focusComposer()
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 sm:gap-4">
      <div className="rounded-[1.45rem] border border-sky-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-3 shadow-[0_18px_35px_-32px_rgba(14,165,233,0.6)] sm:rounded-[1.6rem] sm:p-4">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0ea5e9_0%,#0284c7_100%)] text-white shadow-lg shadow-sky-200/70">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {learningContext
                ? `Ask DevHub AI about ${focusTitle}`
                : 'Ask DevHub AI anything'}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {assistantSubtitle}
            </p>
          </div>
        </div>

        {learningContext ? (
          <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="truncate">
              {learningContext.topicTitle || learningContext.lessonTitle || learningContext.courseTitle}
            </span>
          </div>
        ) : null}

        {aiStatus && isStatusBannerVisible ? (
          <div
            className={`mt-4 rounded-[1.35rem] border px-3.5 py-3 text-sm shadow-sm ${
              aiStatus.live
                ? 'border-emerald-100 bg-emerald-50/80 text-emerald-700'
                : 'border-amber-100 bg-amber-50/90 text-amber-800'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${
                    aiStatus.live ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <p className="truncate text-sm font-semibold">
                  {aiStatus.live
                    ? aiStatus.sourceLabel || aiStatus.providerLabel || 'Live AI connected'
                    : aiStatus.sourceLabel || 'Local DevHub fallback'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!aiStatus.live ? (
                  <button
                    type="button"
                    onClick={() => void loadStatus()}
                    className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:bg-white hover:text-slate-900"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Retry
                  </button>
                ) : null}
                {aiStatus.providerLabel ? (
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {aiStatus.providerLabel}
                  </span>
                ) : null}
              </div>
            </div>
            {aiStatus.message ? (
              <p className="mt-2 leading-6">{aiStatus.message}</p>
            ) : null}
          </div>
        ) : null}

        {messages.length === 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {contextPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSuggestionClick(prompt)}
                className="rounded-full border border-sky-100 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {messages.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800">Chat reading controls</p>
            <p className="text-xs leading-5 text-slate-500">
              Enlarge replies or switch between wrapped code and single-line scrolling when an answer gets too wide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => adjustChatFontScale(-0.1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Minus className="h-3.5 w-3.5" />
              Smaller text
            </button>
            <button
              type="button"
              onClick={() => adjustChatFontScale(0.1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Larger text
            </button>
            <button
              type="button"
              onClick={() => setChatWrapLongLines((currentState) => !currentState)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                chatWrapLongLines
                  ? 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {chatWrapLongLines ? 'Wrapped code' : 'One-line scroll'}
            </button>
            <button
              type="button"
              onClick={() => latestAssistantMessage && setExpandedMessageId(latestAssistantMessage.id)}
              disabled={!latestAssistantMessage}
              className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Open latest reply
            </button>
          </div>
        </div>
      ) : null}

      <div
        ref={messagesRef}
        className="min-h-[8rem] flex-1 space-y-3 overflow-y-auto pr-1 sm:min-h-[10rem]"
      >
        {messages.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/90 px-4 py-5 text-sm leading-6 text-slate-500">
            {learningContext
              ? `Start with a question about ${focusTitle}, or ask something broader and I’ll connect it back to this lesson where useful.`
              : 'Start with any question, a code issue, a writing task, or a planning problem.'}
          </div>
        ) : null}

        {messages.map((message) => {
          const isUser = message.role === 'user'
          const toolLabel = message.toolId ? toolLookup[message.toolId] : null

          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[92%] items-start gap-3 ${
                  isUser ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {isUser ? (
                    <UserRound className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={`rounded-[1.5rem] px-4 py-3 shadow-sm ${
                    isUser
                      ? 'bg-[linear-gradient(135deg,#0ea5e9_0%,#0284c7_100%)] text-white'
                      : 'border border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {(toolLabel || message.attachmentName) && isUser ? (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {toolLabel ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/18 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/90">
                          <Lightbulb className="h-3 w-3" />
                          {toolLabel}
                        </span>
                      ) : null}
                      {message.attachmentName ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/18 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/90">
                          <ImageIcon className="h-3 w-3" />
                          Attachment
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {!isUser && (message.sourceLabel || message.statusMessage) ? (
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {message.sourceLabel ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${
                              message.live
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            <Sparkles className="h-3 w-3" />
                            {message.sourceLabel}
                          </span>
                        ) : null}
                        {message.providerLabel ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                            {message.providerLabel}
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedMessageId(message.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                      >
                        <Maximize2 className="h-3 w-3" />
                        Larger view
                      </button>
                    </div>
                  ) : null}

                  {isUser ? (
                    <div className="space-y-3">
                      {message.attachmentPreview ? (
                        <img
                          src={message.attachmentPreview}
                          alt={message.attachmentName || 'Attached screenshot'}
                          className="max-h-44 w-full rounded-2xl border border-white/15 object-cover"
                        />
                      ) : null}
                      <p className="whitespace-pre-wrap text-sm leading-6 text-white">
                        {message.content}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="text-slate-700"
                      style={{
                        fontSize: `${(0.92 * chatFontScale).toFixed(2)}rem`,
                        lineHeight: 1.8,
                      }}
                    >
                      {message.generatedImageUrl ? (
                        <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                          <img
                            src={message.generatedImageUrl}
                            alt="Generated by DevHub AI"
                            className="max-h-72 w-full object-contain"
                          />
                        </div>
                      ) : null}
                      <ReactMarkdown components={markdownComponents}>
                        {message.content}
                      </ReactMarkdown>
                      {message.statusMessage ? (
                        <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
                          {message.statusMessage}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="flex max-w-[92%] items-start gap-3">
              <div className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <OrbitalLoader
                  className="shrink-0"
                  message="Thinking through your request..."
                  messagePlacement="right"
                  size="sm"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <PromptBox
        ref={textareaRef}
        value={input}
        onValueChange={setInput}
        onSubmit={handleSend}
        onVoiceClick={handleVoiceClick}
        isLoading={isLoading}
        voiceActive={isVoiceListening}
        placeholder={
          learningContext
            ? `Ask about ${focusTitle}, or any general or programming question, request examples, or debug code...`
            : 'Ask any question, brainstorm ideas, get writing help, request examples, or debug code...'
        }
      />
      {expandedMessageModal}
    </div>
  )
}

export default ChatTab





