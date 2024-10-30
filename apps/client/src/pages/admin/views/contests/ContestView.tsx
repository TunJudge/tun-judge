import { GraduationCapIcon } from 'lucide-react';
import { FC } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { Flex, Tabs } from 'tw-react-components';

import { PageTemplate } from '@core/components';
import { useFindFirstContest } from '@core/queries';

export const ContestView: FC = () => {
  const location = useLocation();
  const { contestId } = useParams();
  const currentTab = location.pathname.split('/')[3];

  const { data: contest } = useFindFirstContest({ where: { id: parseInt(contestId ?? '-1') } });

  return (
    <Tabs className="h-full w-full" value={currentTab}>
      <PageTemplate
        bodyClassName={currentTab === 'clarifications' ? 'p-0' : ''}
        icon={GraduationCapIcon}
        title={
          <Flex align="center" justify="between" fullWidth>
            {contest?.name}
            <Tabs.List className="ml-2 w-fit text-sm [&>button]:h-7">
              <Link to={`/contests/${contestId}/submissions`}>
                <Tabs.Trigger value="submissions">Submissions</Tabs.Trigger>
              </Link>
              <Link to={`/contests/${contestId}/clarifications`}>
                <Tabs.Trigger value="clarifications">Clarifications</Tabs.Trigger>
              </Link>
              <Link to={`/contests/${contestId}/scoreboard`}>
                <Tabs.Trigger value="scoreboard">Scoreboard</Tabs.Trigger>
              </Link>
            </Tabs.List>
          </Flex>
        }
        headerBottomBorder
      >
        <Outlet />
      </PageTemplate>
    </Tabs>
  );
};
