import { PlusIcon, RefreshIcon } from '@heroicons/react/solid';
import React from 'react';
import Tooltip from '../tooltip/Tooltip';

type Props = {
  header: string;
  canAdd: boolean;
  onAdd: () => void;
  onRefresh?: () => void;
};

const DataTableActionBar: React.FC<Props> = ({ header, canAdd, onAdd, onRefresh }) => {
  return (
    <div className="flex items-center shadow rounded-md w-full justify-between px-4 py-2 bg-white dark:bg-gray-800">
      <div className="text-xl">{header}</div>
      <div className="flex items-center space-x-2">
        {onRefresh && (
          <Tooltip content="Refresh">
            <div
              className="hover:bg-gray-200 rounded-md p-2 cursor-pointer dark:hover:bg-gray-700"
              onClick={onRefresh}
            >
              <RefreshIcon className="w-6 h-6" />
            </div>
          </Tooltip>
        )}
        {canAdd && (
          <Tooltip content="Add">
            <div
              className="hover:bg-gray-200 rounded-md p-2 cursor-pointer dark:hover:bg-gray-700"
              onClick={onAdd}
            >
              <PlusIcon className="w-6 h-6" />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default DataTableActionBar;
