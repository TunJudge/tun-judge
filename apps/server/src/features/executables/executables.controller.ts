import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { NumberParam } from '../../core/utils';
import { Executable } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { ExecutablesService } from './executables.service';

@LogClass
@ApiTags('Executables')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('executables')
@UseGuards(AuthenticatedGuard)
export class ExecutablesController {
  constructor(private readonly executablesService: ExecutablesService) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Executable[]> {
    return this.executablesService.getAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() executable: Executable): Promise<Executable> {
    return this.executablesService.save(executable);
  }

  @Put(':id')
  @Roles('admin')
  update(@NumberParam('id') id: number, @Body() executable: Executable): Promise<Executable> {
    return this.executablesService.update(id, executable);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@NumberParam('id') id: number): Promise<void> {
    await this.executablesService.delete(id);
  }
}
