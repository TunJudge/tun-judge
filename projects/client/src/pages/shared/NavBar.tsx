import classNames from 'classnames';
import React, { useState } from 'react';

type NavItem = {
  content: React.ReactNode;
  className?: string;
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
      {items?.map(({ content, className, active, onClick }, index) => (
        <div
          className={classNames(
            className,
            'flex items-center lg:justify-center lg:text-center px-3 py-2 rounded-md font-medium cursor-pointer',
            {
              'bg-gray-900 text-white': active,
              'text-gray-300 hover:bg-gray-700 hover:text-white': !active,
            }
          )}
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
      <div className="max-w-7xl mx-auto px-2 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center lg:hidden mr-2">
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
          <div className="flex-1 flex items-center justify-start">
            {logo}
            <div className="hidden lg:flex gap-x-4 lg:ml-6">
              <MenuItems items={leftItems} />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex gap-x-4 items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
            <MenuItems items={rightItems} />
          </div>
        </div>
      </div>
      {visibleMenu && (
        <div className="lg:hidden px-2 pt-2 pb-3 space-y-1">
          <MenuItems items={leftItems} />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
