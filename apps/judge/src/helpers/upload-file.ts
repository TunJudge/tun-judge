import axios from 'axios';

import { FileKind } from '@prisma/client';

import config from '../config';
import http, { cookieStore } from '../http/http.client';

export type FileEntity = {
  name: string;
  type: string;
  size: number;
  md5Sum: string;
  kind: FileKind;
  parentDirectoryName?: string;
};

export async function uploadFile(
  file: File,
  metadata: FileEntity,
  replace?: boolean,
): Promise<FileEntity> {
  const chunkSize = 5 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / chunkSize);
  let lastResult: FileEntity | undefined = undefined;

  const directoryName = metadata.name.split('/').slice(0, -1);
  let nameSoFar = directoryName[0];
  while (directoryName.length) {
    directoryName.shift();

    if (!(await http.get<boolean>(`api/files/exists/${encodeURIComponent(nameSoFar)}`))) {
      await createDirectory(nameSoFar);
    }

    nameSoFar += `/${directoryName[0]}`;
  }

  if (!file.size) {
    const formData = new FormData();
    formData.set('file', file);
    formData.set('metadata', JSON.stringify(metadata));
    formData.set('chunkNumber', `${0}`);
    formData.set('totalChunks', `${totalChunks}`);
    lastResult = (
      await axios.post<FileEntity>(
        `${config.url}/api/files?replace=${replace ?? false}`,
        formData,
        { headers: { Cookie: cookieStore.getCookieStringSync(config.url) } },
      )
    ).data;
  } else {
    for (let start = 0, chunkIndex = 0; start < file.size; chunkIndex++, start += chunkSize) {
      const fileChunk = file.slice(start, Math.min(start + chunkSize, file.size));
      const formData = new FormData();
      formData.set('file', fileChunk);
      formData.set('metadata', JSON.stringify(metadata));
      formData.set('chunkNumber', `${chunkIndex}`);
      formData.set('totalChunks', `${totalChunks}`);

      lastResult = (
        await axios.post<FileEntity>(
          `${config.url}/api/files?replace=${replace ?? false}`,
          formData,
          { headers: { Cookie: cookieStore.getCookieStringSync(config.url) } },
        )
      ).data;
    }
  }

  if (!lastResult) {
    throw new Error('No response');
  }

  return lastResult;
}

function createDirectory(directoryName: string) {
  return http.post<void>(`api/files/directory/${encodeURIComponent(directoryName)}`);
}
