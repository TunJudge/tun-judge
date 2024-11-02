import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { JudgingResult, Prisma, ScoreCache } from '@prisma/client';

import { PrismaService } from '../db';
import { LogClass } from '../logger';
import { WebsocketGateway } from '../websocket/websocket.gateway';

type Contest = Prisma.ContestGetPayload<{ include: { teams: true; problems: true } }>;

type Submission = Prisma.SubmissionGetPayload<{ include: { judgings: true } }>;

@LogClass
@Injectable()
export class ScoreboardService {
  private readonly prisma: PrismaService = new PrismaService();
  private refreshing = false;

  constructor(private readonly socketService: WebsocketGateway) {}

  @Interval(60 * 1000)
  async refreshScores(): Promise<void> {
    if (this.refreshing) return;

    this.refreshing = true;

    try {
      const contests = await this.prisma.contest.findMany({
        where: { enabled: true, activateTime: { lte: new Date() } },
        include: { teams: true, problems: true },
      });
      await Promise.all(contests.map((contest) => this.refreshScoreForContest(contest)));

      this.socketService.pingForUpdates('all', 'scoreboard');
    } finally {
      this.refreshing = false;
    }
  }

  async refreshScoreForContest(contest: Contest): Promise<void> {
    const { problems, teams } = contest;

    for (const team of teams) {
      for (const problem of problems) {
        await this.refreshScoreCache(contest, team.teamId, problem.id);
      }
    }
  }

  refreshScoreCache = async (
    contest: Contest,
    teamId: number,
    problemId: number,
  ): Promise<void> => {
    const isCorrect = submissionHasResult(contest, ['ACCEPTED']);
    const isPending = submissionIsPending(contest);
    const hasCompileError = submissionHasResult(contest, ['COMPILATION_ERROR', 'SYSTEM_ERROR']);
    const inFreezeTime = submissionInFreezeTime(contest);
    const allProblemSubmissions = await this.prisma.submission.findMany({
      where: {
        problemId,
        contestId: contest.id,
        valid: true,
      },
      include: { judgings: { where: { valid: true }, orderBy: { startTime: 'asc' } } },
      orderBy: { submitTime: 'asc' },
    });

    const submissions = allProblemSubmissions.filter(
      (submission) => submission.teamId === teamId && !hasCompileError(submission),
    );
    const firstCorrectProblemSubmission = allProblemSubmissions.filter(isCorrect)[0];

    const scoreCache: Partial<ScoreCache> = {
      teamId,
      problemId,
      contestId: contest.id,
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
        scoreCache.firstToSolve = firstCorrectProblemSubmission?.teamId === teamId;
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
        scoreCache.restrictedFirstToSolve = firstCorrectProblemSubmission?.teamId === teamId;
      }
      if (
        (!scoreCache.restrictedCorrect ||
          scoreCache.restrictedSolveTime === submission.submitTime) &&
        !isPending(submission)
      ) {
        scoreCache.restrictedSubmissions++;
      }
    }
    await this.prisma.scoreCache.upsert({
      where: {
        contestId_teamId_problemId: {
          teamId,
          problemId,
          contestId: contest.id,
        },
      },
      create: scoreCache as ScoreCache,
      update: scoreCache as ScoreCache,
    });
  };
}

export function submissionHasResult(
  { verificationRequired }: Contest,
  results: JudgingResult[],
  inverse = false,
): (submission: Submission) => boolean {
  return (submission) => {
    const judging = submission.judgings.at(-1);
    const answer =
      results.includes(judging?.result) && !(verificationRequired && !judging.verified);

    return inverse ? !answer : answer;
  };
}

export function submissionIsPending({
  verificationRequired,
}: Contest): (submission: Submission) => boolean {
  return (submission) => {
    const judging = submission.judgings.at(-1);

    return !judging?.result || (verificationRequired && !judging.verified);
  };
}

export function submissionInFreezeTime({
  freezeTime,
  unfreezeTime,
}: Contest): (submission: Submission) => boolean {
  return (submission) => {
    freezeTime = new Date(freezeTime);
    unfreezeTime = new Date(unfreezeTime);
    const now = Date.now();

    return (
      freezeTime !== unfreezeTime &&
      submission.submitTime.getTime() >= freezeTime.getTime() &&
      submission.submitTime.getTime() < unfreezeTime.getTime() &&
      now >= freezeTime.getTime() &&
      now < unfreezeTime.getTime()
    );
  };
}
