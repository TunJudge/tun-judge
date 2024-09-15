import React, { useState } from 'react';
import { cn } from 'tw-react-components';

type NavItem = {
  content: React.ReactNode;
  className?: string;
  testId?: string;
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

  const MenuItems = ({ items }: { items?: NavItem[] }) =>
    items?.map(({ content, className, testId, active, onClick }, index) => (
      <div
        key={`item-${index}`}
        className={cn(
          'flex cursor-pointer items-center rounded-md px-3 py-2 font-medium lg:justify-center lg:text-center',
          {
            'bg-gray-900 text-white': active,
            'text-gray-300 hover:bg-gray-700 hover:text-white': !active,
          },
          className,
        )}
        test-id={testId}
        onClick={onClick}
      >
        {content}
      </div>
    ));

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="mr-2 flex items-center lg:hidden">
            <div
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-inset focus:ring-white"
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
          <div className="flex flex-1 items-center justify-start">
            {logo}
            <div className="hidden gap-x-4 lg:ml-6 lg:flex">
              <MenuItems items={leftItems} />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center gap-x-4 pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
            <MenuItems items={rightItems} />
          </div>
        </div>
      </div>
      {visibleMenu && (
        <div className="space-y-1 px-2 pb-3 pt-2 lg:hidden">
          <MenuItems items={leftItems} />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
