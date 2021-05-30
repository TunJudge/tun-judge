import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../core/guards';
import { Roles } from '../core/roles.decorator';
import { TeamCategory } from '../entities';
import { TeamCategoriesService } from '../services';

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
  update(@Param('id') id: number, @Body() teamCategory: TeamCategory): Promise<TeamCategory> {
    return this.teamCategoriesService.update(id, teamCategory);
  }

  @Patch(':id/:dir')
  @Roles('admin')
  move(@Param('id') id: number, @Param('dir') direction: 'up' | 'down'): Promise<void> {
    return this.teamCategoriesService.move(id, direction);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number): Promise<void> {
    return this.teamCategoriesService.delete(id);
  }
}
