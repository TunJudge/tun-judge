import axios, { AxiosRequestConfig, Method } from 'axios';
import { rootStore } from './stores/RootStore';

const hostname = process && process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isEmpty(s: any): boolean {
  return [null, undefined, ''].includes(s);
}

export async function request<T>(
  path: string,
  method: Method = 'GET',
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
    error?.response?.status === 401 && rootStore && rootStore.logout();
    throw error;
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (event) => {
      if (event.target?.readyState === FileReader.DONE) {
        resolve((event.target.result as string).split(';base64,').pop()!);
      }
    };
  });
}
