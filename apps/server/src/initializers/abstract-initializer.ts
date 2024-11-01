import MD5 from 'crypto-js/md5';
import { createReadStream, promises as fs } from 'fs';
import mime from 'mime-types';
import { basename, dirname, extname, join } from 'path';
import { Writable } from 'stream';

import { File, FileKind, PrismaClient } from '@prisma/client';

import { logger } from '../logger';
import { LogClass } from '../logger';

@LogClass
export abstract class AbstractInitializer<Options = object> {
  private readonly baseDir = join(__dirname, 'assets/init-data');

  static uploadFile: (fileName: string) => Writable;
  static createDirectory: (directoryName: string) => Promise<void>;

  async run(name: string, prisma: PrismaClient, options?: Options): Promise<void> {
    if (await prisma.initialDataEntity.count({ where: { name } })) return;

    try {
      await this._run(prisma, options);
    } catch (error: unknown) {
      logger.error(
        {
          message: `Initializer failed to run for step: ${name} (${(error as Error).message})`,
          options,
        },
        (error as Error).stack,
        this.constructor.name,
      );

      throw error;
    }

    await prisma.initialDataEntity.create({ data: { name, date: new Date() } });
  }

  abstract _run(prisma: PrismaClient, options?: Options): Promise<void>;

  protected async readFileAsBase64(filePath: string): Promise<{ content: string; size: number }> {
    const content = (await fs.readFile(join(this.baseDir, filePath))).toString('base64');
    const size = (await fs.stat(join(this.baseDir, filePath))).size;
    return { content, size };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async parseMetadataFile(filePath: string): Promise<any[]> {
    return JSON.parse((await fs.readFile(join(this.baseDir, filePath))).toString());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async parseDirectory(directoryName: string): Promise<any[]> {
    return Promise.all(
      (await fs.readdir(join(this.baseDir, directoryName), { withFileTypes: true }))
        .filter((file) => file.isDirectory())
        .map(async (dir) => this.parseMetadataFile(join(directoryName, dir.name, 'metadata.json'))),
    );
  }

  protected async createFileEntity(
    prisma: PrismaClient,
    filePath: string,
    parentDirectory: string[],
  ): Promise<File> {
    const fileName = [...parentDirectory, basename(filePath)].join('/');
    const { content: payload, size } = await this.readFileAsBase64(filePath);

    if (await prisma.file.count({ where: { name: fileName } })) {
      return prisma.file.findFirst({ where: { name: fileName } });
    }

    let currentDirectory = '';
    for (const directory of parentDirectory) {
      currentDirectory = join(currentDirectory, directory);
      if (!(await prisma.file.count({ where: { name: currentDirectory } }))) {
        await AbstractInitializer.createDirectory(currentDirectory);
        await prisma.file.create({
          data: {
            name: currentDirectory,
            type: 'directory',
            size: 0,
            md5Sum: '',
            kind: FileKind.DIRECTORY,
            parentDirectoryName:
              dirname(currentDirectory) === '.' ? undefined : dirname(currentDirectory),
          },
        });
      }
    }

    await new Promise((resolve, reject) =>
      createReadStream(join(this.baseDir, filePath))
        .pipe(AbstractInitializer.uploadFile(fileName))
        .on('finish', resolve)
        .on('error', reject),
    );

    return prisma.file.create({
      data: {
        name: fileName,
        type: mime.lookup(extname(fileName)) || 'text/plain',
        size: size,
        md5Sum: MD5(payload).toString(),
        parentDirectoryName: dirname(fileName) === '.' ? undefined : dirname(fileName),
      },
    });
  }
}
