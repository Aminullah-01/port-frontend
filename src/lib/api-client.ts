import { ssrStorage } from './ssr-storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

function getToken(): string | null {
  return ssrStorage.getItem('token');
}

function clearAuth(): void {
  ssrStorage.removeItem('token');
  ssrStorage.removeItem('user');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  } else {
    headers['Accept'] = 'application/json';
  }

  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuth();
    throw new ApiError('Unauthorized', 401);
  }

  const json = await response.json();

  if (!response.ok) {
    if (response.status === 422 && json.errors) {
      throw new ApiError(json.message || 'Validation failed', 422, json.errors);
    }
    throw new ApiError(
      json.message || `Request failed with status ${response.status}`,
      response.status,
      json.errors,
    );
  }

  return (json && typeof json === 'object' && 'data' in json) ? json.data as T : json as T;
}

export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export function resourceUrl(base: string, ...parts: (string | number)[]): string {
  return [base, ...parts].join('/');
}
