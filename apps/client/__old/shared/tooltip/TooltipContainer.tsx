import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';

import { RootStore, useStore } from '@core/stores';

const TooltipContainer: React.FC = observer(() => {
  const {
    tooltipStore: { tooltip },
    appLocalCache,
  } = useStore<RootStore>('rootStore');

  return (
    <>
      {tooltip && !tooltip.forceHide && (
        <div
          className="fixed z-50"
          style={{
            pointerEvents: 'none',
            top: tooltip.parent.top,
            left: tooltip.parent.left,
            height: tooltip.parent.height,
            width: tooltip.parent.width,
          }}
        >
          <div
            className={classNames(
              'absolute z-50 text-base font-normal',
              {
                'bottom-full left-1/2 -translate-x-1/2 transform': tooltip.position === 'top',
                'right-full top-1/2 -translate-y-1/2 transform': tooltip.position === 'left',
                'left-1/2 top-full -translate-x-1/2 transform': tooltip.position === 'bottom',
                'left-full top-1/2 -translate-y-1/2 transform': tooltip.position === 'right',
              },
              tooltip.className,
            )}
          >
            <div
              className={classNames('flex items-center', {
                'flex-col-reverse': tooltip.position === 'top',
                'flex-row-reverse': tooltip.position === 'left',
                'flex-col': tooltip.position === 'bottom',
                'flex-row': tooltip.position === 'right',
              })}
            >
              <svg
                className={classNames('z-10 h-4 w-4 transform text-white dark:text-gray-900', {
                  '-mt-px -rotate-90': tooltip.position === 'top',
                  '-ml-px rotate-180': tooltip.position === 'left',
                  '-mb-px rotate-90': tooltip.position === 'bottom',
                  '-mr-px rotate-0': tooltip.position === 'right',
                })}
                viewBox="0 0 100 100"
                stroke={appLocalCache.darkMode ? '#374151' : '#E5E7EB'}
              >
                <path
                  d="M 50,50 100,0 100,100 Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="8"
                  fill="currentColor"
                />
              </svg>
              <div className="min-w-max rounded-md border bg-white px-4 py-2 shadow dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                {tooltip.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default TooltipContainer;
