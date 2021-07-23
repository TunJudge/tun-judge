import { Param, ParseBoolPipe, ParseIntPipe } from '@nestjs/common';
import { Contest, Judging, JudgingResult, Submission } from '../entities';

export function getFirstJudging(submission: Submission): Judging | undefined {
  return submission.judgings.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0];
}

export function submissionHasResult(
  { verificationRequired }: Contest,
  results: JudgingResult[],
  inverse = false,
): (submission: Submission) => boolean {
  return (submission) => {
    const judging = getFirstJudging(submission);
    const answer =
      results.includes(judging?.result) && !(verificationRequired && !judging.verified);
    return inverse ? !answer : answer;
  };
}

export function submissionIsPending({
  verificationRequired,
}: Contest): (submission: Submission) => boolean {
  return (submission) => {
    const judging = getFirstJudging(submission);
    return !judging?.result || (verificationRequired && !judging.verified);
  };
}

export function submissionInFreezeTime({
  freezeTime,
  unfreezeTime,
  endTime,
}: Contest): (submission: Submission) => boolean {
  return (submission) => {
    freezeTime = new Date(freezeTime ?? endTime);
    unfreezeTime = new Date(unfreezeTime ?? endTime);
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

export function cleanNullProblems(contest: Contest): Contest {
  contest.problems = contest.problems.filter((problem) => !!problem.shortName);
  return contest;
}

export const NumberParam = (property: string) => Param(property, ParseIntPipe);

export const BoolParam = (property: string) => Param(property, ParseBoolPipe);
