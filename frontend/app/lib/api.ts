/**
 * API Service Client for Bookstore Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'bookstore_token';

export interface Author {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  published_year: number;
  category?: Category;
  authors?: Author[];
}

export interface CreateBookPayload {
  title: string;
  isbn: string;
  published_year: number;
  category_id: number;
  author_ids: number[];
}

// Token Storage Helpers
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeStoredToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Base Fetcher with Authorization Header & 401 Interception
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  onUnauthorized?: () => void
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeStoredToken();
    if (onUnauthorized) {
      onUnauthorized();
    }
    throw new Error('Unauthorized or session expired');
  }

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
    try {
      const errBody = await response.json();
      if (errBody && errBody.message) {
        errorMessage = Array.isArray(errBody.message)
          ? errBody.message.join(', ')
          : errBody.message;
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Public & Admin API Methods

export async function loginAdmin(username: string, password: string): Promise<string> {
  const res = await apiFetch<{ access_token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (res.access_token) {
    setStoredToken(res.access_token);
    return res.access_token;
  }
  throw new Error('No access_token returned');
}

export async function fetchBooks(
  params?: { categoryId?: number; authorId?: number },
  onUnauthorized?: () => void
): Promise<Book[]> {
  const query = new URLSearchParams();
  if (params?.categoryId) query.append('categoryId', params.categoryId.toString());
  if (params?.authorId) query.append('authorId', params.authorId.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return apiFetch<Book[]>(`/books${queryString}`, { method: 'GET' }, onUnauthorized);
}

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories', { method: 'GET' });
}

export async function fetchAuthors(): Promise<Author[]> {
  return apiFetch<Author[]>('/authors', { method: 'GET' });
}

export async function createBook(
  payload: CreateBookPayload,
  onUnauthorized?: () => void
): Promise<Book> {
  return apiFetch<Book>(
    '/books',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    onUnauthorized
  );
}

export async function deleteBook(
  id: number,
  onUnauthorized?: () => void
): Promise<void> {
  await apiFetch<void>(
    `/books/${id}`,
    {
      method: 'DELETE',
    },
    onUnauthorized
  );
}
