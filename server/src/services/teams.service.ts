import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { ExtendedRepository } from '../core/extended-repository';
import { Team, TeamCategory, User } from '../entities';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: ExtendedRepository<Team>,
    @InjectRepository(TeamCategory)
    private readonly teamCategoriesRepository: ExtendedRepository<TeamCategory>,
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
  ) {}

  async deepSave(team: Team): Promise<Team> {
    const user = team.user;
    const category = team.category;
    const contests = team.contests;
    team = (await this.teamsRepository.findOne({ name: team.name })) ?? team;
    team.contests = contests;
    if (user) {
      const dbUser = await this.usersRepository.findOne({
        username: user.username,
      });
      team.user =
        dbUser ??
        (await this.usersRepository.save({
          ...user,
          password: await hash(Math.random().toString(), await genSalt(10)),
        }));
    }
    const dbCategory = await this.teamCategoriesRepository.findOne({
      name: category.name,
    });
    team.category =
      dbCategory ?? (await this.teamCategoriesRepository.save(category));
    return this.teamsRepository.save(team);
  }
}
