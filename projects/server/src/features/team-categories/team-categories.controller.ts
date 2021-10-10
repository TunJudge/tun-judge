import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LogClass } from '../../core/log.decorator';
import { Roles } from '../../core/roles.decorator';
import { NumberParam } from '../../core/utils';
import { TeamCategory } from '../../entities';
import { AuthenticatedGuard } from '../../guards';
import { TeamCategoriesService } from './team-categories.service';

@LogClass
@ApiTags('Team Categories')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('team-categories')
@UseGuards(AuthenticatedGuard)
export class TeamCategoriesController {
  constructor(private readonly teamCategoriesService: TeamCategoriesService) {}

  @Get()
  @Roles('admin', 'jury')
  getAll(): Promise<TeamCategory[]> {
    return this.teamCategoriesService.getAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() teamCategory: TeamCategory): Promise<TeamCategory> {
    return this.teamCategoriesService.create(teamCategory);
  }

  @Put(':id')
  @Roles('admin')
  update(@NumberParam('id') id: number, @Body() teamCategory: TeamCategory): Promise<TeamCategory> {
    return this.teamCategoriesService.update(id, teamCategory);
  }

  @Patch(':id/:dir')
  @Roles('admin')
  move(@NumberParam('id') id: number, @Param('dir') direction: 'up' | 'down'): Promise<void> {
    return this.teamCategoriesService.move(id, direction);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@NumberParam('id') id: number): Promise<void> {
    return this.teamCategoriesService.delete(id);
  }
}
