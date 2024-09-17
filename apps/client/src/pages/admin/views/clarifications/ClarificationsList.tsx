import { RefreshIcon } from '@heroicons/react/outline';
import HeaderActionBar from '@shared/HeaderActionBar';
import { NoActiveContest } from '@shared/NoActiveContest';
import ChatBox from '@shared/chat-box/ChatBox';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';

import { ClarificationsStore } from '@core/stores/ClarificationsStore';
import { PublicStore } from '@core/stores/PublicStore';
import { RootStore } from '@core/stores/RootStore';
import { useStore } from '@core/stores/useStore';

import ClarificationsSidebar from './ClarificationsSidebar';

const ClarificationsList: React.FC = observer(() => {
  const { updatesCount } = useStore<RootStore>('rootStore');
  const { currentContest } = useStore<PublicStore>('publicStore');
  const { item, fetchAllForContest } = useStore<ClarificationsStore>('clarificationsStore');

  useEffect(() => {
    if (currentContest) {
      fetchAllForContest(currentContest.id);
    }
  }, [currentContest, updatesCount.clarifications, fetchAllForContest]);

  return !currentContest ? (
    <NoActiveContest />
  ) : (
    <div className="flex h-full flex-col overflow-hidden dark:text-white">
      <div className="p-4 pb-0">
        <HeaderActionBar
          header="Clarifications"
          actions={[
            {
              label: 'Refresh',
              icon: RefreshIcon,
              onClick: () => fetchAllForContest(currentContest.id),
            },
          ]}
        />
      </div>
      <div className="flex h-full gap-4 overflow-hidden p-4">
        <ClarificationsSidebar />
        <div className="w-full rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
          <ChatBox item={item} isOpen onClose={() => false} onSubmit={() => false} />
        </div>
      </div>
    </div>
  );
});

export default ClarificationsList;
