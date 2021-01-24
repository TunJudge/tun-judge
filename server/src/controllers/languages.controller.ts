import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import * as JSZip from 'jszip';
import { ExtendedRepository } from '../core/extended-repository';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { Language } from '../entities';
import { LanguageTransformer } from '../transformers';

@Controller('languages')
@UseGuards(AuthenticatedGuard)
export class LanguagesController {
  constructor(
    @InjectRepository(Language)
    private readonly languagesRepository: ExtendedRepository<Language>,
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
    return this.languagesRepository.find({
      order: { id: 'ASC' },
      relations: ['admin', 'jury'].includes(name) && [
        'buildScript',
        'buildScript.content',
      ],
    });
  }

  @Post()
  @Roles('admin')
  create(@Body() language: Language): Promise<Language> {
    return this.languagesRepository.save(language);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() language: Language,
  ): Promise<Language> {
    const oldLanguage = await this.languagesRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    return this.languagesRepository.save({ ...oldLanguage, ...language });
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<void> {
    await this.languagesRepository.delete(id);
  }

  @Get(':id/zip')
  @Roles('admin')
  async getZip(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<void> {
    const language = await this.languagesRepository.findOneOrThrow(
      {
        where: { id },
        relations: ['buildScript', 'buildScript.content'],
      },
      new NotFoundException(),
    );
    const zip = new JSZip();
    await this.languageTransformer.toZip(language, zip);
    response.attachment('language.zip');
    zip.generateNodeStream().pipe(response);
  }

  @Get('zip/all')
  @Roles('admin')
  async getZipAll(@Res() response: Response): Promise<void> {
    const languages = await this.languagesRepository.find({
      relations: ['buildScript', 'buildScript.content'],
    });
    const zip = new JSZip();
    await this.languageTransformer.manyToZip(languages, zip);
    response.attachment('languages.zip');
    zip.generateNodeStream().pipe(response);
  }

  @Post('unzip')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async saveFromZip(
    @UploadedFile() file,
    @Query('multiple') multiple: string,
  ): Promise<void> {
    if (multiple === 'true') {
      const languages = await this.languageTransformer.fromZipToMany(
        await JSZip.loadAsync(file.buffer),
      );
      await Promise.all(
        languages.map((language) => this.languagesRepository.save(language)),
      );
    } else {
      const language = await this.languageTransformer.fromZip(
        await JSZip.loadAsync(file.buffer),
      );
      await this.languagesRepository.save(language);
    }
  }
}
