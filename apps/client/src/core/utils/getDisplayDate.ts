import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export function getDisplayDate(date: string | Date): string {
  return dayjs(date).format('dddd, MMMM Do YYYY, HH:mm:ss');
}
