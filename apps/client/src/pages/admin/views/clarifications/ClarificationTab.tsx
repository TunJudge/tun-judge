import classNames from 'classnames';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Clarification } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { countUnseenMessages } from '@core/utils';

type Props = {
  clarification: Clarification;
};

export const ClarificationTab: FC<Props> = ({ clarification }) => {
  const { profile } = useAuthContext();
  const { contestId, clarificationId = '-1' } = useParams();

  const unseenMessagesCount = profile ? countUnseenMessages(clarification, profile) : 0;

  return (
    <Link to={`/contests/${contestId}/clarifications/${clarification.id}`}>
      <div
        className={classNames(
          'border-border ml-5 cursor-pointer truncate rounded-lg border p-2 shadow dark:hover:bg-slate-700',
          {
            'bg-slate-200 dark:bg-slate-700': clarification.id === +clarificationId,
          },
        )}
      >
        <span className="text-slate-500">({clarification.id}) </span>
        {clarification.team?.name ?? 'Broadcast'}
        {unseenMessagesCount > 0 && (
          <div className="float-right rounded-md bg-green-500 px-2 py-0.5 text-sm text-white">
            {unseenMessagesCount}
          </div>
        )}
      </div>
    </Link>
  );
};
