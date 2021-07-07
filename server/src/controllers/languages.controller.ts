import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { LogClass } from '../core/log.decorator';
import { Roles } from '../core/roles.decorator';
import { Language } from '../entities';
import { LanguagesService } from '../services';

@LogClass
@Controller('languages')
@UseGuards(AuthenticatedGuard)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

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
      ['admin', 'jury'].includes(name) && ['buildScript', 'buildScript.content'],
    );
  }

  @Post()
  @Roles('admin')
  create(@Body() language: Language): Promise<Language> {
    return this.languagesService.save(language);
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: number, @Body() language: Language): Promise<Language> {
    return this.languagesService.update(id, language);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<void> {
    await this.languagesService.delete(id);
  }
}
