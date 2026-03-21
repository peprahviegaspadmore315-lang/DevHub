import { apiRequest, getApiUrl } from './api-client';

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
  async evaluate(request: AnswerEvaluationRequest): Promise<AnswerEvaluationResponse> {
    try {
      return await apiRequest<AnswerEvaluationResponse>(
        getApiUrl('/api/ai/evaluate'),
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
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
      return await apiRequest(getApiUrl('/api/ai/status'));
    } catch (error) {
      console.error('Status check failed:', error);
      return { enabled: false, message: 'Service unavailable' };
    }
  }
}

export const evaluationService = new EvaluationService();
export default evaluationService;
