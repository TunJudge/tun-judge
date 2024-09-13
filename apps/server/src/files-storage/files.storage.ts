import { Injectable } from '@nestjs/common';

import { config } from '../config';
import { LogClass, LogParam } from '../logger';
import { GoogleStorage } from './google.storage';
import { SystemStorage } from './system.storage';
import { IFilesStorage } from './types';

@LogClass
@Injectable()
export class FilesStorage implements IFilesStorage {
  private readonly implementation: IFilesStorage;

  constructor() {
    this.implementation = config.filesStorage.google.enabled
      ? new GoogleStorage()
      : new SystemStorage();
  }

  getFile(
    @LogParam('fileName') fileName: string,
    @LogParam('options') options?: { start?: number; end?: number },
  ) {
    return this.implementation.getFile(fileName, options);
  }

  exists(@LogParam('fileName') fileName: string): Promise<boolean> {
    return this.implementation.exists(fileName);
  }

  upload(@LogParam('fileName') fileName: string) {
    return this.implementation.upload(fileName);
  }

  createDirectory(@LogParam('directoryName') directoryName: string) {
    return this.implementation.createDirectory(directoryName);
  }

  move(@LogParam('oldPath') oldPath: string, @LogParam('newPath') newPath: string) {
    return this.implementation.move(oldPath, newPath);
  }

  delete(@LogParam('fileName') fileName: string): Promise<void> {
    return this.implementation.delete(fileName);
  }
}
