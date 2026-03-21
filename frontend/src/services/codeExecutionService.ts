const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/api\/?$/, '');

export interface CodeExecutionRequest {
  code: string;
  language: SupportedLanguage;
  expectedOutput?: string;
  testCases?: string;
  runTests: boolean;
}

export interface CodeExecutionResponse {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs: number;
  exitCode: number;
  language: string;
  timestamp: string;
  securityWarnings?: SecurityWarning[];
}

export interface EvaluationResponse {
  execution: CodeExecutionResponse;
  correct: boolean;
  feedback: string;
  score: number;
  suggestions: string[];
  hints: string[];
}

export interface LanguageInfo {
  id: string;
  name: string;
  requiresDocker: boolean;
  available: boolean;
}

export interface SecurityWarning {
  type: string;
  message: string;
  code: string;
}

export type SupportedLanguage = 'JAVASCRIPT' | 'PYTHON' | 'JAVA' | 'HTML' | 'CSS';

class CodeExecutionService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async execute(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/code/run`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          code: request.code,
          language: request.language,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Code execution error:', error);
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
        executionTimeMs: 0,
        exitCode: -1,
        language: request.language,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async evaluate(request: CodeExecutionRequest & { question: string }): Promise<EvaluationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/code/run`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          code: request.code,
          language: request.language,
          question: request.question,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Code evaluation error:', error);
      return {
        execution: {
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Evaluation failed',
          executionTimeMs: 0,
          exitCode: -1,
          language: request.language,
          timestamp: new Date().toISOString(),
        },
        correct: false,
        feedback: 'An error occurred during evaluation.',
        score: 0,
        suggestions: [],
        hints: [],
      };
    }
  }

  async getLanguages(): Promise<LanguageInfo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/code/languages`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch languages:', error);
      return [];
    }
  }

  async healthCheck(): Promise<{ status: string; supportedLanguages: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/code/status`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', supportedLanguages: 0 };
    }
  }
}

export const codeExecutionService = new CodeExecutionService();
export default codeExecutionService;
