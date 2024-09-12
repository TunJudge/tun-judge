import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { ClarificationsStore, PublicStore, useStore } from '@core/stores';

import ClarificationGroupTab from './ClarificationGroupTab';

const ClarificationsSidebar: React.FC = observer(() => {
  const { data, item, setItem } = useStore<ClarificationsStore>('clarificationsStore');
  const { currentContest } = useStore<PublicStore>('publicStore');

  const [tabStatus, setTabStatus] = useState<Record<number | 'general', boolean>>({
    general: false,
  });

  useEffect(() => {
    if (currentContest) {
      currentContest.problems.forEach((cp) =>
        setTabStatus((tabStatus) => ({ ...tabStatus, [cp.problem.id]: false }))
      );
    }
  }, [currentContest]);

  const flipTabStatus = (tab: number | 'general') => () =>
    setTabStatus((tabStatus) => ({ ...tabStatus, [tab]: !tabStatus[tab] }));

  return (
    <div className="w-96 p-4 bg-white shadow-md rounded-md overflow-auto dark:bg-gray-800">
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
        {currentContest!.problems.map((contestProblem) => {
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
  );
});

export default ClarificationsSidebar;
