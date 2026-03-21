const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/api\/?$/, '');

export interface AnswerEvaluationRequest {
  question: string;
  studentAnswer: string;
  expectedAnswer?: string;
  context?: string;
  language?: string;
}

export interface AnswerEvaluationResponse {
  success: boolean;
  feedback: string;
  score: number;
  correct: boolean;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  error?: string;
  model?: string;
}

class EvaluationService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async evaluate(request: AnswerEvaluationRequest): Promise<AnswerEvaluationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/evaluate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Evaluation error:', error);
      return {
        success: false,
        feedback: '',
        score: 0,
        correct: false,
        error: error instanceof Error ? error.message : 'Evaluation failed',
      };
    }
  }

  async getStatus(): Promise<{ enabled: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/status`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Status check failed:', error);
      return { enabled: false, message: 'Service unavailable' };
    }
  }
}

export const evaluationService = new EvaluationService();
export default evaluationService;
