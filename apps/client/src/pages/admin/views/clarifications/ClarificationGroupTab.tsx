import { FC } from 'react';
import { Sidebar } from 'tw-react-components';

import { Clarification } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { countUnseenMessages } from '@core/utils';

import { ClarificationTab } from './ClarificationTab';

type Props = {
  clarifications: Clarification[];
  problem?: Clarification['problem'];
};

export const ClarificationGroupTab: FC<Props> = ({ clarifications, problem }) => {
  const { profile } = useAuthContext();

  const unseenMessagesCount = clarifications.reduce(
    (prev, curr) => prev + (profile ? countUnseenMessages(curr, profile) : 0),
    0,
  );

  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel>
        {problem ? `${problem.shortName} - ${problem.problem.name}` : 'General'}
        {unseenMessagesCount > 0 && (
          <div className="ml-2 rounded-md bg-purple-500 px-1.5 text-sm text-white">
            {unseenMessagesCount}
          </div>
        )}
      </Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {!clarifications.length ? (
            <Sidebar.MenuItem>
              <Sidebar.MenuButton className="text-slate-800 dark:text-slate-300" disabled>
                No Discussions
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          ) : (
            clarifications
              .sort((a, b) => (!a.team && b.team ? -1 : a.team && !b.team ? 1 : 0))
              .map((clarification) => (
                <ClarificationTab key={clarification.id} clarification={clarification} />
              ))
          )}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
};
