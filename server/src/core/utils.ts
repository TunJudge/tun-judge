import { Contest, Judging, Submission } from '../entities';

export function getFirstJudging(submission: Submission): Judging | undefined {
  const judgings = submission.judgings.sort(
    (a, b) => b.startTime.getTime() - a.startTime.getTime(),
  );
  return judgings.length ? judgings[0] : undefined;
}

export function submissionHasResult(
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
