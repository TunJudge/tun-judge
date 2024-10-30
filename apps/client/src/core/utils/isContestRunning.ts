import { Contest } from '@prisma/client';

export function isContestRunning(contest?: Contest): boolean {
  const now = Date.now();
  return (
    !!contest &&
    !!contest.endTime &&
    new Date(contest.startTime).getTime() <= now &&
    now <= new Date(contest.endTime).getTime()
  );
}
