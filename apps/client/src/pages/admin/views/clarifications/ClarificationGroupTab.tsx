import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { FC } from 'react';

import { Clarification } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { countUnseenMessages } from '@core/utils';

import { ClarificationTab } from './ClarificationTab';

type Props = {
  open: boolean;
  clarifications: Clarification[];
  problem?: Clarification['problem'];
  onTabClick: (tab: number | 'general') => void;
};

export const ClarificationGroupTab: FC<Props> = ({ clarifications, problem, open, onTabClick }) => {
  const { profile } = useAuthContext();

  const unseenMessagesCount = clarifications.reduce(
    (prev, curr) => prev + (profile ? countUnseenMessages(curr, profile) : 0),
    0,
  );

  if (!clarifications.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex cursor-pointer justify-between"
        onClick={() => onTabClick(problem?.problem.id ?? 'general')}
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
          {problem ? `${problem.shortName} - ${problem.problem.name}` : 'General'}
        </div>
        {unseenMessagesCount > 0 && (
          <div className="float-right rounded-md bg-purple-500 px-2 py-0.5 text-sm text-white">
            {unseenMessagesCount}
          </div>
        )}
      </div>
      {open &&
        (!clarifications.length ? (
          <div className="ml-5 text-sm text-slate-500">No Discussions</div>
        ) : (
          clarifications.map((clarification) => (
            <ClarificationTab key={clarification.id} clarification={clarification} />
          ))
        ))}
    </div>
  );
};
