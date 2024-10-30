import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

import http from '../http/http.client';

const pipelineAsync = promisify(pipeline);

export async function downloadFile(fileName: string, filePath: string) {
  const stream = await http.stream(`files/${encodeURIComponent(fileName)}`);
  const writer = createWriteStream(filePath);

  return pipelineAsync(stream, writer);
}
