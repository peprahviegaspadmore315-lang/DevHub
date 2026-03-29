import { useEffect, useMemo, useRef, useState } from 'react'
import { Mic, Pause, Play, Square } from 'lucide-react'

import '../AIAssistant.css'
import { useAIAssistant } from '@/contexts/AIAssistantContext'
import { VoiceChat, type VoiceChatMode } from '@/components/ui/ia-siri-chat'

const ReadingTab = () => {
  const {
    readingText,
    setReadingText,
    isReading,
    isPaused,
    currentWordIndex,
    startReading,
    resumeReading,
    pauseReading,
    stopReading,
  } = useAIAssistant()

  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const recognitionRef = useRef<any>(null)
  const listeningRef = useRef(false)
  const processingTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    listeningRef.current = isListening
  }, [isListening])

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      const nextTranscript = Array.from(event.results as any)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join(' ')
        .trim()

      const normalizedTranscript = nextTranscript.toLowerCase()
      setTranscript(normalizedTranscript)

      if (normalizedTranscript.includes('start reading') || normalizedTranscript.includes('resume reading')) {
        handleStartReading()
        setTranscript('')
      } else if (
        normalizedTranscript.includes('stop reading') ||
        normalizedTranscript.includes('pause reading')
      ) {
        handleStopReading()
        setTranscript('')
      }
    }

    recognition.onend = () => {
      if (listeningRef.current) {
        recognition.start()
      }
    }

    recognitionRef.current = recognition

    return () => {
      listeningRef.current = false
      recognition.stop()
      recognitionRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current)
      processingTimeoutRef.current = null
    }

    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const isSessionActive = isListening || isProcessing || isReading
    if (!isSessionActive) {
      return
    }

    const timer = window.setInterval(() => {
      setSessionSeconds((current) => current + 1)
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [isListening, isProcessing, isReading])

  useEffect(() => {
    if (!isReading && !isPaused && !isListening && !isProcessing) {
      setSessionSeconds(0)
    }
  }, [isListening, isPaused, isProcessing, isReading])

  const beginSpeechSynthesis = () => {
    if (!readingText.trim()) {
      return
    }

    if (isPaused) {
      resumeReading()
      return
    }

    setIsProcessing(true)
    processingTimeoutRef.current = window.setTimeout(() => {
      setIsProcessing(false)
      startReading()
    }, 420)
  }

  const handleStartReading = () => {
    beginSpeechSynthesis()
  }

  const handlePauseReading = () => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current)
      processingTimeoutRef.current = null
      setIsProcessing(false)
    }

    pauseReading()
  }

  const handleStopReading = () => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current)
      processingTimeoutRef.current = null
      setIsProcessing(false)
    }

    stopReading()
    setSessionSeconds(0)
  }

  const toggleListening = () => {
    if (!recognitionRef.current || !readingText.trim()) {
      return
    }

    if (isListening) {
      listeningRef.current = false
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    recognitionRef.current.start()
    listeningRef.current = true
    setIsListening(true)
  }

  const voiceMode: VoiceChatMode = useMemo(() => {
    if (isListening) return 'listening'
    if (isProcessing) return 'processing'
    if (isReading) return 'speaking'
    if (isPaused) return 'paused'
    return 'idle'
  }, [isListening, isProcessing, isReading, isPaused])

  const getHighlightedText = () => {
    if (!readingText) return ''
    const words = readingText.split(/\s+/)
    if (currentWordIndex >= words.length) {
      return readingText
    }

    const highlightedWords = words.slice(0, currentWordIndex)
    return highlightedWords.join(' ') + (highlightedWords.length > 0 ? ' ' : '')
  }

  const getRemainingText = () => {
    if (!readingText) return ''
    const words = readingText.split(/\s+/)
    if (currentWordIndex >= words.length) {
      return ''
    }

    return words.slice(currentWordIndex).join(' ')
  }

  return (
    <div className="ai-tab-content">
      <div className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-[1.15rem] font-semibold text-slate-900">Reading Assistant</h3>
          <p className="text-sm leading-6 text-slate-500">
            Use voice commands like &quot;Start reading&quot;, or control the assistant manually below.
          </p>
        </div>

        <VoiceChat
          mode={voiceMode}
          durationSeconds={sessionSeconds}
          onToggle={toggleListening}
          disabled={!readingText.trim()}
          className="rounded-[24px]"
          title={
            isReading
              ? 'DevHub is reading your content'
              : isListening
                ? 'Listening for voice commands'
                : isProcessing
                  ? 'Preparing the reading flow'
                  : isPaused
                    ? 'Reading paused'
                    : 'Voice reading ready'
          }
          hint={
            isReading
              ? 'Follow along while the assistant reads your selected text aloud.'
              : 'Tap the orb to use voice commands, or press Start Reading below.'
          }
        />

        <div className="space-y-2">
          <label
            htmlFor="reading-text"
            className="block text-sm font-medium text-slate-700"
          >
            Text to read
          </label>
          <textarea
            id="reading-text"
            value={readingText}
            onChange={(event) => setReadingText(event.target.value)}
            placeholder="Paste or select text to read..."
            rows={6}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mic className="h-4 w-4 text-sky-500" />
            Voice Commands
          </div>
          <button
            type="button"
            onClick={toggleListening}
            disabled={!readingText.trim()}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isListening
                ? 'bg-sky-600 text-white shadow-[0_12px_30px_-18px_rgba(2,132,199,0.7)]'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-sky-300 hover:text-sky-700'
            } ${!readingText.trim() ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            {isListening ? 'Stop Voice Commands' : 'Start Voice Commands'}
          </button>

          {transcript && (
            <p className="mt-3 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-800">
              Heard: &quot;{transcript}&quot;
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleStartReading}
            disabled={isProcessing || (!isPaused && isReading) || !readingText.trim()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Play className="h-4 w-4" />
            {isPaused ? 'Resume' : isProcessing ? 'Loading' : 'Start'}
          </button>
          <button
            type="button"
            onClick={handlePauseReading}
            disabled={!isReading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            <Pause className="h-4 w-4" />
            Pause
          </button>
          <button
            type="button"
            onClick={handleStopReading}
            disabled={!isReading && !isPaused && !isProcessing}
            className="flex items-center justify-center gap-2 rounded-2xl bg-amber-100 px-3 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            <Square className="h-4 w-4" />
            Stop
          </button>
        </div>
      </div>

      {readingText && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm leading-7">
            <span className="rounded-md bg-sky-600 px-1.5 py-1 font-medium text-white">
              {getHighlightedText()}
            </span>
            <span className="text-slate-500">{getRemainingText()}</span>
          </div>
        </div>
      )}

      {!readingText && (
        <p className="ai-placeholder">Paste a lesson or paragraph here to let DevHub read it aloud.</p>
      )}
    </div>
  )
}

export default ReadingTab
