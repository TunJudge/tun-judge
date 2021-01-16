import axios, { AxiosRequestConfig, Method } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import config from '../config';

axiosCookieJarSupport(axios);

export class HttpClient {
  private url: string = config.url;
  private cookieJar: CookieJar = new CookieJar();

  get<T>(path: string, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(path, 'GET', options);
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(path, 'POST', { data: body, ...options });
  }

  put<T>(
    path: string,
    body?: unknown,
    options?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(path, 'PUT', { data: body, ...options });
  }

  patch<T>(path: string, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(path, 'PATCH', options);
  }

  async request<T>(
    path: string,
    method: Method = 'GET',
    options?: AxiosRequestConfig,
  ): Promise<T> {
    return (
      await axios.request<T>({
        url: `${this.url}/${path}`,
        method: method,
        withCredentials: true,
        jar: this.cookieJar,
        ...options,
      })
    ).data;
  }
}

const http = new HttpClient();

export default http;
