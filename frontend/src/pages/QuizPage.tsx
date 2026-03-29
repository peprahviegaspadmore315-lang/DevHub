import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react'

import { useAIAssistant } from '@/contexts/AIAssistantContext'
import { useQuizRobot } from '@/components/robot'
import { quizzesApi } from '@/services/api'
import { useAuthStore } from '@/store'
import type { Question, Quiz } from '@/types'

const getAnswerLetter = (index: number) => String.fromCharCode(65 + index)

const shuffleArray = <T,>(items: T[]) => {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]]
  }

  return nextItems
}

const shuffleQuizQuestions = (questions: Question[]) =>
  shuffleArray(questions).map((question) => ({
    ...question,
    answers: shuffleArray(question.answers),
  }))

const QuizPage = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { openAssistantTab } = useAIAssistant()
  const { onQuizStart, onCorrectAnswer, onWrongAnswer, onQuizComplete } = useQuizRobot()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const quizIdNumber = quizId ? Number.parseInt(quizId, 10) : Number.NaN
  const hasQuizId = Number.isFinite(quizIdNumber)

  const answeredCount = useMemo(
    () => Object.keys(selectedAnswers).length,
    [selectedAnswers]
  )

  const correctCount = useMemo(
    () =>
      questions.reduce((total, question) => {
        const selectedAnswer = selectedAnswers[question.id]
        const correctAnswer = question.answers.find((answer) => answer.isCorrect)
        return total + (correctAnswer && selectedAnswer === correctAnswer.id ? 1 : 0)
      }, 0),
    [questions, selectedAnswers]
  )

  const incorrectCount = useMemo(
    () => questions.length - correctCount,
    [correctCount, questions.length]
  )

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSubmit = useCallback(async () => {
    if (!quiz || questions.length === 0 || submitted) {
      return
    }

    setSubmitting(true)

    const finalScore = Math.round((correctCount / questions.length) * 100)
    setScore(finalScore)
    setSubmitted(true)

    onQuizComplete({
      score: finalScore,
      passed: finalScore >= quiz.passingScore,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
    })

    if (isAuthenticated && hasQuizId) {
      try {
        await quizzesApi.submit(quizIdNumber, selectedAnswers)
      } catch (submitError) {
        console.error('Failed to submit quiz:', submitError)
      }
    }

    setSubmitting(false)
  }, [
    correctCount,
    hasQuizId,
    isAuthenticated,
    onQuizComplete,
    questions.length,
    quiz,
    quizIdNumber,
    selectedAnswers,
    submitted,
  ])

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!hasQuizId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const [quizResponse, questionsResponse] = await Promise.all([
          quizzesApi.getById(quizIdNumber),
          quizzesApi.getQuestions(quizIdNumber),
        ])

        setQuiz(quizResponse.data)
        setQuestions(shuffleQuizQuestions(questionsResponse.data))
        onQuizStart()

        if (quizResponse.data.timeLimitMinutes) {
          setTimeLeft(quizResponse.data.timeLimitMinutes * 60)
        } else {
          setTimeLeft(null)
        }
      } catch (fetchError) {
        console.error('Failed to fetch quiz:', fetchError)
        setError("We couldn't load this quiz right now.")
      } finally {
        setLoading(false)
      }
    }

    void fetchQuiz()
  }, [hasQuizId, onQuizStart, quizIdNumber])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) {
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous === null || previous <= 1) {
          void handleSubmit()
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [handleSubmit, submitted, timeLeft])

  const handleAnswerSelect = useCallback(
    (answerId: number) => {
      if (submitted) {
        return
      }

      const activeQuestion = questions[currentQuestion]
      if (!activeQuestion) {
        return
      }

      const correctAnswer = activeQuestion.answers.find((answer) => answer.isCorrect)
      const isCorrect = correctAnswer?.id === answerId

      if (isCorrect) {
        onCorrectAnswer()
      } else {
        onWrongAnswer(correctAnswer?.answerText)
      }

      setSelectedAnswers((previous) => ({
        ...previous,
        [activeQuestion.id]: answerId,
      }))
    },
    [currentQuestion, onCorrectAnswer, onWrongAnswer, questions, submitted]
  )

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setQuestions((previous) => shuffleQuizQuestions(previous))
    setSelectedAnswers({})
    setSubmitted(false)
    setScore(0)
    setSubmitting(false)
    setError(null)

    if (quiz?.timeLimitMinutes) {
      setTimeLeft(quiz.timeLimitMinutes * 60)
    } else {
      setTimeLeft(null)
    }

    onQuizStart()
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="grid gap-6 lg:grid-cols-[0.92fr,1.08fr]">
          <div className="space-y-4 rounded-[2rem] border border-orange-100 bg-orange-50/70 p-6">
            <div className="h-8 w-32 rounded-full bg-orange-100" />
            <div className="h-10 w-3/4 rounded-2xl bg-orange-100" />
            <div className="h-24 rounded-[1.5rem] bg-white/80" />
            <div className="h-32 rounded-[1.5rem] bg-white/80" />
          </div>
          <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="h-8 w-1/3 rounded-2xl bg-slate-100" />
            <div className="h-16 rounded-[1.5rem] bg-slate-100" />
            <div className="space-y-3">
              <div className="h-16 rounded-[1.25rem] bg-slate-100" />
              <div className="h-16 rounded-[1.25rem] bg-slate-100" />
              <div className="h-16 rounded-[1.25rem] bg-slate-100" />
              <div className="h-16 rounded-[1.25rem] bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!hasQuizId) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-orange-100 bg-[linear-gradient(135deg,#fffaf3_0%,#fff0dd_48%,#ffe6c9_100%)] p-8 shadow-[0_28px_60px_-42px_rgba(234,88,12,0.55)]">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-orange-300/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-amber-200/40 blur-3xl" />

          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-orange-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Quiz workspace
            </div>

            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                Pick a quiz source first.
              </h1>
              <p className="mt-3 text-base leading-7 text-slate-600">
                This page now supports richer quiz layouts, but it still needs a real quiz ID to
                load course questions. If you want something instant, open DevHub AI quiz mode and
                generate a guided set from any lesson or topic.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openAssistantTab('quiz')}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316_0%,#ea580c_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_32px_-20px_rgba(234,88,12,0.9)] transition hover:-translate-y-0.5"
              >
                <Bot className="h-4 w-4" />
                Open AI quiz mode
              </button>
              <button
                type="button"
                onClick={() => navigate('/topics')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Browse topics
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !quiz || questions.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_50px_-36px_rgba(15,23,42,0.35)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
            Quiz unavailable
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            {error || 'Quiz not found'}
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-500">
            Try returning to your course, or open the AI quiz flow for a generated practice set.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
            <button
              type="button"
              onClick={() => openAssistantTab('quiz')}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Bot className="h-4 w-4" />
              Open AI quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  const activeQuestion = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const passed = score >= quiz.passingScore
  const selectedCurrentAnswer = selectedAnswers[activeQuestion.id]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="relative overflow-hidden rounded-[2.4rem] border border-orange-100 bg-[linear-gradient(135deg,#fffaf3_0%,#fff2df_44%,#ffe4c4_100%)] p-4 shadow-[0_30px_70px_-46px_rgba(234,88,12,0.5)] sm:p-6 lg:p-8">
        <div className="absolute -right-14 top-0 h-44 w-44 rounded-full bg-orange-300/28 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-amber-200/36 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[0.92fr,1.08fr]">
          <div className="space-y-5">
            <div className="rounded-[1.9rem] border border-white/80 bg-white/72 p-5 shadow-sm backdrop-blur">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-orange-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Guided quiz flow
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {questions.length} questions
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                {quiz.title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {quiz.description ||
                  'A cleaner, more guided quiz experience inspired by soft onboarding layouts and card-based progression.'}
              </p>

              <div className="mt-5 rounded-[1.45rem] border border-orange-100 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_100%)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Completion
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      Question {currentQuestion + 1} of {questions.length}
                    </p>
                  </div>
                  {timeLeft !== null ? (
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${
                        timeLeft < 60
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}
                    >
                      <Clock3 className="h-4 w-4" />
                      {formatTime(timeLeft)}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-orange-100/80">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(135deg,#fb923c_0%,#ea580c_100%)] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[1.2rem] border border-white/90 bg-white px-4 py-3 shadow-sm">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Answered
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">{answeredCount}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/90 bg-white px-4 py-3 shadow-sm">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Pass mark
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">{quiz.passingScore}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.9rem] border border-white/80 bg-white/72 p-5 shadow-sm backdrop-blur">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Steps
              </p>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {questions.map((question, index) => {
                  const isActive = index === currentQuestion
                  const isAnswered = typeof selectedAnswers[question.id] === 'number'

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setCurrentQuestion(index)}
                      className={`inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition ${
                        isActive
                          ? 'border-orange-300 bg-orange-500 text-white shadow-[0_18px_28px_-18px_rgba(234,88,12,0.8)]'
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

              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                <div className="flex items-start gap-3 rounded-[1.2rem] border border-orange-100 bg-orange-50/60 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  Pick one answer per question and move through the cards like an onboarding flow.
                </div>
                <div className="flex items-start gap-3 rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3">
                  <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                  Finish all questions to unlock your score, pass status, and a quick performance snapshot.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {!submitted ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_26px_50px_-38px_rgba(15,23,42,0.32)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Question {currentQuestion + 1}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold leading-8 tracking-[-0.03em] text-slate-950">
                      {activeQuestion.questionText}
                    </h2>
                  </div>
                  {timeLeft !== null ? (
                    <span className="hidden rounded-full bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 sm:inline-flex">
                      {formatTime(timeLeft)}
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 space-y-3">
                  {activeQuestion.answers.map((answer, answerIndex) => {
                    const isSelected = selectedCurrentAnswer === answer.id

                    return (
                      <button
                        key={answer.id}
                        type="button"
                        onClick={() => handleAnswerSelect(answer.id)}
                        className={`flex w-full items-start gap-3 rounded-[1.35rem] border px-4 py-4 text-left transition ${
                          isSelected
                            ? 'border-orange-300 bg-orange-50 text-slate-950 shadow-[0_18px_28px_-22px_rgba(234,88,12,0.45)]'
                            : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-orange-200 hover:bg-orange-50/70'
                        }`}
                      >
                        <span
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            isSelected
                              ? 'bg-orange-500 text-white'
                              : 'bg-white text-slate-500 shadow-sm'
                          }`}
                        >
                          {getAnswerLetter(answerIndex)}
                        </span>
                        <span className="pt-1 text-sm leading-6">{answer.answerText}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentQuestion((previous) => Math.max(previous - 1, 0))}
                    disabled={currentQuestion === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  {currentQuestion < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestion((previous) => previous + 1)}
                      className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316_0%,#ea580c_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_30px_-20px_rgba(234,88,12,0.85)] transition hover:-translate-y-0.5"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleSubmit()}
                      disabled={submitting || answeredCount < questions.length}
                      className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f97316_0%,#ea580c_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_30px_-20px_rgba(234,88,12,0.85)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                      {submitting ? 'Scoring...' : 'Submit quiz'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_26px_50px_-38px_rgba(15,23,42,0.32)]">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_22px_34px_-22px_rgba(15,23,42,0.4)] ${
                        passed
                          ? 'bg-[linear-gradient(135deg,#10b981_0%,#059669_100%)]'
                          : 'bg-[linear-gradient(135deg,#fb923c_0%,#ea580c_100%)]'
                      }`}
                    >
                      {passed ? <Trophy className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                    </div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                      {passed ? 'You passed.' : 'Keep going.'}
                    </h2>
                    <p className="mt-2 text-base leading-7 text-slate-600">
                      You scored {score}%. {passed ? 'Nice work locking it in.' : 'A quick retry will likely move this up fast.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                      <p className="text-2xl font-semibold text-slate-950">{score}%</p>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Score
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">
                      <p className="inline-flex items-center justify-center gap-1 text-2xl font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        {correctCount}
                      </p>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-600">
                        Correct
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-rose-100 bg-rose-50 px-4 py-3 text-center">
                      <p className="inline-flex items-center justify-center gap-1 text-2xl font-semibold text-rose-700">
                        <XCircle className="h-4 w-4" />
                        {incorrectCount}
                      </p>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-rose-600">
                        Missed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-orange-100 bg-orange-50/70 p-4 text-sm leading-7 text-slate-700">
                  <p className="font-semibold text-orange-700">Performance note</p>
                  <p className="mt-1">
                    You answered {answeredCount} questions, with a passing target of {quiz.passingScore}%.
                    {passed
                      ? ' This one is safely complete.'
                      : ' Review the topics you missed, then run it again while the structure is still fresh.'}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Try again
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Back to course
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage
