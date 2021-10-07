import axios, { AxiosRequestConfig, Method } from 'axios';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import config from '../config';

export class HttpClient {
  url = config.url ?? '';
  cookieJar = new CookieJar();
  axiosInstance = axiosCookieJarSupport(axios.create({ jar: this.cookieJar }));

  get<T>(path: string, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(path, 'GET', options);
  }

  post<T>(path: string, body?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(path, 'POST', { data: body, ...options });
  }

  put<T>(path: string, body?: unknown, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(path, 'PUT', { data: body, ...options });
  }

  async request<T>(path: string, method: Method = 'GET', options?: AxiosRequestConfig): Promise<T> {
    return (
      await this.axiosInstance.request<T>({
        url: `${this.url}/${path}`,
        method: method,
        withCredentials: true,
        ...options,
      })
    ).data;
  }
}

const http = new HttpClient();

export default http;
