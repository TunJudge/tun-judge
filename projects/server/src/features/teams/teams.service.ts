import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtendedRepository } from '../../core/extended-repository';
import { LogClass } from '../../core/log.decorator';
import { Team } from '../../entities';

@LogClass
@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: ExtendedRepository<Team>
  ) {}

  getAll(): Promise<Team[]> {
    return this.teamsRepository
      .find({
        order: { id: 'ASC' },
        relations: ['users', 'category', 'contests'],
      })
      .then((teams) =>
        teams.map((team) => {
          team.users.forEach((user) => user.clean());
          return team;
        })
      );
  }

  async getByUserId(userId: number): Promise<Team> {
    try {
      return await this.teamsRepository
        .createQueryBuilder('team')
        .where(
          '(SELECT COUNT(*) FROM "user" WHERE "user"."id" = :userId AND "user"."teamId" = "team"."id") > 0',
          {
            userId,
          }
        )
        .getOneOrFail();
    } catch {
      throw new NotFoundException('Team not found!');
    }
  }

  save(team: Team): Promise<Team> {
    return this.teamsRepository.save(team);
  }

  async update(id: number, team: Team): Promise<Team> {
    const oldTeam = await this.teamsRepository.findOneOrThrow(
      id,
      new NotFoundException('Team not found!')
    );
    return this.save({ ...oldTeam, ...team });
  }

  async deepSave(team: Team): Promise<Team> {
    const users = team.users;
    const category = team.category;
    const contests = team.contests;
    team = (await this.teamsRepository.findOne({ name: team.name })) ?? team;
    team.contests = contests;
    team.users = users;
    team.category = category;
    return this.save(team);
  }

  async delete(id: number): Promise<void> {
    await this.teamsRepository.delete(id);
  }
}
