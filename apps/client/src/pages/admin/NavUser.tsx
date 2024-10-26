import {
  BrushIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu, Sidebar, useLayoutContext, useSidebar } from 'tw-react-components';

import { useAuthContext } from '@core/contexts';

export const NavUser: FC = () => {
  const { profile } = useAuthContext();
  const { theme, setTheme } = useLayoutContext();
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Sidebar.MenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-auto"
        >
          <img
            className="h-8 w-8 rounded-lg"
            src={`https://ui-avatars.com/api/?name=${profile?.name ?? '-'}`}
            alt={profile?.name}
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{profile?.name}</span>
            <span className="truncate text-xs">{profile?.email}</span>
          </div>
          <ChevronsUpDownIcon className="ml-auto size-4" />
        </Sidebar.MenuButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg text-sm"
        side={isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Label className="flex items-center gap-2 p-1.5 text-left">
          <img
            className="h-8 w-8 rounded-lg"
            src={`https://ui-avatars.com/api/?name=${profile?.name ?? '-'}`}
            alt={profile?.name}
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{profile?.name}</span>
            <span className="truncate text-xs">{profile?.email}</span>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <DropdownMenu.Icon icon={BrushIcon} />
              Theme
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent className="text-sm">
                {(['light', 'dark', 'system'] as const).map((item) => (
                  <DropdownMenu.Item
                    key={item}
                    className="capitalize"
                    onClick={() => setTheme(item)}
                  >
                    <DropdownMenu.Icon
                      icon={item === 'light' ? SunIcon : item === 'dark' ? MoonIcon : MonitorIcon}
                    />
                    {item}
                    {theme === item && <DropdownMenu.Icon className="ml-auto" icon={CheckIcon} />}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
          <Link className="flex w-full items-center gap-2" to="logout">
            <DropdownMenu.Item className="w-full cursor-pointer">
              <DropdownMenu.Icon icon={LogOutIcon} />
              Logout
            </DropdownMenu.Item>
          </Link>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
