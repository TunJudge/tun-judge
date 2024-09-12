import { RefreshIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';

import { ClarificationsStore } from '@core/stores/ClarificationsStore';
import { PublicStore } from '@core/stores/PublicStore';
import { RootStore } from '@core/stores/RootStore';
import { useStore } from '@core/stores/useStore';

import HeaderActionBar from '@shared/HeaderActionBar';
import { NoActiveContest } from '@shared/NoActiveContest';
import ChatBox from '@shared/chat-box/ChatBox';

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
    <div className="flex flex-col dark:text-white h-full overflow-hidden">
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
      <div className="flex h-full p-4 gap-4 overflow-hidden">
        <ClarificationsSidebar />
        <div className="w-full p-4 bg-white shadow-md rounded-md dark:bg-gray-800">
          <ChatBox item={item} isOpen onClose={() => false} onSubmit={() => false} />
        </div>
      </div>
    </div>
  );
});

export default ClarificationsList;
