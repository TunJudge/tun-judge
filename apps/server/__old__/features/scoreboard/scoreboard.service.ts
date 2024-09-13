import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { LogClass } from '../../core/log.decorator';
import { submissionHasResult, submissionInFreezeTime, submissionIsPending } from '../../core/utils';
import { Contest, Problem, ScoreCache, Team } from '../../entities';
import { ContestsService } from '../contests/contests.service';
import { SubmissionsService } from '../submissions/submissions.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { ScoreCacheService } from './score-cache.service';

@LogClass
@Injectable()
export class ScoreboardService {
  private refreshing = false;

  constructor(
    private readonly scoreCacheService: ScoreCacheService,
    private readonly contestsService: ContestsService,
    private readonly submissionsService: SubmissionsService,
    private readonly socketService: WebsocketGateway,
  ) {}

  @Interval(15 * 60 * 1000)
  async refreshScores(): Promise<void> {
    if (this.refreshing) return;
    this.refreshing = true;
    try {
      const contests = await this.contestsService.getAllActive();
      await Promise.all(contests.map(this.refreshScoreForContest));
    } catch (e) {
      throw e;
    } finally {
      this.refreshing = false;
    }
  }

  refreshScoreCache = async (
    contest: Contest,
    team: Team,
    problem: Problem,
    pingForUpdates = true,
  ): Promise<void> => {
    const isCorrect = submissionHasResult(contest, ['AC']);
    const isPending = submissionIsPending(contest);
    const hasCompileError = submissionHasResult(contest, ['CE', 'SE']);
    const inFreezeTime = submissionInFreezeTime(contest);
    const allProblemSubmissions = await this.submissionsService.getByContestIdAndProblemId(
      contest.id,
      problem.id,
    );

    const submissions = allProblemSubmissions.filter(
      (submission) => submission.team.id === team.id && !hasCompileError(submission),
    );
    const firstCorrectProblemSubmission = allProblemSubmissions.filter(isCorrect).shift();

    const scoreCache: Partial<ScoreCache> = {
      team,
      problem,
      contest,
      correct: false,
      pending: 0,
      solveTime: null,
      submissions: 0,
      firstToSolve: false,
      restrictedCorrect: false,
      restrictedPending: 0,
      restrictedSolveTime: null,
      restrictedSubmissions: 0,
      restrictedFirstToSolve: false,
    };
    for (const submission of submissions) {
      // Public fields
      if (isPending(submission) || inFreezeTime(submission)) {
        scoreCache.pending++;
      } else if (isCorrect(submission) && !scoreCache.correct) {
        scoreCache.correct = true;
        scoreCache.solveTime = submission.submitTime;
        scoreCache.firstToSolve = firstCorrectProblemSubmission?.team.id === team.id;
      }
      if (
        (!scoreCache.correct || scoreCache.solveTime === submission.submitTime) &&
        !isPending(submission)
      ) {
        scoreCache.submissions++;
      }

      // Restricted fields
      if (isPending(submission)) {
        scoreCache.restrictedPending++;
      } else if (isCorrect(submission) && !scoreCache.restrictedCorrect) {
        scoreCache.restrictedCorrect = true;
        scoreCache.restrictedSolveTime = submission.submitTime;
        scoreCache.restrictedFirstToSolve = firstCorrectProblemSubmission?.team.id === team.id;
      }
      if (
        (!scoreCache.restrictedCorrect ||
          scoreCache.restrictedSolveTime === submission.submitTime) &&
        !isPending(submission)
      ) {
        scoreCache.restrictedSubmissions++;
      }
    }
    await this.scoreCacheService.save(scoreCache);
    pingForUpdates && this.socketService.pingForUpdates('all', 'scoreboard');
  };

  refreshScoreForContest = async (contest: Contest): Promise<void> => {
    const { problems, teams } = contest;

    await this.scoreCacheService.delete({ contest });

    for (const team of teams) {
      for (const { problem } of problems) {
        await this.refreshScoreCache(contest, team, problem, false);
      }
    }
    this.socketService.pingForUpdates('all', 'scoreboard');
  };
}
