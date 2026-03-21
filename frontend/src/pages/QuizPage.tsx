import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizzesApi } from '@/services/api'
import { useAuthStore } from '@/store'
import { useQuizRobot } from '@/components/robot'
import type { Quiz, Question } from '@/types'

const QuizPage = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { onQuizStart, onCorrectAnswer, onWrongAnswer, onQuizComplete } = useQuizRobot()
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return
      try {
        const [quizRes, questionsRes] = await Promise.all([
          quizzesApi.getById(parseInt(quizId)),
          quizzesApi.getQuestions(parseInt(quizId)),
        ])
        setQuiz(quizRes.data)
        setQuestions(questionsRes.data)
        
        // Robot welcomes to the quiz
        onQuizStart()
        
        if (quizRes.data.timeLimitMinutes) {
          setTimeLeft(quizRes.data.timeLimitMinutes * 60)
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId, onQuizStart])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  const handleAnswerSelect = useCallback((answerId: number) => {
    if (submitted) return
    
    const currentQ = questions[currentQuestion]
    const correctAnswer = currentQ.answers.find((a) => a.isCorrect)
    const isCorrect = correctAnswer?.id === answerId
    
    if (isCorrect) {
      onCorrectAnswer()
    } else {
      onWrongAnswer(correctAnswer?.answerText)
    }
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: answerId,
    })
  }, [questions, currentQuestion, submitted, selectedAnswers, onCorrectAnswer, onWrongAnswer])

  const handleSubmit = useCallback(async () => {
    let correctCount = 0
    
    questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question.id]
      const correctAnswer = question.answers.find((a) => a.isCorrect)
      if (correctAnswer && selectedAnswer === correctAnswer.id) {
        correctCount++
      }
    })
    
    const finalScore = Math.round((correctCount / questions.length) * 100)
    setScore(finalScore)
    setSubmitted(true)
    
    onQuizComplete({
      score: finalScore,
      passed: finalScore >= (quiz?.passingScore || 70),
      totalQuestions: questions.length,
      correctAnswers: correctCount,
    })
    
    if (isAuthenticated) {
      try {
        await quizzesApi.submit(parseInt(quizId!), selectedAnswers)
      } catch (error) {
        console.error('Failed to submit quiz:', error)
      }
    }
  }, [questions, selectedAnswers, quiz, quizId, isAuthenticated, onQuizComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return <div>Quiz not found</div>
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const passed = score >= quiz.passingScore

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
          {timeLeft !== null && (
            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      {!submitted ? (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {question?.questionText}
          </h2>
          
          <div className="space-y-3">
            {question?.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(answer.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswers[question.id] === answer.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-gray-900">{answer.answerText}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="btn btn-secondary disabled:opacity-50"
            >
              ← Previous
            </button>
            
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="btn btn-primary"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results */
        <div className="card p-6 text-center">
          <div className="text-5xl mb-4">
            {passed ? '🎉' : '📚'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          <p className="text-gray-600 mb-4">
            You scored <span className="font-bold text-primary-600">{score}%</span>
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {questions.filter((q) => {
                  const selectedAnswer = selectedAnswers[q.id]
                  const correctAnswer = q.answers.find((a) => a.isCorrect)
                  return correctAnswer && selectedAnswer === correctAnswer.id
                }).length}
              </p>
              <p className="text-sm text-gray-500">Correct</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {questions.length - questions.filter((q) => {
                  const selectedAnswer = selectedAnswers[q.id]
                  const correctAnswer = q.answers.find((a) => a.isCorrect)
                  return correctAnswer && selectedAnswer === correctAnswer.id
                }).length}
              </p>
              <p className="text-sm text-gray-500">Incorrect</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-primary"
            >
              Back to Course
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizPage
