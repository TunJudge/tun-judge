import { Storage } from '@google-cloud/storage';

import { config } from '../config';
import { LogParam, logger } from '../logger';
import { IFilesStorage } from './types';

export class GoogleStorage implements IFilesStorage {
  private readonly storage: Storage;

  constructor() {
    this.storage = new Storage({ projectId: config.filesStorage.google.googleProjectId });
  }

  getFile(
    @LogParam('fileName') fileName: string,
    @LogParam('options') options?: { start?: number; end?: number },
  ) {
    return this.storage
      .bucket(config.filesStorage.google.bucketName)
      .file(fileName)
      .createReadStream(options);
  }

  exists(@LogParam('fileName') fileName: string): Promise<boolean> {
    return this.storage
      .bucket(config.filesStorage.google.bucketName)
      .file(fileName)
      .exists()
      .then((result) => result[0]);
  }

  upload(@LogParam('fileName') fileName: string) {
    return this.storage
      .bucket(config.filesStorage.google.bucketName)
      .file(fileName)
      .createWriteStream()
      .on('error', (error) => logger.error(error, 'GoogleStorage'));
  }

  async createDirectory(@LogParam('directoryName') directoryName: string) {
    const writeStream = this.storage
      .bucket(config.filesStorage.google.bucketName)
      .file(`${directoryName}/`)
      .createWriteStream();

    writeStream.write('');
    writeStream.emit('finish');
  }

  async move(@LogParam('oldPath') oldPath: string, @LogParam('newPath') newPath: string) {
    await this.storage.bucket(config.filesStorage.google.bucketName).file(oldPath).move(newPath);
  }

  async delete(@LogParam('fileName') fileName: string): Promise<void> {
    await this.storage.bucket(config.filesStorage.google.bucketName).file(fileName).delete();
  }
}
