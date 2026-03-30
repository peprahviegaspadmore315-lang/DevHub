import { useAuthStore } from '@/store';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/api\/?$/, '');
const reportedFallbackWarnings = new Set<string>();

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export function getHeaders(): HeadersInit {
  const token = useAuthStore.getState().accessToken;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export function isBackendConnectionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as {
    code?: string;
    message?: string;
  };

  const message = (candidate.message || '').toLowerCase();

  return (
    candidate.code === 'ERR_NETWORK' ||
    message.includes('network error') ||
    message.includes('failed to fetch') ||
    message.includes('err_connection_refused')
  );
}

export function reportBackendFallbackOnce(
  key: string,
  message: string,
  error?: unknown
): void {
  if (!import.meta.env.DEV || reportedFallbackWarnings.has(key)) {
    return;
  }

  reportedFallbackWarnings.add(key);

  if (isBackendConnectionError(error)) {
    console.warn(message);
    return;
  }

  console.warn(message, error);
}

export { API_BASE_URL };
