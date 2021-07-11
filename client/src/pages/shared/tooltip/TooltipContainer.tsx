import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { rootStore } from '../../../core/stores/RootStore';

const TooltipContainer: React.FC = observer(() => {
  const { tooltip } = rootStore.tooltipStore;

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
              'absolute text-base font-normal z-50',
              {
                'transform -translate-x-1/2 left-1/2 bottom-full': tooltip.position === 'top',
                'transform -translate-y-1/2 top-1/2 right-full': tooltip.position === 'left',
                'transform -translate-x-1/2 left-1/2 top-full': tooltip.position === 'bottom',
                'transform -translate-y-1/2 top-1/2 left-full': tooltip.position === 'right',
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
                className={classNames('transform h-4 w-4 z-10 text-white dark:text-gray-900', {
                  '-rotate-90 -mt-px': tooltip.position === 'top',
                  'rotate-180 -ml-px': tooltip.position === 'left',
                  'rotate-90 -mb-px': tooltip.position === 'bottom',
                  'rotate-0 -mr-px': tooltip.position === 'right',
                })}
                viewBox="0 0 100 100"
                stroke={rootStore.appLocalCache.darkMode ? '#374151' : '#E5E7EB'}
              >
                <path
                  d="M 50,50 100,0 100,100 Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="8"
                  fill="currentColor"
                />
              </svg>
              <div className="min-w-max px-4 py-2 border shadow rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white">
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
