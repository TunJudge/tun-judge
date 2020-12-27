import axios, { AxiosRequestConfig, Method } from 'axios';
import { rootStore } from './stores/RootStore';

const hostname = process && process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

export async function request<T>(
  path: string,
  method: Method,
  options?: Omit<Omit<AxiosRequestConfig, 'url'>, 'method'>,
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
    const { pathname, search } = window.location;
    rootStore.returnUrl = `${pathname}${search}`;
    error?.response?.status === 401 && rootStore.logout();
    throw error;
  }
}
