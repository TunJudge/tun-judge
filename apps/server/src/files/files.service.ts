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

  async exists(@LogParam('name') name: string): Promise<boolean> {
    const allFiles = await this.getAll();

    return allFiles.some((file) => file.name === name);
  }

  async getFileByName(@LogParam('name') name: string): Promise<File> {
    const allFiles = await this.getAll();

    return allFiles.find((file) => file.name === name) ?? throwError(new NotFoundException());
  }

  async getFileByNamePrefix(@LogParam('namePrefix') namePrefix: string): Promise<File[]> {
    return (await this.getAll()).filter((file) => file.name.startsWith(namePrefix));
  }

  async update(@LogParam('name') name: string, file: Partial<File>): Promise<void> {
    await logPrismaOperation(this.prisma, 'file', 'update')({ data: file, where: { name } });
  }

  async saveFile(file: File) {
    file.createdAt ??= new Date();
    file.createdById ??= this.cls.get('auth')?.id;

    return logPrismaOperation(this.prisma, 'file', 'create')({ data: file });
  }

  async delete(@LogParam('name') name: string) {
    await logPrismaOperation(this.prisma, 'file', 'delete')({ where: { name } });
  }
}
