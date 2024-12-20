import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';
import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import multer from 'multer';
import MultiStream from 'multistream';
import { ClsService } from 'nestjs-cls';
import { join, parse } from 'path';

import { File, FileKind } from '@prisma/client';

import { PrismaService } from '../db';
import { FilesStorage } from '../files-storage';
import { AuthenticatedGuard } from '../guards';
import { LogClass, LogParam } from '../logger';
import { optimizeImage } from '../utils';
import { FilesService } from './files.service';

@LogClass
@Controller('files')
export class PublicFilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly filesStorage: FilesStorage,
  ) {}

  @Get(':name')
  async serveFiles(
    @Req() request: Request,
    @Res() response: Response,
    @LogParam('name') @Param('name') name: string,
    @LogParam('height') @Query('height') height?: string,
    @LogParam('width') @Query('width') width?: string,
  ) {
    const file = await this.filesService.getFileByName(name);

    const options: { start?: number; end?: number } = {};
    if (request.headers.range) {
      const range = request.headers.range;
      const CHUNK_SIZE = 10 ** 6;
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = Math.min(start + CHUNK_SIZE, file.size - 1);
      const chunksize = end - start + 1;
      options.start = start;
      options.end = end;

      response.setHeader('Content-Range', `bytes ${start}-${end}/${file.size}`);
      response.setHeader('Content-Length', chunksize);
      response.status(HttpStatus.PARTIAL_CONTENT);
    }

    const fileStream = this.filesStorage
      .getFile(name, options)
      .on('error', () => response.status(HttpStatus.NOT_FOUND).end());

    response.setHeader('Content-Type', file.type);

    if (file.type.startsWith('image/')) {
      const cashedImagePath = await optimizeImage(
        file,
        fileStream,
        height ? +height : undefined,
        width ? +width : undefined,
      );

      response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return createReadStream(cashedImagePath).pipe(response);
    }

    if (!request.headers.range) {
      response.setHeader('Content-Length', file.size);
    }

    if (file.type.match(/(audio|video)\/.*/)) {
      response.setHeader('Accept-Ranges', 'bytes');
      response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return fileStream.pipe(response);
  }

  @Get(':name/download')
  downloadFiles(@Res() response: Response, @LogParam('name') @Param('name') name: string) {
    return this.filesStorage
      .getFile(name)
      .on('error', () => response.status(HttpStatus.NOT_FOUND).end())
      .pipe(response);
  }
}

@LogClass
@Controller('api/files')
@UseGuards(AuthenticatedGuard)
export class FilesController {
  private readonly chunksCache: Record<string, string[]> = {};

  constructor(
    private readonly filesService: FilesService,
    private readonly filesStorage: FilesStorage,
    private readonly cls: ClsService,
    @Inject(ENHANCED_PRISMA) private readonly prisma: PrismaService,
  ) {}

  @Get()
  getAll(): Promise<File[]> {
    return this.filesService.getAll();
  }

  @Get('exists/:name')
  exists(@LogParam('name') @Param('name') name: string): Promise<boolean> {
    return this.filesService.exists(name);
  }

  @Post('directory/:name')
  async createDirectory(@LogParam('name') @Param('name') name: string): Promise<File | void> {
    let number = 1;
    let finalName = name;
    while (await this.filesStorage.exists(finalName)) {
      finalName = `${name} (${number++})`;
    }

    const parsedName = parse(finalName);

    if (parsedName.dir && !(await this.filesService.exists(parsedName.dir))) {
      throw new NotFoundException('Parent directory does not exists!');
    }

    await this.filesService.saveFile({
      name: finalName,
      type: 'directory',
      size: 0,
      md5Sum: '',
      kind: FileKind.DIRECTORY,
      createdAt: new Date(),
      createdById: this.cls.get('auth')?.id,
      parentDirectoryName: parsedName.dir || null,
    });

    await this.filesStorage.createDirectory(finalName);
  }

  @Post('move')
  async moveFile(
    @LogParam('oldPath') @Body('oldPath') oldPath: string,
    @LogParam('newPath') @Body('newPath') newPath: string,
  ): Promise<File | void> {
    if (!(await this.filesService.exists(oldPath))) {
      throw new NotFoundException('Old path does not exists!');
    }

    const parsedNewPath = parse(newPath);

    if (parsedNewPath.dir && !(await this.filesService.exists(parsedNewPath.dir))) {
      throw new NotFoundException('New path dir does not exists!');
    }

    const file = await this.filesService.getFileByName(oldPath);
    const allSubFiles = await this.filesService.getFileByNamePrefix(`${oldPath}/`);

    try {
      await this.filesService.update(file.name, {
        name: newPath,
        parentDirectoryName: parsedNewPath.dir || null,
      });
    } catch (e) {
      if (file.kind === FileKind.FILE) {
        throw e;
      }
    }

    try {
      await this.filesStorage.move(file.name, newPath);
    } catch (e) {
      if (file.kind === FileKind.FILE) {
        throw e;
      }
    }

    await Promise.all(
      allSubFiles.map((subFile) =>
        this.filesService.update(subFile.name, {
          name: subFile.name.replace(`${oldPath}/`, `${newPath}/`),
          parentDirectoryName: newPath || null,
        }),
      ),
    );

    if (file.kind === FileKind.DIRECTORY && (await this.filesService.exists(oldPath))) {
      await this.filesService.delete(oldPath);
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({ destination: '/tmp/multer-uploads' }),
    }),
  )
  async uploadFile(
    @Body('metadata') metadata: string,
    @LogParam('chunkNumber') @Body('chunkNumber', ParseIntPipe) chunkNumber: number,
    @LogParam('totalChunks') @Body('totalChunks', ParseIntPipe) totalChunks: number,
    @LogParam('replace') @Query('replace', ParseBoolPipe) replace: boolean,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<File | void> {
    const fileMetadata = JSON.parse(metadata);
    const originalName = fileMetadata.name;

    this.chunksCache[originalName] ??= [];
    this.chunksCache[originalName][chunkNumber] = file.path;

    if (chunkNumber < totalChunks - 1) return;

    const hash = createHash('md5');

    let finalName = fileMetadata.name;

    if (!replace) {
      let number = 1;
      while (await this.filesStorage.exists(finalName)) {
        const parsedPath = parse(fileMetadata.name);
        finalName = join(
          fileMetadata.parentDirectoryName ?? '',
          `${parsedPath.name}-${number++}${parsedPath.ext}`,
        );
      }
      fileMetadata.name = finalName;
    }

    await this.filesService.saveFile(fileMetadata, replace);

    await new Promise((resolve, reject) =>
      new MultiStream(this.chunksCache[originalName].map((path) => createReadStream(path)))
        .on('data', (chunk) => hash.update(chunk))
        .pipe(this.filesStorage.upload(fileMetadata.name))
        .on('finish', resolve)
        .on('error', reject),
    );

    for (const path of this.chunksCache[originalName]) {
      await unlink(path);
    }
    delete this.chunksCache[originalName];

    return this.prisma.file.update({
      where: { name: finalName },
      data: { md5Sum: hash.digest('hex') },
    });
  }

  @Delete(':name')
  async delete(@Param('name') name: string): Promise<void> {
    try {
      await this.filesService.delete(name);
    } catch {
      throw new BadRequestException('The file cannot be removed because it is already in use!');
    }

    try {
      await this.filesStorage.delete(name);
    } catch {
      // do nothing
    }
  }
}
