export function formatRestTime(time: number, withSeconds = true): string {
  if (time <= 0) return 'Over';
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
