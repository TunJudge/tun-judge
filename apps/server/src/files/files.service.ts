import { Injectable, NotFoundException } from '@nestjs/common';

import { File, User } from '@prisma/client';

import { PrismaService } from '../db';
import { LogClass, LogParam } from '../logger';
import { logPrismaOperation, throwError } from '../utils';

@LogClass
@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  getAll(user?: User): Promise<File[]> {
    const prisma = this.prisma.getEnhanced(user);
    return logPrismaOperation(prisma, 'file', 'findMany')({});
  }

  async exists(@LogParam('name') name: string, user?: User): Promise<boolean> {
    const allFiles = await this.getAll(user);

    return allFiles.some((file) => file.name === name);
  }

  async getFileByName(@LogParam('name') name: string, user?: User): Promise<File> {
    const allFiles = await this.getAll(user);

    return allFiles.find((file) => file.name === name) ?? throwError(new NotFoundException());
  }

  async getFileByNamePrefix(
    @LogParam('namePrefix') namePrefix: string,
    user?: User,
  ): Promise<File[]> {
    const allFiles = await this.getAll(user);

    return allFiles.filter((file) => file.name.startsWith(namePrefix));
  }

  async update(@LogParam('name') name: string, file: Partial<File>, user?: User): Promise<void> {
    const prisma = this.prisma.getEnhanced(user);
    await logPrismaOperation(prisma, 'file', 'update')({ data: file, where: { name } });
  }

  async saveFile(file: File, user?: User) {
    const prisma = this.prisma.getEnhanced(user);

    file.createdAt ??= new Date();
    file.createdById ??= user?.id ?? null;

    return logPrismaOperation(prisma, 'file', 'create')({ data: file });
  }

  async delete(@LogParam('name') name: string, user?: User) {
    const prisma = this.prisma.getEnhanced(user);
    await logPrismaOperation(prisma, 'file', 'delete')({ where: { name } });
  }
}
