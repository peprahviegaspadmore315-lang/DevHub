import { useState } from 'react'
import { evaluationService, type AnswerEvaluationRequest, type AnswerEvaluationResponse } from '@/services/evaluationService'
import './AnswerEvaluator.css'

interface AnswerEvaluatorProps {
  question: string
  context?: string
  language?: string
  onClose?: () => void
}

export default function AnswerEvaluator({ question, context, language, onClose }: AnswerEvaluatorProps) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<AnswerEvaluationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEvaluate = async () => {
    if (answer.trim().length < 10) {
      setError('Please provide a more detailed answer (at least 10 characters)')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const request: AnswerEvaluationRequest = {
        question,
        studentAnswer: answer,
        context,
        language,
      }

      const response = await evaluationService.evaluate(request)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation failed')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent!'
    if (score >= 60) return 'Good effort'
    if (score >= 40) return 'Needs work'
    return 'Keep learning'
  }

  return (
    <div className="evaluator">
      <div className="evaluator-header">
        <h3>AI Answer Evaluation</h3>
        {onClose && (
          <button onClick={onClose} className="evaluator-close">×</button>
        )}
      </div>

      <div className="evaluator-question">
        <strong>Question:</strong>
        <p>{question}</p>
      </div>

      <div className="evaluator-input">
        <label htmlFor="answer">Your Answer:</label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={5}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="evaluator-error">{error}</div>
      )}

      <button
        onClick={handleEvaluate}
        disabled={loading || answer.trim().length < 10}
        className="evaluator-submit"
      >
        {loading ? (
          <>
            <span className="evaluator-spinner"></span>
            Evaluating...
          </>
        ) : (
          'Evaluate My Answer'
        )}
      </button>

      {result && result.success && (
        <div className="evaluator-result">
          <div className="evaluator-score" style={{ '--score-color': getScoreColor(result.score) } as React.CSSProperties}>
            <div className="evaluator-score-circle">
              <span className="evaluator-score-value">{result.score}</span>
              <span className="evaluator-score-label">{getScoreLabel(result.score)}</span>
            </div>
          </div>

          <div className="evaluator-feedback">
            <strong>Feedback:</strong>
            <p>{result.feedback}</p>
          </div>

          {result.strengths && result.strengths.length > 0 && (
            <div className="evaluator-section evaluator-strengths">
              <strong>✓ Strengths:</strong>
              <ul>
                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {result.weaknesses && result.weaknesses.length > 0 && (
            <div className="evaluator-section evaluator-weaknesses">
              <strong>⚠ Areas to improve:</strong>
              <ul>
                {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div className="evaluator-section evaluator-suggestions">
              <strong>💡 Suggestions:</strong>
              <ul>
                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {result.model && (
            <div className="evaluator-model">
              Evaluated by: {result.model}
            </div>
          )}
        </div>
      )}

      {result && !result.success && (
        <div className="evaluator-error">
          {result.error || 'Evaluation failed. Please try again.'}
        </div>
      )}
    </div>
  )
}
