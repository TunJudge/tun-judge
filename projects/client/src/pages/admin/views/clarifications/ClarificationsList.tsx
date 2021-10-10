import { RefreshIcon } from '@heroicons/react/outline';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { rootStore } from '../../../../core/stores/RootStore';
import ChatBox from '../../../shared/chat-box/ChatBox';
import HeaderActionBar from '../../../shared/HeaderActionBar';
import { NoActiveContest } from '../../../shared/NoActiveContest';
import ClarificationsSidebar from './ClarificationsSidebar';

const ClarificationsList: React.FC = observer(() => {
  const {
    updatesCount: { clarifications },
    publicStore: { currentContest },
    clarificationsStore: { item, fetchAllForContest },
  } = rootStore;

  useEffect(() => {
    if (currentContest) {
      fetchAllForContest(currentContest.id);
    }
  }, [currentContest, clarifications, fetchAllForContest]);

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
        <div className="w-full p-4 bg-white shadow-md rounded-md dark:bg-gray-800 dark:border-gray-700">
          <ChatBox item={item} isOpen onClose={() => false} onSubmit={() => false} />
        </div>
      </div>
    </div>
  );
});

export default ClarificationsList;
