import React from 'react';

import Tooltip from './tooltip/Tooltip';

type Action = {
  label: string;
  visible?: boolean;
  icon: React.FC<React.ComponentProps<'svg'>>;
  onClick: () => void;
};

type Props = {
  header: string;
  actions?: Action[];
};

const HeaderActionBar: React.FC<Props> = ({ header, actions }) => {
  return (
    <div
      className="flex w-full items-center justify-between rounded-md bg-white px-4 py-2 shadow dark:bg-gray-800"
      test-id="data-table-action-bar"
    >
      <div className="text-xl font-medium">{header}</div>
      <div className="flex items-center space-x-2">
        {actions?.map(
          ({ label, visible = true, icon: Icon, onClick }) =>
            visible && (
              <Tooltip key={label} content={label}>
                <div
                  className="cursor-pointer rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={onClick}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </Tooltip>
            ),
        )}
      </div>
    </div>
  );
};

export default HeaderActionBar;
