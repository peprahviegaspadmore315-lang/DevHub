const rawApiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_BASE_URL = rawApiBaseUrl.replace(/\/api\/?$/, '');

export interface ChatHistoryMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AIChatRequest {
  message: string;
  conversationHistory?: ChatHistoryMessage[];
  context?: string;
}

export interface AIChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  aiName?: string;
  timestamp?: string;
  model?: string;
}

export interface AIStatusResponse {
  enabled: boolean;
  message: string;
}

class AIService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Chat Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to AI service',
      };
    }
  }

  async getStatus(): Promise<AIStatusResponse> {
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
      console.error('AI Status Error:', error);
      return {
        enabled: false,
        message: 'AI service unavailable',
      };
    }
  }
}

export const aiService = new AIService();
export default aiService;
