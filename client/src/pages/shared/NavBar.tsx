import classNames from 'classnames';
import React, { useState } from 'react';

type NavItem = {
  content: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};

type Props = {
  logo?: React.ReactNode;
  leftItems?: NavItem[];
  rightItems?: NavItem[];
};

const NavBar: React.FC<Props> = ({ logo, leftItems, rightItems }) => {
  const [visibleMenu, setVisibleMenu] = useState(false);

  const MenuItems = ({ items }: { items?: NavItem[] }) => (
    <>
      {items?.map(({ content, active, onClick }, index) => (
        <div
          className={classNames('px-3 py-2 rounded-md font-medium cursor-pointer', {
            'bg-gray-900 text-white': active,
            'text-gray-300 hover:bg-gray-700 hover:text-white': !active,
          })}
          key={`item-${index}`}
          onClick={onClick}
        >
          {content}
        </div>
      ))}
    </>
  );

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center sm:hidden">
            <div
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setVisibleMenu(!visibleMenu)}
            >
              {!visibleMenu && (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    stroke="currentColor"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
              {visibleMenu && (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    stroke="currentColor"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center sm:justify-start">
            {logo}
            <div className="hidden sm:flex space-x-4 sm:ml-6">
              <MenuItems items={leftItems} />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm-pr-0">
            <MenuItems items={rightItems} />
          </div>
        </div>
      </div>
      {visibleMenu && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
          <MenuItems items={leftItems} />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
