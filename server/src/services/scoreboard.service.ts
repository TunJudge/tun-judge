import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual } from 'typeorm';
import { AppGateway } from '../app.gateway';
import { ExtendedRepository } from '../core/extended-repository';
import { LogClass } from '../core/log.decorator';
import { submissionHasResult, submissionInFreezeTime, submissionIsPending } from '../core/utils';
import { Contest, Problem, ScoreCache, Team } from '../entities';
import { SubmissionsService } from './submissions.service';

@LogClass
@Injectable()
export class ScoreboardService {
  private refreshing = false;

  constructor(
    @InjectRepository(Contest)
    private readonly contestsRepository: ExtendedRepository<Contest>,
    @InjectRepository(ScoreCache)
    private readonly scoreCachesRepository: ExtendedRepository<ScoreCache>,
    private readonly submissionsService: SubmissionsService,
    private readonly socketService: AppGateway,
  ) {}

  @Interval(15 * 60 * 1000)
  async refreshScores(): Promise<void> {
    if (this.refreshing) return;
    this.refreshing = true;
    try {
      const now = new Date();
      const contests = await this.contestsRepository.find({
        where: { activateTime: LessThanOrEqual(now) },
        relations: ['teams', 'problems', 'problems.problem'],
      });
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
    await this.scoreCachesRepository.save(scoreCache);
    pingForUpdates && this.socketService.pingForUpdates('scoreboard');
  };

  refreshScoreForContest = async (contest: Contest): Promise<void> => {
    const { problems, teams } = contest;

    await this.scoreCachesRepository.delete({ contest });

    for (const team of teams) {
      for (const { problem } of problems) {
        await this.refreshScoreCache(contest, team, problem, false);
      }
    }
    this.socketService.pingForUpdates('scoreboard');
  };
}
