import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import * as JSZip from 'jszip';
import { Not } from 'typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { Executable } from '../entities';
import { ExecutableTransformer } from '../transformers';

@Controller('executables')
@UseGuards(AuthenticatedGuard)
export class ExecutablesController {
  constructor(
    @InjectRepository(Executable)
    private readonly executablesRepository: ExtendedRepository<Executable>,
    private readonly executableTransformer: ExecutableTransformer,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Executable[]> {
    return this.executablesRepository.find({
      order: { id: 'ASC' },
      relations: ['file', 'file.content', 'buildScript', 'buildScript.content'],
    });
  }

  @Post()
  @Roles('admin')
  async create(@Body() executable: Executable): Promise<Executable> {
    if (executable.default) {
      await this.executablesRepository.update(
        { type: executable.type, default: true },
        { default: false },
      );
    }
    return this.executablesRepository.save(executable);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() executable: Executable,
  ): Promise<Executable> {
    const oldExecutable = await this.executablesRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    if (executable.default) {
      await this.executablesRepository.update(
        { id: Not(executable.id), type: executable.type, default: true },
        { default: false },
      );
    }
    return this.executablesRepository.save({ ...oldExecutable, ...executable });
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<void> {
    await this.executablesRepository.delete(id);
  }

  @Get(':id/zip')
  @Roles('admin')
  async getZip(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<void> {
    const executable = await this.executablesRepository.findOneOrThrow(
      {
        where: { id },
        relations: [
          'file',
          'file.content',
          'buildScript',
          'buildScript.content',
        ],
      },
      new NotFoundException(),
    );
    const zip = new JSZip();
    await this.executableTransformer.toZip(executable, zip);
    response.attachment('executable.zip');
    zip.generateNodeStream().pipe(response);
  }

  @Post('unzip')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async saveFromZip(@UploadedFile() file): Promise<void> {
    const executable = await this.executableTransformer.fromZip(
      await JSZip.loadAsync(file.buffer),
    );
    await this.executablesRepository.save(executable);
  }
}
