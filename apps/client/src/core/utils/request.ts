export async function request<T>(path: string, method = 'GET', options?: RequestInit): Promise<T> {
  const response = await fetch(`/${path}`, {
    method: method,
    credentials: 'include',
    headers: {
      ...(!(options?.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw await response.json();
  }

  const result = await response.text();
  try {
    return JSON.parse(result) as T;
  } catch {
    return result as T;
  }
}
