import { request } from '../request';

export function createDirectory(directoryName: string) {
  return request<void>(`api/files/directory/${encodeURIComponent(directoryName)}`, 'POST');
}
