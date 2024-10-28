import { Contest } from '@core/contexts';

export function contestStartedAndNotOver(contest?: Contest): boolean {
  const now = Date.now();

  return (
    !!contest &&
    new Date(contest.startTime).getTime() < now &&
    now < new Date(contest.endTime ?? contest.startTime).getTime()
  );
}
