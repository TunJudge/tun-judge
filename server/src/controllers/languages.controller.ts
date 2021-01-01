import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { Language } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('languages')
@UseGuards(AuthenticatedGuard)
export class LanguagesController {
  constructor(
    @InjectRepository(Language)
    private readonly languagesRepository: ExtendedRepository<Language>,
  ) {}

  @Get()
  getAll(): Promise<Language[]> {
    return this.languagesRepository.find({
      order: { id: 'ASC' },
      relations: [
        'buildScript',
        'buildScript.content',
        'runScript',
        'runScript.content',
      ],
    });
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() language: Language): Promise<Language> {
    return this.languagesRepository.save(language);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
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
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    await this.languagesRepository.delete(id);
  }
}
