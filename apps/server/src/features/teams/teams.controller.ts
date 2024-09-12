import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { NumberParam } from '../../core/utils';
import { Team } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { TeamsService } from './teams.service';

@LogClass
@ApiTags('Teams')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('teams')
@UseGuards(AuthenticatedGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<Team[]> {
    return this.teamsService.getAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() team: Team): Promise<Team> {
    return this.teamsService.save(team);
  }

  @Put(':id')
  @Roles('admin')
  update(@NumberParam('id') id: number, @Body() team: Team): Promise<Team> {
    return this.teamsService.update(id, team);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@NumberParam('id') id: number): Promise<void> {
    return this.teamsService.delete(id);
  }
}
