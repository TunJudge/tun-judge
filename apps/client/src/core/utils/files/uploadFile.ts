import axios, { AxiosError, AxiosResponse } from 'axios';

import { request } from '../request';
import { createDirectory } from './createDirectory';
import { FileInput, FileUpdateStatus } from './types';

export async function uploadFile(
  file: File,
  metadata: FileInput,
  statusReporter?: (status: FileUpdateStatus) => void,
): Promise<FileInput> {
  const chunkSize = 5 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / chunkSize);
  let lastResult: AxiosResponse<FileInput> | undefined = undefined;

  const directoryName = metadata.name.split('/').slice(0, -1);
  let nameSoFar = directoryName[0];
  try {
    while (directoryName.length) {
      directoryName.shift();

      if (!(await request<boolean>(`api/files/exists/${encodeURIComponent(nameSoFar)}`))) {
        await createDirectory(nameSoFar);
      }

      nameSoFar += `/${directoryName[0]}`;
    }
  } catch (error: unknown) {
    statusReporter?.({
      file,
      metadata,
      status: 'failed',
      error:
        error instanceof AxiosError
          ? error.response?.data
          : error instanceof Error
            ? error.message
            : String(error),
    });
    throw error;
  }

  try {
    for (let start = 0, chunkIndex = 0; start < file.size; chunkIndex++, start += chunkSize) {
      const fileChunk = file.slice(start, Math.min(start + chunkSize, file.size));
      const formData = new FormData();
      formData.set('file', fileChunk);
      formData.set('fileName', metadata.name);
      formData.set('metadata', JSON.stringify(metadata));
      formData.set('chunkNumber', `${chunkIndex}`);
      formData.set('totalChunks', `${totalChunks}`);

      lastResult = await axios.post<FileInput>('api/files', formData, {
        onUploadProgress: ({ loaded, total = 1 }) => {
          const progressSoFar = (Math.min(chunkSize, file.size) * chunkIndex * 100) / file.size;
          const chunkProgress = (loaded * 100) / total;
          const chunkFraction = fileChunk.size / file.size;

          statusReporter?.({
            file,
            metadata,
            status: 'uploading',
            progress: Math.floor(progressSoFar + chunkProgress * chunkFraction),
          });
        },
      });
    }
  } catch (error: unknown) {
    statusReporter?.({
      file,
      metadata,
      status: 'failed',
      error:
        error instanceof AxiosError
          ? error.response?.data
          : error instanceof Error
            ? error.message
            : String(error),
    });
    throw error;
  }

  if (!lastResult) {
    statusReporter?.({ file, metadata, status: 'failed', error: 'No response' });
    throw new Error('No response');
  }

  statusReporter?.({ file, metadata: lastResult.data, status: 'done' });
  return lastResult.data;
}
