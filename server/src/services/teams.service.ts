import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { LogClass } from '../core/log.decorator';
import { Team } from '../entities';
import { TeamCategoriesService } from './team-categories.service';
import { UsersService } from './users.service';

@LogClass
@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: ExtendedRepository<Team>,
    private readonly teamCategoriesService: TeamCategoriesService,
    private readonly usersService: UsersService,
  ) {}

  getAll(): Promise<Team[]> {
    return this.teamsRepository.find({
      order: { id: 'ASC' },
      relations: ['user', 'category', 'contests'],
    });
  }

  getByUserId(userId: number): Promise<Team> {
    return this.teamsRepository.findOneOrThrow(
      { user: { id: userId } },
      new NotFoundException('Team not found!'),
    );
  }

  save(team: Team): Promise<Team> {
    return this.teamsRepository.save(team);
  }

  async update(id: number, team: Team): Promise<Team> {
    const oldTeam = await this.teamsRepository.findOneOrThrow(
      id,
      new NotFoundException('Team not found!'),
    );
    return this.save({ ...oldTeam, ...team });
  }

  async deepSave(team: Team): Promise<Team> {
    const user = team.user;
    const category = team.category;
    const contests = team.contests;
    team = (await this.teamsRepository.findOne({ name: team.name })) ?? team;
    team.contests = contests;
    if (user) {
      const dbUser = await this.usersService.getByUsername(user.username);
      team.user = dbUser ?? (await this.usersService.create(user));
    }
    const dbCategory = await this.teamCategoriesService.getByName(category.name);
    team.category = dbCategory ?? (await this.teamCategoriesService.create(category));
    return this.save(team);
  }

  async delete(id: number): Promise<void> {
    await this.teamsRepository.delete(id);
  }
}
