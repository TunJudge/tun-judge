import { MD5 } from 'crypto-js';
import { promises as fs } from 'fs';
import * as mime from 'mime';
import { basename, extname } from 'path';
import { EntityManager } from 'typeorm';

import { File } from '../../entities';

export abstract class AbstractInitializer {
  baseDir = `${process.cwd()}/init-data`;

  abstract run(entityManager: EntityManager): Promise<void>;

  protected async readFileAsBase64(filePath: string): Promise<{ content: string; size: number }> {
    const content = (await fs.readFile(`${this.baseDir}/${filePath}`)).toString('base64');
    const size = (await fs.stat(`${this.baseDir}/${filePath}`)).size;
    return { content, size };
  }

  protected async parseMetadataFile(filePath: string): Promise<any> {
    return JSON.parse((await fs.readFile(`${this.baseDir}/${filePath}`)).toString());
  }

  protected async parseFolder(folderName: string): Promise<any[]> {
    return Promise.all(
      (await fs.readdir(`${this.baseDir}/${folderName}`)).map(async (dir) =>
        this.parseMetadataFile(`${folderName}/${dir}/metadata.json`)
      )
    );
  }

  protected async createFileEntity(filePath: string, entityManager: EntityManager): Promise<File> {
    const { content: payload, size } = await this.readFileAsBase64(filePath);
    return entityManager.save(File, {
      name: basename(filePath),
      type: mime.getType(extname(filePath)) ?? 'text/plain',
      size: size,
      md5Sum: MD5(payload).toString(),
      content: { payload },
    });
  }
}
