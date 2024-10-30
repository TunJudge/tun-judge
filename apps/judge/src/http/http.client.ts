import makeFetchCookie from 'fetch-cookie';
import { ReadableStream } from 'stream/web';
import { CookieJar } from 'tough-cookie';

import config from '../config';

export const cookieStore = new CookieJar();
export const fetchCookie = makeFetchCookie(fetch, cookieStore);

export class HttpClient {
  url = config.url ?? '';

  get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, 'GET', options);
  }

  post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, 'POST', { body: JSON.stringify(body), ...options });
  }

  put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, 'PUT', { body: JSON.stringify(body), ...options });
  }

  stream(path: string, options?: RequestInit): Promise<ReadableStream<Uint8Array>> {
    return this.request<ReadableStream<Uint8Array>>(path, 'GET', options, true);
  }

  async request<T>(
    path: string,
    method = 'GET',
    options?: RequestInit,
    stream?: boolean,
  ): Promise<T> {
    const response = await fetchCookie(`${this.url}/${path}`, {
      method: method,
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw await response.json();
    }

    if (stream) return response.body as T;

    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      return text as unknown as T;
    }
  }
}

const http = new HttpClient();

export default http;
