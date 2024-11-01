import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sidebar, useLayoutContext } from 'tw-react-components';

import { Clarification } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { countUnseenMessages } from '@core/utils';

type Props = {
  clarification: Clarification;
};

export const ClarificationTab: FC<Props> = ({ clarification }) => {
  const { profile } = useAuthContext();
  const { showIds } = useLayoutContext();
  const { contestId, clarificationId = '-1' } = useParams();

  const unseenMessagesCount = profile ? countUnseenMessages(clarification, profile) : 0;

  return (
    <Sidebar.MenuItem>
      <Sidebar.MenuButton asChild isActive={+clarificationId === clarification.id}>
        <Link to={`/contests/${contestId}/clarifications/${clarification.id}`}>
          {showIds && <span className="text-slate-500">({clarification.id}) </span>}
          {clarification.team?.name ?? 'Broadcast'}
          {unseenMessagesCount > 0 && (
            <div className="float-right rounded-md bg-green-500 px-1.5 text-sm text-white">
              {unseenMessagesCount}
            </div>
          )}
        </Link>
      </Sidebar.MenuButton>
    </Sidebar.MenuItem>
  );
};
