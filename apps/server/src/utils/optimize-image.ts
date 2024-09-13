import { createHash } from 'crypto';
import { createWriteStream, promises as fs } from 'fs';
import { resolve } from 'path';
import sharp from 'sharp';
import { Readable } from 'stream';

import { File } from '@prisma/client';

const imagesCachePath = resolve(__dirname, 'cache/images');
fs.mkdir(imagesCachePath, { recursive: true });

function getCashedFilePath(file: File, height?: number, width?: number) {
  const hash = createHash('sha256');
  hash.update(file.name);
  hash.update(file.md5Sum);
  hash.update(file.size.toString());
  hash.update(height?.toString() ?? '0');
  hash.update(width?.toString() ?? '0');
  return resolve(imagesCachePath, hash.digest('hex') + '.webp');
}

export async function optimizeImage(
  file: File,
  fileStream: Readable,
  height?: number,
  width?: number,
): Promise<string> {
  const cashedFilePath = getCashedFilePath(file, height, width);
  const exists = await fs
    .stat(cashedFilePath)
    .then((s) => s.isFile())
    .catch(() => false);

  if (!exists) {
    const sharpInstance = sharp();

    if (height || width) {
      sharpInstance.resize({ height, width, withoutEnlargement: true });
    }
    sharpInstance.webp();

    const imageManipulationStream = fileStream.pipe(sharpInstance);

    await new Promise<void>((resolve, reject) => {
      imageManipulationStream.pipe(createWriteStream(cashedFilePath));
      imageManipulationStream.on('end', () => {
        resolve();
        fileStream.destroy();
      });
      imageManipulationStream.on('error', async (error) => {
        reject(error);
        fileStream.destroy();
        await fs.rm(cashedFilePath);
      });
    }).then();
  }

  return cashedFilePath;
}
