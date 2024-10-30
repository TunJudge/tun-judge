import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { ClsService } from 'nestjs-cls';

import { File } from '@prisma/client';

import { PrismaService } from '../db';
import { LogClass, LogParam } from '../logger';
import { logPrismaOperation, throwError } from '../utils';

@LogClass
@Injectable()
export class FilesService {
  constructor(
    @Inject(ENHANCED_PRISMA) private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  getAll(): Promise<File[]> {
    return logPrismaOperation(this.prisma, 'file', 'findMany')({});
  }

  exists(@LogParam('name') name: string): Promise<boolean> {
    return logPrismaOperation(
      this.prisma,
      'file',
      'count',
    )({ where: { name } }).then((count) => count > 0);
  }

  getFileByName(@LogParam('name') name: string): Promise<File> {
    return (
      logPrismaOperation(
        this.prisma,
        'file',
        'findFirst',
      )({
        where: { name },
      }) ?? throwError(new NotFoundException())
    );
  }

  getFileByNamePrefix(@LogParam('namePrefix') namePrefix: string): Promise<File[]> {
    return logPrismaOperation(
      this.prisma,
      'file',
      'findMany',
    )({
      where: { name: { startsWith: namePrefix } },
    });
  }

  async update(@LogParam('name') name: string, file: Partial<File>): Promise<void> {
    await logPrismaOperation(this.prisma, 'file', 'update')({ data: file, where: { name } });
  }

  async saveFile(file: File, @LogParam('replace') replace = false) {
    if (!replace) {
      file.createdAt ??= new Date();
      file.createdById ??= this.cls.get('auth')?.id;
    }

    return replace
      ? logPrismaOperation(
          this.prisma,
          'file',
          'update',
        )({ where: { name: file.name }, data: file })
      : logPrismaOperation(this.prisma, 'file', 'create')({ data: file });
  }

  async delete(@LogParam('name') name: string) {
    await logPrismaOperation(this.prisma, 'file', 'delete')({ where: { name } });
  }
}
