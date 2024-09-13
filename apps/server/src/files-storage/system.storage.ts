import * as fs from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

import { config } from '../config';
import { LogParam, logger } from '../logger';
import { IFilesStorage } from './types';

export class SystemStorage implements IFilesStorage {
  private readonly dir: string;

  constructor() {
    this.dir = resolve(
      config.filesStorage.system.directoryPath ??
        join(tmpdir(), `seo-projects-files-storage/${config.project}`),
    );
    fs.mkdirSync(this.dir, { recursive: true });
  }

  getFile(
    @LogParam('fileName') fileName: string,
    @LogParam('options') options?: { start?: number; end?: number },
  ) {
    return fs.createReadStream(join(this.dir, fileName), options);
  }

  async exists(@LogParam('fileName') fileName: string): Promise<boolean> {
    try {
      (await fs.promises.open(join(this.dir, fileName))).close();
      return true;
    } catch {
      return false;
    }
  }

  upload(@LogParam('fileName') fileName: string) {
    return fs
      .createWriteStream(join(this.dir, fileName))
      .on('error', (error) => logger.error(error, 'SystemStorage'));
  }

  async createDirectory(@LogParam('directoryName') directoryName: string) {
    await fs.promises.mkdir(join(this.dir, directoryName), { recursive: true });
  }

  async move(@LogParam('oldPath') oldPath: string, @LogParam('newPath') newPath: string) {
    await fs.promises.rename(join(this.dir, oldPath), join(this.dir, newPath));
  }

  async delete(@LogParam('fileName') fileName: string): Promise<void> {
    const fullPath = join(this.dir, fileName);
    const stats = await fs.promises.stat(fullPath);
    if (stats.isDirectory()) {
      await fs.promises.rmdir(fullPath);
    } else {
      await fs.promises.unlink(fullPath);
    }
  }
}
