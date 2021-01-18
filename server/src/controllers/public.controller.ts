import { Controller, Get, Param, Session } from '@nestjs/common';
import { ExtendedRepository } from '../core/extended-repository';
import { Contest, ContestProblem, ScoreCache, User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual } from 'typeorm';

@Controller('public')
export class PublicController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: ExtendedRepository<User>,
    @InjectRepository(Contest)
    private readonly contestsRepository: ExtendedRepository<Contest>,
    @InjectRepository(ContestProblem)
    private readonly contestProblemsRepository: ExtendedRepository<ContestProblem>,
    @InjectRepository(ScoreCache)
    private readonly scoreCachesRepository: ExtendedRepository<ScoreCache>,
  ) {}

  @Get('contests')
  getContests(): Promise<Contest[]> {
    return this.contestsRepository
      .find({
        relations: ['problems', 'problems.problem', 'teams'],
        order: { activateTime: 'ASC' },
        where: {
          public: true,
          enabled: true,
          activateTime: LessThanOrEqual(new Date()),
        },
      })
      .then((data) =>
        data.map((c) => ({
          ...c,
          problems: c.problems.filter((p) => p.problem !== null),
        })),
      );
  }

  @Get('contest/:id/problems')
  getProblems(@Param('id') contestId: number): Promise<ContestProblem[]> {
    return this.contestProblemsRepository.find({
      order: { shortName: 'ASC' },
      where: { contest: { id: contestId } },
      relations: ['problem', 'problem.file', 'problem.file.content'],
    });
  }

  @Get('contest/:id/score-caches')
  async getScoreCaches(
    @Param('id') contestId: number,
    @Session() session,
  ): Promise<ScoreCache[]> {
    const user = await this.usersRepository.findOne({
      id: session?.passport?.user.id,
    });
    return (
      await this.scoreCachesRepository.find({
        where: { contest: { id: contestId } },
        relations: ['contest', 'problem', 'team'],
      })
    ).map((scoreCache) => {
      if (!session.passport || !['admin', 'jury'].includes(user.role.name)) {
        delete scoreCache.restrictedCorrect;
        delete scoreCache.restrictedPending;
        delete scoreCache.restrictedSolveTime;
      }
      return scoreCache;
    });
  }
}
