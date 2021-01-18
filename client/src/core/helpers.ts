import { Contest, Judging, User } from './models';

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
export function generalComparator(a: any, b: any): number {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length - b.length;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }
  if (typeof a === 'object' && typeof b === 'object') {
    if (a.name && b.name) {
      return generalComparator(a.name, b.name);
    }
    return generalComparator(a.id, b.id);
  }
  return 0;
}

export function formatRestTime(time: number): string {
  if (time <= 0) return 'contest over';
  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  let result = '';
  days && (result += `${days}d `);
  (days || hours) && (result += `${hours < 10 ? '0' + hours : hours}:`);
  (days || hours || minutes) && (result += `${minutes < 10 ? '0' + minutes : minutes}:`);
  result += `${seconds < 10 ? '0' + seconds : seconds}`;
  return result;
}

export function contestNotOver(contest?: Contest): boolean {
  return !!contest && Date.now() < new Date(contest.endTime).getTime();
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
