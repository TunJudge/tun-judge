import { Controller, Get, Param, Session } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtendedRepository } from '../core/extended-repository';
import { LogClass } from '../core/log.decorator';
import { Contest, ContestProblem, ScoreCache } from '../entities';
import { ContestProblemsService, ContestsService, UsersService } from '../services';

@LogClass
@Controller('public')
export class PublicController {
  constructor(
    private readonly usersService: UsersService,
    private readonly contestsService: ContestsService,
    private readonly contestProblemsService: ContestProblemsService,
    @InjectRepository(ScoreCache)
    private readonly scoreCachesRepository: ExtendedRepository<ScoreCache>,
  ) {}

  @Get('contests')
  async getContests(@Session() session): Promise<Contest[]> {
    const contests = await this.contestsService.getAllActive();
    switch (session.passport?.user.role.name) {
      case 'team':
        const user = await this.usersService.getById(session.passport?.user.id, ['team']);
        return contests
          .filter(
            (contest) =>
              contest.openToAllTeams || contest.teams.some((team) => team.id === user.team.id),
          )
          .map(this.cleanProblems);
      case 'jury':
      case 'admin':
        return contests;
      default:
        return contests.filter((contest) => contest.public).map(this.cleanProblems);
    }
  }

  cleanProblems(contest: Contest): Contest {
    if (Date.now() < contest.startTime.getTime()) contest.problems = [];
    return contest;
  }

  @Get('contest/:id/problems')
  async getProblems(@Param('id') id: number): Promise<ContestProblem[]> {
    const contest = await this.contestsService.getPublicById(id);
    return !contest ? [] : this.contestProblemsService.getByContestId(id);
  }

  @Get('contest/:id/score-caches')
  async getScoreCaches(@Param('id') contestId: number, @Session() session): Promise<ScoreCache[]> {
    const user = await this.usersService.findById(session?.passport?.user.id);
    return (
      await this.scoreCachesRepository.find({
        where: { contest: { id: contestId } },
        relations: ['contest', 'contest.problems', 'contest.problems.problem', 'problem', 'team'],
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
