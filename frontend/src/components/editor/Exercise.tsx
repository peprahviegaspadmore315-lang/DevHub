import { useState, useCallback } from 'react'
import { evaluationService, type AnswerEvaluationResponse } from '@/services/evaluationService'
import './Exercise.css'

interface ExerciseProps {
  question: string
  context?: string
  language?: string
  placeholder?: string
  onComplete?: (result: AnswerEvaluationResponse) => void
}

export default function Exercise({
  question,
  context,
  language,
  placeholder = 'Type your answer here...',
  onComplete
}: ExerciseProps) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<AnswerEvaluationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (answer.trim().length < 10) {
      setError('Please provide a more detailed answer (at least 10 characters)')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await evaluationService.evaluate({
        question,
        studentAnswer: answer,
        context,
        language,
      })

      setResult(response)
      onComplete?.(response)

      // Dispatch robot events based on score
      const robot = (window as any).__robot
      if (robot) {
        robot.dispatch('EVALUATION_GOOD', { score: response.score, feedback: response.feedback })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation failed')
      const robot = (window as any).__robot
      if (robot) {
        robot.dispatch('EVALUATION_BAD', 'I had trouble checking your answer. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [answer, question, context, language, onComplete])

  const handleRetry = () => {
    setResult(null)
    setError(null)
    setAnswer('')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🎉'
    if (score >= 80) return '👏'
    if (score >= 60) return '👍'
    if (score >= 40) return '💪'
    return '📚'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding work!'
    if (score >= 80) return 'Great job!'
    if (score >= 70) return 'Good effort!'
    if (score >= 60) return 'Not bad!'
    if (score >= 40) return 'Keep practicing!'
    return 'You can do it!'
  }

  return (
    <div className="exercise">
      <div className="exercise-header">
        <span className="exercise-label">Exercise</span>
        <button
          className="exercise-hint-btn"
          onClick={() => setShowHint(!showHint)}
          type="button"
        >
          💡 {showHint ? 'Hide' : 'Show'} Hint
        </button>
      </div>

      {showHint && (
        <div className="exercise-hint">
          Think about the key concepts and try to explain them in your own words.
        </div>
      )}

      <div className="exercise-question">
        <h3>{question}</h3>
      </div>

      {!result ? (
        <>
          <div className="exercise-input">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={placeholder}
              rows={6}
              disabled={loading}
            />
            <div className="exercise-char-count">
              {answer.length} characters
            </div>
          </div>

          {error && (
            <div className="exercise-error">{error}</div>
          )}

          <div className="exercise-actions">
            <button
              onClick={handleSubmit}
              disabled={loading || answer.trim().length < 10}
              className="exercise-submit"
            >
              {loading ? (
                <>
                  <span className="exercise-spinner"></span>
                  Evaluating...
                </>
              ) : (
                <>
                  Submit Answer
                </>
              )}
            </button>
          </div>
        </>
      ) : result.success ? (
        <div className="exercise-result">
          <div 
            className="exercise-score-card"
            style={{ '--score-color': getScoreColor(result.score) } as React.CSSProperties}
          >
            <div className="exercise-score-header">
              <span className="exercise-score-emoji">{getScoreEmoji(result.score)}</span>
              <span className="exercise-score-message">{getScoreMessage(result.score)}</span>
            </div>
            
            <div className="exercise-score-bar">
              <div 
                className="exercise-score-fill"
                style={{ width: `${result.score}%` }}
              />
            </div>
            
            <div className="exercise-score-value">
              {result.score}/100
            </div>
          </div>

          <div className="exercise-feedback">
            <h4>Feedback</h4>
            <p>{result.feedback}</p>
          </div>

          {result.strengths && result.strengths.length > 0 && (
            <div className="exercise-strengths">
              <h4>✓ What you did well</h4>
              <ul>
                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div className="exercise-suggestions">
              <h4>💡 Suggestions for improvement</h4>
              <ul>
                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          <div className="exercise-result-actions">
            <button onClick={handleRetry} className="exercise-retry">
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="exercise-error-state">
          <p>Unable to evaluate your answer right now.</p>
          <p className="exercise-error-detail">{result.error}</p>
          <button onClick={handleRetry} className="exercise-retry">
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
