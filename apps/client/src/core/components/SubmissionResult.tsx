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
        'text-gray-500 dark:text-gray-400': !judging?.result,
      })}
    >
      {JUDGING_RESULT_LABELS[judging?.result ?? 'PENDING']}
    </b>
  );
};
