import moment from 'moment';
import { useEffect, useState } from 'react';
import { Clarification, Contest, Judging, Testcase, User } from './models';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isEmpty(s: any): boolean {
  if (Array.isArray(s)) return s.length === 0;
  return [null, undefined, ''].includes(s);
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = (event) => {
      if (event.target?.readyState === FileReader.DONE) {
        resolve((event.target.result as string).split(';base64,').pop()!);
      }
    };
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function generalComparator(inverse = false): (a: any, b: any) => number {
  return (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return inverse ? b.length - a.length : a.length - b.length;
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return inverse ? b - a : a - b;
    }
    if (typeof a === 'string' && typeof b === 'string') {
      return inverse ? b.localeCompare(a) : a.localeCompare(b);
    }
    if (typeof a === 'object' && typeof b === 'object') {
      if (a.name && b.name) {
        return generalComparator(inverse)(a.name, b.name);
      }
      return generalComparator(inverse)(a.id, b.id);
    }
    return 0;
  };
}

export function formatRestTime(time: number, withSeconds = true): string {
  if (time <= 0) return 'contest over';
  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  let result = '';
  days && (result += `${days}d `);
  (days || hours) && (result += `${hours.toString().padStart(2, '0')}:`);
  result += minutes.toString().padStart(2, '0');
  withSeconds && (result += `:${seconds.toString().padStart(2, '0')}`);
  return result;
}

export function contestStartedAndNotOver(contest?: Contest): boolean {
  const now = Date.now();
  return (
    !!contest &&
    new Date(contest.startTime).getTime() < now &&
    now < new Date(contest.endTime).getTime()
  );
}

export function getContestTimeProgress(contest?: Contest): number {
  if (!contest) return 0;
  const duration = new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime();
  const current = new Date().getTime() - new Date(contest.startTime).getTime();
  return (Math.min(duration, current) / duration) * 100;
}

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  size /= 1024;
  if (size < 1024) return `${roundN(size)} KB`;
  size /= 1024;
  if (size < 1024) return `${roundN(size)} MB`;
  size /= 1024;
  return `${roundN(size)} GB`;
}

function roundN(value: number, digits: number = 2) {
  const tenToN = 10 ** digits;
  return Math.round(value * tenToN) / tenToN;
}

export function isSubmissionClaimedByMe(judging?: Judging, user?: User): boolean {
  return (
    !!judging?.juryMember?.username &&
    !!user?.username &&
    judging?.juryMember?.username === user?.username
  );
}

export function dateComparator<T>(field: keyof T, inv = false): (a: T, b: T) => number {
  return (a, b) =>
    new Date((inv ? b : a)[field] as any).getTime() -
    new Date((inv ? a : b)[field] as any).getTime();
}

let interval: NodeJS.Timeout | undefined = undefined;

export function updateLeftTimeToContest(
  contest?: Contest,
  setLeftToContest?: (value: number) => void
): void {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (contest) {
      const startTime = new Date(contest.startTime).getTime();
      const now = Date.now();
      if (now < startTime) {
        interval && clearInterval(interval);
        setLeftToContest!((startTime - now) / 1000);
        interval = setInterval(() => {
          const startTime = new Date(contest.startTime).getTime();
          const now = Date.now();
          if (now < startTime) setLeftToContest!((startTime - now) / 1000);
          else window.location.reload();
        }, 1000);
      } else if (interval) {
        window.location.reload();
      } else {
        setLeftToContest!(0);
      }
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [contest, setLeftToContest]);
}

export function getRandomHexColor(): string {
  return `#${Math.random().toString(16).substr(2, 6)}`;
}

export function getJudgingRunColor(
  testcase: Testcase,
  judging?: Judging
): 'gray' | 'green' | 'red' {
  if (!judging) return 'gray';
  const judgeRun = judging.runs.find((r) => r.testcase.id === testcase.id);
  return !judgeRun ? 'gray' : judgeRun.result === 'AC' ? 'green' : 'red';
}

export function useLongPress(
  callback: () => void,
  ms = 100
): {
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
} {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (startLongPress) {
      timerId = setTimeout(callback, ms);
    } else {
      clearTimeout(timerId!);
    }

    return () => {
      timerId && clearTimeout(timerId);
    };
  }, [callback, ms, startLongPress]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  };
}

export function getDisplayDate(date: Date): string {
  return moment(date).format('ddd DD MMM, YYYY [at] HH:mm');
}

export function getRGBColorContrast(rgb: string): number {
  rgb = rgb.replaceAll('#', '');

  const red = Number.parseInt(rgb.slice(0, 2), 16);
  const green = Number.parseInt(rgb.slice(2, 4), 16);
  const blue = Number.parseInt(rgb.slice(4), 16);

  return (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
}

export function countUnseenMessages(clarification: Clarification, currentUser: User): number {
  return clarification.messages.filter((m) => !m.seen && m.sentBy.id !== currentUser.id).length;
}

export function compareRoles(currentUser: User, sendingUser: User): boolean {
  if (currentUser.role.name === 'team') {
    return sendingUser.role.name === 'team';
  }

  return sendingUser.role.name !== 'team';
}
