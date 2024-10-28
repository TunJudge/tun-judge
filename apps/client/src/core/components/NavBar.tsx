import React, { Fragment, useState } from 'react';
import { Button, cn } from 'tw-react-components';

type NavItem = { hide?: boolean } & (
  | {
      type?: 'item';
      content: React.ReactNode;
      className?: string;
      testId?: string;
      onClick?: () => void;
      active?: boolean;
    }
  | {
      type: 'element';
      element: React.ReactNode;
    }
);

type Props = {
  logo?: React.ReactNode;
  leftItems?: NavItem[];
  rightItems?: NavItem[];
};

export const NavBar: React.FC<Props> = ({ logo, leftItems, rightItems }) => {
  const [visibleMenu, setVisibleMenu] = useState(false);

  const MenuItems = ({ items }: { items?: NavItem[] }) =>
    items
      ?.filter((item) => !item.hide)
      .map((props, index) =>
        props.type === 'element' ? (
          <Fragment key={`element-${index}`}>{props.element}</Fragment>
        ) : (
          <Button
            key={`item-${index}`}
            className={cn(
              'bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 active:bg-slate-900',
              props.active && '!bg-slate-900',
              props.className,
            )}
            test-id={props.testId}
            onClick={props.onClick}
          >
            {props.content}
          </Button>
        ),
      );

  return (
    <nav className="w-full bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-2 md:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="mr-2 flex items-center md:hidden">
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
            <div className="hidden gap-3 md:ml-6 md:flex">
              <MenuItems items={leftItems} />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center gap-3 pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
            <MenuItems items={rightItems} />
          </div>
        </div>
      </div>
      {visibleMenu && (
        <div className="space-y-1 px-2 pb-3 pt-2 md:hidden">
          <MenuItems items={leftItems} />
        </div>
      )}
    </nav>
  );
};
