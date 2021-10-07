import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { RefreshIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { countUnseenMessages } from '../../../../core/helpers';
import { Clarification, ContestProblem } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import ChatBox from '../../../shared/chat-box/ChatBox';
import { NoActiveContest } from '../../../shared/NoActiveContest';

const ClarificationsList: React.FC = observer(() => {
  const {
    updatesCount: { clarifications },
    publicStore: { currentContest },
    clarificationsStore: { item, data, setItem, fetchAllForContest },
  } = rootStore;
  const [tabStatus, setTabStatus] = useState<Record<number | 'general', boolean>>({
    general: false,
  });

  useEffect(() => {
    if (currentContest) {
      fetchAllForContest(currentContest.id);
    }
  }, [currentContest, clarifications, fetchAllForContest]);

  useEffect(() => {
    if (currentContest) {
      currentContest.problems.forEach((cp) =>
        setTabStatus((tabStatus) => ({ ...tabStatus, [cp.problem.id]: false }))
      );
    }
  }, [currentContest]);

  const flipTabStatus = (tab: number | 'general') => () =>
    setTabStatus((tabStatus) => ({ ...tabStatus, [tab]: !tabStatus[tab] }));

  return !currentContest ? (
    <NoActiveContest />
  ) : (
    <div className="flex flex-col dark:text-white h-full overflow-hidden">
      <div className="p-4 pb-0">
        <div className="flex items-center shadow-md rounded-md w-full justify-between px-4 py-2 bg-white dark:bg-gray-800">
          <div className="text-xl font-medium">Clarifications</div>
          <div className="flex items-center space-x-2">
            <div className="hover:bg-gray-200 rounded-md p-2 cursor-pointer">
              <RefreshIcon
                className="w-6 h-6"
                onClick={() => fetchAllForContest(currentContest.id)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full p-4 gap-4 overflow-hidden">
        <div className="w-72 p-4 bg-white shadow-md rounded-md overflow-auto dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col gap-4 select-none">
            <div
              className="p-2 rounded-lg text-white bg-blue-600 text-center cursor-pointer"
              onClick={() =>
                setItem({
                  general: true,
                  contest: currentContest,
                  messages: [],
                } as any)
              }
            >
              New Clarification
            </div>
            <ClarificationGroupTab
              clarifications={data.filter((clarification) => clarification.general)}
              selectedClarifications={item}
              open={tabStatus.general}
              onTabClick={flipTabStatus('general')}
              onClarificationClick={setItem}
            />
            {currentContest.problems.map((contestProblem) => {
              const filteredClarifications = data.filter(
                (clarification) => clarification.problem?.id === contestProblem.problem.id
              );

              if (!filteredClarifications.length) return undefined;

              return (
                <ClarificationGroupTab
                  key={contestProblem.problem.id}
                  clarifications={filteredClarifications}
                  selectedClarifications={item}
                  problem={contestProblem}
                  open={tabStatus[contestProblem.problem.id]}
                  onTabClick={flipTabStatus(contestProblem.problem.id)}
                  onClarificationClick={setItem}
                />
              );
            })}
          </div>
        </div>
        <div className="w-full p-4 bg-white shadow-md rounded-md dark:bg-gray-800 dark:border-gray-700">
          <ChatBox item={item} isOpen onClose={() => false} onSubmit={() => false} />
        </div>
      </div>
    </div>
  );
});

export default ClarificationsList;

const ClarificationGroupTab: React.FC<{
  clarifications: Clarification[];
  selectedClarifications: Clarification;
  problem?: ContestProblem;
  open: boolean;
  onTabClick: (tab: number | 'general') => void;
  onClarificationClick: (item: Clarification) => void;
}> = ({
  clarifications,
  selectedClarifications,
  problem,
  open,
  onTabClick,
  onClarificationClick,
}) => {
  const { profile } = rootStore;
  const unseenMessagesCount = clarifications.reduce(
    (prev, curr) => prev + countUnseenMessages(curr, profile!),
    0
  );

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => onTabClick(problem?.problem.id ?? 'general')}
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDownIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
          {problem ? `${problem.shortName} - ${problem.problem.name}` : 'General'}
        </div>
        {unseenMessagesCount > 0 && (
          <div className="text-sm text-white px-2 py-0.5 rounded-md bg-purple-500 float-right">
            {unseenMessagesCount}
          </div>
        )}
      </div>
      {!clarifications.length ? (
        <div className="ml-5 text-sm text-gray-500">No Discussions</div>
      ) : (
        open &&
        clarifications.map((clarification) => (
          <ClarificationTab
            key={clarification.id}
            clarification={clarification}
            active={clarification.id === selectedClarifications?.id}
            onClick={onClarificationClick}
          />
        ))
      )}
    </div>
  );
};

const ClarificationTab: React.FC<{
  clarification: Clarification;
  active: boolean;
  onClick: (item: Clarification) => void;
}> = ({ clarification, active, onClick }) => {
  const { profile } = rootStore;
  const unseenMessagesCount = countUnseenMessages(clarification, profile!);

  return (
    <div
      className={classNames(
        'ml-5 p-2 shadow rounded-lg cursor-pointer border dark:border-gray-600 dark:hover:bg-gray-700 truncate',
        {
          'bg-gray-200 dark:bg-gray-700': active,
        }
      )}
      title={clarification.team?.name ?? 'Broadcast'}
      onClick={() => onClick(clarification)}
    >
      {clarification.team?.name ?? 'Broadcast'}
      {unseenMessagesCount > 0 && (
        <div className="text-sm text-white px-2 py-0.5 rounded-md bg-green-500 float-right">
          {unseenMessagesCount}
        </div>
      )}
    </div>
  );
};
