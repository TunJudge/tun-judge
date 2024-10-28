import { MessagesSquareIcon, PresentationIcon, SendIcon, StarsIcon } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu, Flex, Sidebar, useSidebar } from 'tw-react-components';

import { useFindManyContest } from '@core/queries';

export const ContestsSection: FC = () => {
  const { isMobile } = useSidebar();
  const [now, setNow] = useState(new Date());

  const { data: contests } = useFindManyContest({
    where: {
      enabled: true,
      activateTime: { lte: now },
    },
    select: { id: true, name: true, scoreCaches: { select: { restrictedPending: true } } },
    orderBy: { activateTime: 'asc' },
  });

  useEffect(() => {
    if (import.meta.env.MODE === 'development') return;

    const interval = setInterval(() => {
      setNow(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel>Active Contests</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {contests?.map((contest) => {
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
