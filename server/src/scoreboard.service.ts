import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Contest,
  Judging,
  Problem,
  ScoreCache,
  Submission,
  Team,
} from './entities';
import { ExtendedRepository } from './core/extended-repository';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class ScoreboardService {
  private refreshing = false;

  constructor(
    @InjectRepository(Contest)
    private readonly contestsRepository: ExtendedRepository<Contest>,
    @InjectRepository(ScoreCache)
    private readonly scoreCachesRepository: ExtendedRepository<ScoreCache>,
    @InjectRepository(Submission)
    private readonly submissionsRepository: ExtendedRepository<Submission>,
  ) {}

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
  ): Promise<void> => {
    const isCorrect = submissionHasResult(contest, 'AC');
    const hasNoCompileError = submissionHasResult(contest, 'CE', true);
    const allSubmissions = await this.submissionsRepository.find({
      where: { problem, contest },
      relations: ['team', 'judgings'],
      order: { submitTime: 'ASC' },
    });

    const allPublicTeamSubmission = allSubmissions.filter(
      (submission) =>
        submission.team.id === team.id &&
        (hasNoCompileError(submission) ||
          submissionInFreezeTime(contest, submission)),
    );
    const firstPublicAcceptedIndex = allPublicTeamSubmission.findIndex(
      (submission) =>
        !submissionInFreezeTime(contest, submission) &&
        submission.valid &&
        isCorrect(submission),
    );

    // Get problem submission that does not have a compile error result
    const problemSubmissions = allSubmissions.filter(hasNoCompileError);

    // Sort all the judging of every submission by startTime
    problemSubmissions.forEach((submission) =>
      submission.judgings.sort(
        (a, b) => b.startTime.getTime() - a.startTime.getTime(),
      ),
    );

    // Get correct submission
    const correctProblemSubmissions = problemSubmissions.filter(isCorrect);

    // Get correct submission
    const publicCorrectProblemSubmissions = problemSubmissions.filter(
      (submission) => !submissionInFreezeTime(contest, submission),
    );

    // Get team submission
    const submissions = problemSubmissions.filter(
      (submission) => submission.team.id === team.id,
    );
    const firstAcceptedIndex = submissions.findIndex(
      (submission) => submission.valid && isCorrect(submission),
    );

    // Get accepted submissions
    const correctSubmissions = submissions.filter(isCorrect);

    // Get pending submissions
    const pendingSubmissions = submissions.filter((submission) =>
      submissionIsPending(contest, submission),
    );

    // Get public accepted submissions
    const publicCorrectSubmissions = correctSubmissions.filter(
      (submission) => !submissionInFreezeTime(contest, submission),
    );
    // Get public pending submissions
    const publicPendingSubmissions = [
      ...pendingSubmissions,
      ...submissions.filter((submission) =>
        submissionInFreezeTime(contest, submission),
      ),
    ];
    await this.scoreCachesRepository.save({
      team: team,
      problem: problem,
      contest: contest,
      correct: publicCorrectSubmissions.length > 0,
      pending: publicPendingSubmissions.length,
      solveTime: publicCorrectSubmissions.shift()?.submitTime ?? null,
      submissions:
        firstPublicAcceptedIndex !== -1
          ? firstPublicAcceptedIndex + 1
          : allPublicTeamSubmission.length,
      firstToSolve:
        publicCorrectProblemSubmissions.shift()?.team.id === team.id,
      restrictedCorrect: correctSubmissions.length > 0,
      restrictedPending: pendingSubmissions.length,
      restrictedSolveTime: correctSubmissions.shift()?.submitTime ?? null,
      restrictedSubmissions:
        firstAcceptedIndex !== -1 ? firstAcceptedIndex + 1 : submissions.length,
      restrictedFirstToSolve:
        correctProblemSubmissions.shift()?.team.id === team.id,
    });
  };

  refreshScoreForContest = async (contest: Contest): Promise<void> => {
    const { problems, teams } = contest;
    for (const team of teams) {
      for (const { problem } of problems) {
        await this.refreshScoreCache(contest, team, problem);
      }
    }
  };
}

function getFirstJudging(submission: Submission): Judging | undefined {
  const judgings = submission.judgings.sort(
    (a, b) => b.startTime.getTime() - a.startTime.getTime(),
  );
  return judgings.length ? judgings[0] : undefined;
}

function submissionHasResult(
  { verificationRequired }: Contest,
  result: 'AC' | 'CE',
  inverse = false,
): (submission: Submission) => boolean {
  return (submission) => {
    const judging = getFirstJudging(submission);
    const answer =
      judging?.result === result &&
      !(verificationRequired && !judging.verified);
    return inverse ? !answer : answer;
  };
}

function submissionIsPending(
  { verificationRequired }: Contest,
  submission: Submission,
): boolean {
  const judging = getFirstJudging(submission);
  return !judging?.result || (verificationRequired && !judging.verified);
}

function submissionInFreezeTime(
  { freezeTime, unfreezeTime, endTime }: Contest,
  submission: Submission,
): boolean {
  freezeTime ??= endTime;
  unfreezeTime ??= endTime;
  const now = Date.now();
  return (
    freezeTime !== unfreezeTime &&
    submission.submitTime.getTime() >= freezeTime.getTime() &&
    submission.submitTime.getTime() < unfreezeTime.getTime() &&
    now >= freezeTime.getTime() &&
    now < unfreezeTime.getTime()
  );
}
