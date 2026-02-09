// src/lib/auth.ts
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

// Get token from cookie
export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get('token')?.value;
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

// Clear auth cookie
export async function clearAuthCookie() {
  (await cookies()).delete('token');
}

// Proxy an authenticated request to the Express backend
// Returns { data, status } so route handlers can forward both
export async function backendFetch(
  endpoint: string,
  init: RequestInit = {}
): Promise<{ data: any; status: number }> {
  const token = await getToken();

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Only set Content-Type for non-FormData bodies
  if (!(init.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...init,
    headers: {
      ...headers,
      ...(init.headers as Record<string, string> || {}),
    },
  });

  const data = await response.json();
  return { data, status: response.status };
}

// Proxy a public (no auth) request to the Express backend
export async function backendFetchPublic(
  endpoint: string,
  init: RequestInit = {}
): Promise<{ data: any; status: number }> {
  const headers: Record<string, string> = {};

  if (!(init.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...init,
    headers: {
      ...headers,
      ...(init.headers as Record<string, string> || {}),
    },
  });

  const data = await response.json();
  return { data, status: response.status };
}
