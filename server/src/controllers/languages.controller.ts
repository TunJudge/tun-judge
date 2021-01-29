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
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { unzipEntities, zipEntities } from '../core/utils';
import { Language } from '../entities';
import { LanguagesService } from '../services';
import { LanguageTransformer } from '../transformers';

@Controller('languages')
@UseGuards(AuthenticatedGuard)
export class LanguagesController {
  constructor(
    private readonly languagesService: LanguagesService,
    private readonly languageTransformer: LanguageTransformer,
  ) {}

  @Get()
  @Roles('admin', 'jury', 'team')
  getAll(
    @Session()
    {
      passport: {
        user: {
          role: { name },
        },
      },
    },
  ): Promise<Language[]> {
    return this.languagesService.getAll(
      ['admin', 'jury'].includes(name) && [
        'buildScript',
        'buildScript.content',
      ],
    );
  }

  @Post()
  @Roles('admin')
  create(@Body() language: Language): Promise<Language> {
    return this.languagesService.save(language);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() language: Language,
  ): Promise<Language> {
    return this.languagesService.update(id, language);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<void> {
    await this.languagesService.delete(id);
  }

  @Get(':id/zip')
  @Roles('admin')
  async getZip(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<void> {
    return zipEntities(
      id,
      'language.zip',
      this.languageTransformer,
      await this.languagesService.getById(id, [
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
      'languages.zip',
      this.languageTransformer,
      await this.languagesService.getAll([
        'buildScript',
        'buildScript.content',
      ]),
      response,
    );
  }

  @Post('unzip')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  saveFromZip(
    @UploadedFile() file,
    @Query('multiple') multiple: string,
  ): Promise<void> {
    return unzipEntities<Language>(
      file,
      multiple,
      this.languageTransformer,
      (language) => this.languagesService.save(language),
    );
  }
}
