import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Session,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual } from 'typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { Contest, ContestProblem, ScoreCache, User } from '../entities';

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
  async getContests(@Session() session): Promise<Contest[]> {
    const contests = (
      await this.contestsRepository.find({
        relations: ['teams', 'problems', 'problems.problem'],
        order: { activateTime: 'ASC' },
        where: {
          enabled: true,
          activateTime: LessThanOrEqual(new Date()),
        },
      })
    ).map(this.cleanNullProblems);
    switch (session.passport?.user.role.name) {
      case 'team':
        const user = await this.usersRepository.findOneOrThrow(
          { where: { id: session.passport?.user.id }, relations: ['team'] },
          new NotFoundException(),
        );
        return contests
          .filter(
            (contest) =>
              contest.openToAllTeams ||
              contest.teams.some((team) => team.id === user.team.id),
          )
          .map(this.cleanProblems);
      case 'jury':
      case 'admin':
        return contests;
      default:
        return contests
          .filter((contest) => contest.public)
          .map(this.cleanProblems);
    }
  }

  cleanProblems(contest: Contest): Contest {
    if (Date.now() < contest.startTime.getTime()) contest.problems = [];
    return contest;
  }

  cleanNullProblems(contest: Contest): Contest {
    contest.problems = contest.problems.filter(
      (problem) => !!problem.shortName,
    );
    return contest;
  }

  @Get('contest/:id/problems')
  async getProblems(@Param('id') contestId: number): Promise<ContestProblem[]> {
    const contest = await this.contestsRepository.findOne({
      where: {
        id: contestId,
        enabled: true,
        startTime: LessThanOrEqual(new Date()),
      },
    });
    return !contest
      ? []
      : this.contestProblemsRepository.find({
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
        relations: [
          'contest',
          'contest.problems',
          'contest.problems.problem',
          'problem',
          'team',
        ],
      })
    ).map((scoreCache) => {
      if (!session.passport || !['admin', 'jury'].includes(user.role.name)) {
        delete scoreCache.restrictedCorrect;
        delete scoreCache.restrictedPending;
        delete scoreCache.restrictedSolveTime;
        delete scoreCache.restrictedSubmissions;
        delete scoreCache.restrictedFirstToSolve;
      }
      return scoreCache;
    });
  }
}
