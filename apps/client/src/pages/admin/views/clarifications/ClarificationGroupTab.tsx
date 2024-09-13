import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';
import React from 'react';

import { countUnseenMessages } from '@core/helpers';
import { Clarification, ContestProblem } from '@core/models';
import { RootStore, useStore } from '@core/stores';

import ClarificationTab from './ClarificationTab';

type Props = {
  clarifications: Clarification[];
  selectedClarifications: Clarification;
  problem?: ContestProblem;
  open: boolean;
  onTabClick: (tab: number | 'general') => void;
  onClarificationClick: (item: Clarification) => void;
};

const ClarificationGroupTab: React.FC<Props> = ({
  clarifications,
  selectedClarifications,
  problem,
  open,
  onTabClick,
  onClarificationClick,
}) => {
  const { profile } = useStore<RootStore>('rootStore');

  const unseenMessagesCount = clarifications.reduce(
    (prev, curr) => prev + countUnseenMessages(curr, profile!),
    0,
  );

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
          <div className="ml-5 text-sm text-gray-500">No Discussions</div>
        ) : (
          clarifications.map((clarification) => (
            <ClarificationTab
              key={clarification.id}
              clarification={clarification}
              active={clarification.id === selectedClarifications?.id}
              onClick={onClarificationClick}
            />
          ))
        ))}
    </div>
  );
};

export default ClarificationGroupTab;
