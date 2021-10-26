import { Controller, Get, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LogClass } from '../../core/log.decorator';
import { NumberParam } from '../../core/utils';
import { Contest, ContestProblem, ScoreCache } from '../../entities';
import { ContestProblemsService } from '../contests/contest-problems.service';
import { ContestsService } from '../contests/contests.service';
import { ScoreCacheService } from '../scoreboard/score-cache.service';
import { UsersService } from '../users/users.service';

@LogClass
@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(
    private readonly usersService: UsersService,
    private readonly contestsService: ContestsService,
    private readonly contestProblemsService: ContestProblemsService,
    private readonly scoreCacheService: ScoreCacheService
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
              contest.openToAllTeams || contest.teams.some((team) => team.id === user.team.id)
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
  async getProblems(@NumberParam('id') id: number): Promise<ContestProblem[]> {
    const contest = await this.contestsService.getPublicById(id);
    return contest ? this.contestProblemsService.getByContestId(id) : [];
  }

  @Get('contest/:id/score-caches')
  async getScoreCaches(
    @NumberParam('id') contestId: number,
    @Session() session
  ): Promise<ScoreCache[]> {
    const user = await this.usersService.findById(session?.passport?.user.id);
    return (
      await this.scoreCacheService.find({ contest: { id: contestId } } as ScoreCache, [
        'contest',
        'contest.problems',
        'contest.problems.problem',
        'problem',
        'team',
      ])
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
