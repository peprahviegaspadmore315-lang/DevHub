import { apiRequest, getApiUrl } from './api-client';

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
  async execute(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    try {
      return await apiRequest<CodeExecutionResponse>(getApiUrl('/api/code/run'), {
        method: 'POST',
        body: JSON.stringify({
          code: request.code,
          language: request.language,
        }),
      });
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

  async getLanguages(): Promise<LanguageInfo[]> {
    try {
      return await apiRequest<LanguageInfo[]>(getApiUrl('/api/code/languages'));
    } catch (error) {
      console.error('Failed to fetch languages:', error);
      return [];
    }
  }

  async healthCheck(): Promise<{ status: string; supportedLanguages: number }> {
    try {
      return await apiRequest(getApiUrl('/api/code/status'));
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', supportedLanguages: 0 };
    }
  }
}

export const codeExecutionService = new CodeExecutionService();
export default codeExecutionService;
