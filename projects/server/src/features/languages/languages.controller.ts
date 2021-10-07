import { Body, Controller, Delete, Get, Post, Put, Session, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { NumberParam } from '../../core/utils';
import { Language } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { LanguagesService } from './languages.service';

@LogClass
@ApiTags('Languages')
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('languages')
@UseGuards(AuthenticatedGuard)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @ApiOkResponse({ description: 'List of languages', type: [Language] })
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
    }
  ): Promise<Language[]> {
    return this.languagesService.getAll(
      ['admin', 'jury'].includes(name) && ['buildScript', 'buildScript.content']
    );
  }

  @ApiCreatedResponse({ description: 'Language created', type: Language })
  @Post()
  @Roles('admin')
  create(@Body() language: Language): Promise<Language> {
    return this.languagesService.save(language);
  }

  @ApiOkResponse({ description: 'Language updated', type: Language })
  @Put(':id')
  @Roles('admin')
  async update(@NumberParam('id') id: number, @Body() language: Language): Promise<Language> {
    return this.languagesService.update(id, language);
  }

  @ApiOkResponse({ description: 'Language deleted' })
  @Delete(':id')
  @Roles('admin')
  async delete(@NumberParam('id') id: number): Promise<void> {
    await this.languagesService.delete(id);
  }
}
