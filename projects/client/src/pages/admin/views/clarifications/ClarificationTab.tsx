import classNames from 'classnames';
import React from 'react';
import { countUnseenMessages } from '../../../../core/helpers';
import { Clarification } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';

type Props = {
  clarification: Clarification;
  active: boolean;
  onClick: (item: Clarification) => void;
};

const ClarificationTab: React.FC<Props> = ({ clarification, active, onClick }) => {
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
      <span className="text-gray-500">({clarification.id}) </span>
      {clarification.team?.name ?? 'Broadcast'}
      {unseenMessagesCount > 0 && (
        <div className="text-sm text-white px-2 py-0.5 rounded-md bg-green-500 float-right">
          {unseenMessagesCount}
        </div>
      )}
    </div>
  );
};

export default ClarificationTab;
