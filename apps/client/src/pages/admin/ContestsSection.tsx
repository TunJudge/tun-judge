import { MessagesSquareIcon, PresentationIcon, SendIcon, StarsIcon } from 'lucide-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu, Flex, Sidebar, useSidebar } from 'tw-react-components';

import { useActiveContest } from '@core/contexts';

export const ContestsSection: FC = () => {
  const { isMobile } = useSidebar();

  const { activeContests } = useActiveContest();

  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel>Active Contests</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {activeContests.map((contest) => {
            const totalPendingSubmissions = contest.scoreCaches.reduce(
              (acc, { restrictedPending }) => acc + restrictedPending,
              0,
            );

            return (
              <DropdownMenu key={contest.id}>
                <Sidebar.MenuItem>
                  <DropdownMenu.Trigger asChild>
                    <Sidebar.MenuButton>
                      <StarsIcon />
                      {contest.name}
                      {totalPendingSubmissions > 0 && (
                        <Flex
                          className="ml-auto h-5 w-5 rounded bg-orange-500"
                          align="center"
                          justify="center"
                        >
                          {totalPendingSubmissions}
                        </Flex>
                      )}
                    </Sidebar.MenuButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    className="min-w-56 rounded-lg text-sm"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <Link to={`/contests/${contest.id}/submissions`}>
                      <DropdownMenu.Item className="cursor-pointer">
                        <DropdownMenu.Icon icon={SendIcon} />
                        Submissions
                      </DropdownMenu.Item>
                    </Link>
                    <Link to={`/contests/${contest.id}/clarifications`}>
                      <DropdownMenu.Item className="cursor-pointer">
                        <DropdownMenu.Icon icon={MessagesSquareIcon} />
                        Clarifications
                      </DropdownMenu.Item>
                    </Link>
                    <Link to={`/contests/${contest.id}/scoreboard`}>
                      <DropdownMenu.Item className="cursor-pointer">
                        <DropdownMenu.Icon icon={PresentationIcon} />
                        Scoreboard
                      </DropdownMenu.Item>
                    </Link>
                  </DropdownMenu.Content>
                </Sidebar.MenuItem>
              </DropdownMenu>
            );
          })}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
};
