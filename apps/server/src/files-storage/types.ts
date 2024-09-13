import { Readable, Writable } from 'stream';

export interface IFilesStorage {
  getFile(fileName: string, options?: { start?: number; end?: number }): Readable;

  exists(fileName: string): Promise<boolean>;

  upload(fileName: string): Writable;

  createDirectory(directoryName: string): Promise<void>;

  move(oldPath: string, newPath: string): Promise<void>;

  delete(fileName: string): Promise<void>;
}
