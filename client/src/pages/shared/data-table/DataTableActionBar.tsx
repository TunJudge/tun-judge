import { PlusIcon, RefreshIcon } from '@heroicons/react/solid';
import React from 'react';

type Props = {
  header: string;
  canAdd: boolean;
  onAdd: () => void;
  onRefresh?: () => void;
};

const DataTableActionBar: React.FC<Props> = ({ header, canAdd, onAdd, onRefresh }) => {
  return (
    <div className="flex items-center shadow rounded-md border w-full justify-between mb-4 p-2 bg-white">
      <div className="text-xl mx-2">{header}</div>
      <div className="flex items-center mr-2 space-x-2">
        {onRefresh && (
          <div className="hover:bg-gray-200 rounded-md p-2" onClick={onRefresh}>
            <RefreshIcon className="w-6 h-6" />
          </div>
        )}
        {canAdd && (
          <div className="hover:bg-gray-200 rounded-md p-2" onClick={onAdd}>
            <PlusIcon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTableActionBar;
