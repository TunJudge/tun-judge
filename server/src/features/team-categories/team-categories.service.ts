import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan } from 'typeorm';
import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { NumberParam } from '../../core/utils';
import { TeamCategory } from '../../entities';

@LogClass
@Injectable()
export class TeamCategoriesService {
  constructor(
    @InjectRepository(TeamCategory)
    private readonly teamCategoriesRepository: ExtendedRepository<TeamCategory>,
  ) {}

  getAll(): Promise<TeamCategory[]> {
    return this.teamCategoriesRepository.find({
      order: { sortOrder: 'ASC' },
      relations: ['teams'],
    });
  }

  getById(id: number, relations: string[] = []): Promise<TeamCategory> {
    return this.teamCategoriesRepository.findOneOrThrow(
      { where: { id }, relations },
      new NotFoundException('Team Category not found!'),
    );
  }

  getByName(name: string): Promise<TeamCategory> {
    return this.teamCategoriesRepository.findOne({ name });
  }

  async create(teamCategory: TeamCategory): Promise<TeamCategory> {
    teamCategory.sortOrder = await this.teamCategoriesRepository.count();
    return this.teamCategoriesRepository.save(teamCategory);
  }

  async update(id: number, teamCategory: TeamCategory): Promise<TeamCategory> {
    const oldTeamCategory = await this.getById(id);
    return this.teamCategoriesRepository.save({
      ...oldTeamCategory,
      ...teamCategory,
    });
  }

  async move(id: number, direction: 'up' | 'down'): Promise<void> {
    const teamCategory = await this.getById(id);
    const otherTeamCategory = await this.teamCategoriesRepository.findOne({
      sortOrder: direction === 'up' ? teamCategory.sortOrder - 1 : teamCategory.sortOrder + 1,
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

  async delete(@NumberParam('id') id: number): Promise<void> {
    const teamCategory = await this.getById(id);
    await this.teamCategoriesRepository.delete(id);
    const teamCategories = await this.teamCategoriesRepository.find({
      where: { sortOrder: MoreThan(teamCategory.sortOrder) },
    });
    for (const _teamCategory of teamCategories) {
      await this.teamCategoriesRepository.save({
        ..._teamCategory,
        sortOrder: _teamCategory.sortOrder - 1,
      });
    }
  }
}
