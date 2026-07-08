import { ssrStorage } from './ssr-storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage';

function getToken(): string | null {
  const t = ssrStorage.getItem('token');
  console.log('[API] getToken()', t ? t.slice(0, 20) + '...' : null);
  return t;
}

function clearAuth(): void {
  console.log('[API] clearAuth() — removing token & user from localStorage');
  ssrStorage.removeItem('token');
  ssrStorage.removeItem('user');
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export { ApiError, STORAGE_URL };

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
  console.log('[API] REQUEST', options.method || 'GET', url, {
    hasAuthHeader: !!headers['Authorization'],
  });

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log('[API] RESPONSE', response.status, endpoint);

  if (response.status === 401) {
    console.log('[API] 401 — clearing auth');
    clearAuth();
    throw new ApiError('Unauthorized', 401);
  }

  const json = await response.json();

  if (!response.ok) {
    console.log('[API] ERROR', response.status, json);
    if (response.status === 422 && json.errors) {
      throw new ApiError(json.message || 'Validation failed', 422, json.errors);
    }
    throw new ApiError(
      json.message || `Request failed with status ${response.status}`,
      response.status,
      json.errors,
    );
  }

  let data = (json && typeof json === 'object' && 'data' in json) ? json.data : json;
  if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
    data = data.data;
  }
  console.log('[API] SUCCESS', endpoint, typeof data === 'object' ? 'object' : data);
  return data as T;
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
