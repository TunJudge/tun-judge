import axios, { AxiosRequestConfig, Method } from 'axios';

import { rootStore } from '../stores';

export class HttpClient {
  get<T>(path: string, options?: AxiosRequestConfig): Promise<T> {
    return request<T>(path, 'GET', options);
  }

  post<T>(path: string, body?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return request<T>(path, 'POST', { data: body, ...options });
  }

  put<T>(path: string, body?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return request<T>(path, 'PUT', { data: body, ...options });
  }

  patch<T>(path: string, options?: AxiosRequestConfig): Promise<T> {
    return request<T>(path, 'PATCH', options);
  }

  delete<T>(path: string, options?: AxiosRequestConfig): Promise<T> {
    return request<T>(path, 'DELETE', options);
  }
}

export async function request<T>(
  path: string,
  method: Method = 'GET',
  options?: AxiosRequestConfig
): Promise<T> {
  try {
    return (
      await axios.request<T>({
        url: `/${path}`,
        method: method,
        withCredentials: true,
        ...options,
      })
    ).data;
  } catch (error: any) {
    error?.response?.status === 401 && (await rootStore?.logout());
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      rootStore?.toastsStore.error(message);
    }
    throw error;
  }
}

const http = new HttpClient();

export default http;
