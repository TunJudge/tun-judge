import classNames from 'classnames';
import React from 'react';

import { countUnseenMessages } from '@core/helpers';
import { Clarification } from '@core/models';
import { RootStore, useStore } from '@core/stores';

type Props = {
  clarification: Clarification;
  active: boolean;
  onClick: (item: Clarification) => void;
};

const ClarificationTab: React.FC<Props> = ({ clarification, active, onClick }) => {
  const { profile } = useStore<RootStore>('rootStore');

  const unseenMessagesCount = countUnseenMessages(clarification, profile!);

  return (
    <div
      className={classNames(
        'ml-5 cursor-pointer truncate rounded-lg border p-2 shadow dark:border-gray-600 dark:hover:bg-gray-700',
        {
          'bg-gray-200 dark:bg-gray-700': active,
        },
      )}
      title={clarification.team?.name ?? 'Broadcast'}
      onClick={() => onClick(clarification)}
    >
      <span className="text-gray-500">({clarification.id}) </span>
      {clarification.team?.name ?? 'Broadcast'}
      {unseenMessagesCount > 0 && (
        <div className="float-right rounded-md bg-green-500 px-2 py-0.5 text-sm text-white">
          {unseenMessagesCount}
        </div>
      )}
    </div>
  );
};

export default ClarificationTab;
