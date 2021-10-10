import classNames from 'classnames';
import React from 'react';
import { dateComparator } from '../../core/helpers';
import { Judging, Submission } from '../../core/models';
import { resultMap } from '../../core/types';

type Props = {
  submission: Submission;
};

const SubmissionResult: React.FC<Props> = ({ submission }) => {
  const judging = submission.judgings
    .slice()
    .sort(dateComparator<Judging>('startTime', true))
    .shift();
  return (
    <b
      className={classNames({
        'text-green-700 dark:text-green-400': judging?.result === 'AC',
        'text-red-700 dark:text-red-400': judging?.result && judging.result !== 'AC',
        'text-gray-500 dark:text-gray-400': !judging?.result,
      })}
    >
      {resultMap[judging?.result ?? 'PD']}
    </b>
  );
};

export default SubmissionResult;
