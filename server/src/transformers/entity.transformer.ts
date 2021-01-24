import * as JSZip from 'jszip';

export interface EntityTransformer<T> {
  entityName: string;

  fromZip(zip: JSZip, basePath?: string): Promise<T>;

  fromZipToMany(zip: JSZip, basePath?: string): Promise<T[]>;

  toZip(entity: T, zip: JSZip): Promise<void>;

  manyToZip(entities: T[], zip: JSZip): Promise<void>;
}
