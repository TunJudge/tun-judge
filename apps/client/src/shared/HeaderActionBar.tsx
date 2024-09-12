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
      className="flex items-center shadow rounded-md w-full justify-between px-4 py-2 bg-white dark:bg-gray-800"
      test-id="data-table-action-bar"
    >
      <div className="text-xl font-medium">{header}</div>
      <div className="flex items-center space-x-2">
        {actions?.map(
          ({ label, visible = true, icon: Icon, onClick }) =>
            visible && (
              <Tooltip key={label} content={label}>
                <div
                  className="hover:bg-gray-200 rounded-md p-2 cursor-pointer dark:hover:bg-gray-700"
                  onClick={onClick}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </Tooltip>
            )
        )}
      </div>
    </div>
  );
};

export default HeaderActionBar;
