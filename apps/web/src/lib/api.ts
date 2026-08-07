const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers = new Headers(options.headers || {});
  if (!options.body || typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
}
