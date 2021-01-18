import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contest, ScoreCache, Submission } from './entities';
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
  ) {}

  async refreshScores(): Promise<void> {
    if (this.refreshing) return;
    this.refreshing = true;
    try {
      const now = new Date();
      const contests = await this.contestsRepository.find({
        where: { activateTime: LessThanOrEqual(now) },
        relations: [
          'teams',
          'problems',
          'problems.problem',
          'submissions',
          'submissions.team',
          'submissions.problem',
          'submissions.judgings',
        ],
      });
      await Promise.all(contests.map(this.refreshScoreForContest));
    } catch (e) {
      throw e;
    } finally {
      this.refreshing = false;
    }
  }

  private refreshScoreForContest = async (contest: Contest): Promise<void> => {
    const { submissions, problems, teams } = contest;
    const sortedSubmissions = submissions
      .filter(
        (submission) => !submissionHasCompilationError(contest, submission),
      )
      .sort(
        (a, b) =>
          new Date(a.submitTime).getTime() - new Date(b.submitTime).getTime(),
      );
    for (const problem of problems.map((p) => p.problem)) {
      const problemSubmissions = sortedSubmissions.filter(
        (submission) => submission.problem.id === problem.id,
      );
      const correctProblemSubmissions = problemSubmissions.filter(
        (submission) => submissionIsCorrect(contest, submission),
      );
      for (const team of teams) {
        const correctTeamSubmissions = problemSubmissions.filter(
          (submission) =>
            submission.team.id === team.id &&
            submissionIsCorrect(contest, submission),
        );
        const teamSubmissions = problemSubmissions.filter(
          (submission) =>
            submission.team.id === team.id &&
            (!correctTeamSubmissions.length ||
              new Date(submission.submitTime).getTime() <=
                new Date(correctTeamSubmissions[0].submitTime).getTime()),
        );
        const pendingTeamSubmissions = teamSubmissions.filter((submission) =>
          submissionIsPending(contest, submission),
        );

        const publicPendingTeamSubmissions = teamSubmissions.filter(
          (submission) =>
            submissionIsPending(contest, submission) ||
            !submissionIsBeforeFreezeTime(contest, submission),
        );
        const publicCorrectTeamSubmissions = correctTeamSubmissions.filter(
          (submission) => submissionIsBeforeFreezeTime(contest, submission),
        );
        await this.scoreCachesRepository.save({
          team: team,
          problem: problem,
          contest: contest,
          correct: publicCorrectTeamSubmissions.length > 0,
          solveTime: publicCorrectTeamSubmissions.length
            ? publicCorrectTeamSubmissions[0].submitTime
            : null,
          pending: publicPendingTeamSubmissions.length,
          submissions: teamSubmissions.length,
          restrictedCorrect: correctTeamSubmissions.length > 0,
          restrictedSolveTime: correctTeamSubmissions.length
            ? correctTeamSubmissions[0].submitTime
            : null,
          restrictedPending: pendingTeamSubmissions.length,
          firstToSolve: correctProblemSubmissions.length
            ? correctProblemSubmissions[0].team.id === team.id
            : false,
        });
      }
    }
  };
}

function submissionIsCorrect(
  contest: Contest,
  submission: Submission,
): boolean {
  return submission.judgings.some(
    (judging) =>
      ((contest.verificationRequired && judging.verified) ||
        !contest.verificationRequired) &&
      judging.result === 'AC',
  );
}

function submissionHasCompilationError(
  contest: Contest,
  submission: Submission,
): boolean {
  const judgings = submission.judgings.sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
  );
  return (
    judgings.length &&
    ((contest.verificationRequired && judgings[0].verified) ||
      !contest.verificationRequired) &&
    judgings[0].result === 'CE'
  );
}

function submissionIsPending(
  contest: Contest,
  submission: Submission,
): boolean {
  return (
    !submission.judgings.length ||
    submission.judgings.some(
      (judging) =>
        !judging.result ||
        (judging.result && contest.verificationRequired && !judging.verified),
    )
  );
}

function submissionIsBeforeFreezeTime(
  contest: Contest,
  submission: Submission,
): boolean {
  const freezeTime = contest.freezeTime ?? contest.endTime;
  const unFreezeTime = contest.unfreezeTime ?? contest.endTime;
  return (
    new Date(submission.submitTime).getTime() <
      new Date(freezeTime).getTime() ||
    new Date(submission.submitTime).getTime() >=
      new Date(unFreezeTime).getTime()
  );
}
