import { FC } from 'react';
import { cn } from 'tw-react-components';

import { Judging, Prisma } from '@prisma/client';

import { dateComparator } from '@core/utils';

import { JUDGING_RESULT_LABELS } from '../constants';

type Props = {
  submission: Prisma.SubmissionGetPayload<{ include: { judgings: true } }>;
};

export const SubmissionResult: FC<Props> = ({ submission }) => {
  const judging = submission.judgings
    .slice()
    .sort(dateComparator<Judging>('startTime', true))
    .shift();
  return (
    <b
      className={cn({
        'text-green-700 dark:text-green-400': judging?.result === 'ACCEPTED',
        'text-red-700 dark:text-red-400': judging?.result && judging.result !== 'ACCEPTED',
        'text-slate-500 dark:text-slate-400': !judging?.result,
      })}
    >
      {submission.valid ? JUDGING_RESULT_LABELS[judging?.result ?? 'PENDING'] : 'Invalid'}
    </b>
  );
};
