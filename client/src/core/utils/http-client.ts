import axios, { AxiosRequestConfig, Method } from 'axios';
import { toast } from 'react-semantic-toasts';
import { rootStore } from '../stores/RootStore';

const hostname = process && process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

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
  options?: AxiosRequestConfig,
): Promise<T> {
  try {
    return (
      await axios.request<T>({
        url: `${hostname}/${path}`,
        method: method,
        withCredentials: true,
        ...options,
      })
    ).data;
  } catch (error) {
    error?.response?.status === 401 && rootStore && rootStore.logout();
    if (error?.response?.data) {
      const { message } = error?.response?.data;
      toast({
        title: 'Error',
        description: message,
        type: 'error',
        time: 3000,
        animation: 'bounce',
      });
    }
    throw error;
  }
}

const http = new HttpClient();

export default http;
