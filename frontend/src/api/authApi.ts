import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

async function parseError(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json() as { message?: string };
    return body.message || fallback;
  } catch {
    return fallback;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(await parseError(response, 'Не вдалося виконати запит.'));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function register(data: RegisterRequest): Promise<AuthUser> {
  return request<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function login(data: LoginRequest): Promise<AuthUser> {
  return request<AuthUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function logout(): Promise<void> {
  return request<void>('/auth/logout', { method: 'POST' });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: 'include'
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseError(response, 'Не вдалося перевірити авторизацію.'));
  }

  return response.json() as Promise<AuthUser>;
}

export async function uploadAvatar(
  file: File
): Promise<AuthUser> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(
    `${API_URL}/auth/avatar`,
    {
      method: 'PUT',
      credentials: 'include',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseError(
        response,
        'Не вдалося змінити аватарку.'
      )
    );
  }

  return response.json() as Promise<AuthUser>;
}
