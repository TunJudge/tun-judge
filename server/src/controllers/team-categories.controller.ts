import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthenticatedGuard } from '../core/guards';
import { ExtendedRepository } from '../core/extended-repository';
import { TeamCategory } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('team-categories')
@UseGuards(AuthenticatedGuard)
export class TeamCategoriesController {
  constructor(
    @InjectRepository(TeamCategory)
    private readonly teamCategoriesRepository: ExtendedRepository<TeamCategory>,
  ) {}

  @Get()
  getAll(): Promise<TeamCategory[]> {
    return this.teamCategoriesRepository.find({
      order: { sortOrder: 'ASC' },
      relations: ['teams'],
    });
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() teamCategory: TeamCategory): Promise<TeamCategory> {
    teamCategory.sortOrder = await this.teamCategoriesRepository.count();
    return this.teamCategoriesRepository.save(teamCategory);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: number,
    @Body() teamCategory: TeamCategory,
  ): Promise<TeamCategory> {
    const oldTeamCategory = await this.teamCategoriesRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    return this.teamCategoriesRepository.save({
      ...oldTeamCategory,
      ...teamCategory,
    });
  }

  @Patch(':id/:dir')
  @UseGuards(AdminGuard)
  async move(
    @Param('id') id: number,
    @Param('dir') direction: 'up' | 'down',
  ): Promise<void> {
    const teamCategory = await this.teamCategoriesRepository.findOneOrThrow(
      id,
      new NotFoundException(),
    );
    const otherTeamCategory = await this.teamCategoriesRepository.findOne({
      sortOrder:
        direction === 'up'
          ? teamCategory.sortOrder - 1
          : teamCategory.sortOrder + 1,
    });
    if (otherTeamCategory) {
      const aux = otherTeamCategory.sortOrder;
      otherTeamCategory.sortOrder = teamCategory.sortOrder;
      await this.teamCategoriesRepository.save({
        ...teamCategory,
        sortOrder: -1,
      });
      await this.teamCategoriesRepository.save(otherTeamCategory);
      await this.teamCategoriesRepository.save({
        ...teamCategory,
        sortOrder: aux,
      });
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number): Promise<void> {
    await this.teamCategoriesRepository.delete(id);
  }
}
