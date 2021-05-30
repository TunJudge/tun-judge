import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { unzipEntities, zipEntities } from '../core/utils';
import { Executable } from '../entities';
import { ExecutablesService } from '../services';
import { ExecutableTransformer } from '../transformers';

@Controller('executables')
@UseGuards(AuthenticatedGuard)
export class ExecutablesController {
  constructor(
    private readonly executablesService: ExecutablesService,
    private readonly executableTransformer: ExecutableTransformer,
  ) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Executable[]> {
    return this.executablesService.getAll();
  }

  @Post()
  @Roles('admin')
  async create(@Body() executable: Executable): Promise<Executable> {
    return this.executablesService.save(executable);
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: number, @Body() executable: Executable): Promise<Executable> {
    return this.executablesService.update(id, executable);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<void> {
    await this.executablesService.delete(id);
  }

  @Get(':id/zip')
  @Roles('admin')
  async getZip(@Param('id') id: number, @Res() response: Response): Promise<void> {
    return zipEntities(
      id,
      'executable.zip',
      this.executableTransformer,
      await this.executablesService.getById(id, [
        'file',
        'file.content',
        'buildScript',
        'buildScript.content',
      ]),
      response,
    );
  }

  @Get('zip/all')
  @Roles('admin')
  async getZipAll(@Res() response: Response): Promise<void> {
    return zipEntities(
      undefined,
      'executables.zip',
      this.executableTransformer,
      await this.executablesService.getAllWithRelations([
        'file',
        'file.content',
        'buildScript',
        'buildScript.content',
      ]),
      response,
    );
  }

  @Post('unzip')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  saveFromZip(@UploadedFile() file, @Query('multiple') multiple: string): Promise<void> {
    return unzipEntities<Executable>(file, multiple, this.executableTransformer, (executable) =>
      this.executablesService.save(executable),
    );
  }
}
