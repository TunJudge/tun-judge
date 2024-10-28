import { Contest } from '@core/contexts';

export function getContestTimeProgress(contest?: Contest): number {
  if (!contest) return 0;

  const duration =
    new Date(contest.endTime ?? contest.startTime).getTime() -
    new Date(contest.startTime).getTime();
  const current = new Date().getTime() - new Date(contest.startTime).getTime();

  return (Math.min(duration, current) / duration) * 100;
}
