import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { Language } from '../entities';

@Controller('languages')
@UseGuards(AuthenticatedGuard)
export class LanguagesController {
  constructor(
    @InjectRepository(Language)
    private readonly languagesRepository: ExtendedRepository<Language>,
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
}
