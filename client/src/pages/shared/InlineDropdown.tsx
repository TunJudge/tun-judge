import classNames from 'classnames';
import React, { useState } from 'react';

type DropdownItem = {
  content: React.ReactNode;
  onClick?: () => void;
};

type Props = {
  className?: string;
  header?: string;
  content: React.ReactNode;
  items: DropdownItem[];
};

const InlineDropdown: React.FC<Props> = ({ className, header, content, items }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className={classNames('relative inline-block', className)}>
      <div
        className="inline-flex justify-center w-full cursor-pointer items-center"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {content}
      </div>
      <div
        role="menu"
        tabIndex={-1}
        className={classNames(
          'z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5',
          {
            hidden: !dropdownOpen,
          },
        )}
        onBlur={() => setDropdownOpen(false)}
      >
        {header && (
          <div
            className="select-none text-center font-bold text-gray-700 block p-2 bg-gray-100"
            role="menuitem"
            tabIndex={-1}
          >
            {header}
          </div>
        )}
        <div className="py-1" role="none">
          {items.map(({ content, onClick }, index) => (
            <div
              key={index}
              className="text-gray-700 hover:bg-gray-100 block px-4 py-2 cursor-pointer"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                onClick?.();
                setDropdownOpen(false);
              }}
            >
              {content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InlineDropdown;
