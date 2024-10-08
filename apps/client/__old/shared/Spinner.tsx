import classNames from 'classnames';
import React from 'react';

type Props = { className?: string; fullScreen?: boolean };

const Spinner: React.FC<Props> = ({ className, fullScreen }) => (
  <div
    className={classNames(
      className,
      'flex h-full w-full items-center justify-center bg-white dark:bg-gray-800',
      {
        'h-screen': fullScreen,
      },
    )}
  >
    <svg
      className="h-8 w-8 animate-spin text-black dark:text-white"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);

export default Spinner;
