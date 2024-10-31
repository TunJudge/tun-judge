import { GraduationCapIcon } from 'lucide-react';
import { FC } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { Flex, Tabs } from 'tw-react-components';

import { PageTemplate } from '@core/components';
import { useFindFirstContest } from '@core/queries';

export const ContestView: FC = () => {
  const location = useLocation();
  const { contestId } = useParams();
  const currentTab = location.pathname.split('/')[3] ?? '';

  const { data: contest } = useFindFirstContest(
    { where: { id: parseInt(contestId ?? '-1') } },
    { enabled: contestId !== undefined && contestId !== 'new' },
  );

  return (
    <Tabs className="h-full w-full" value={currentTab}>
      <PageTemplate
        bodyClassName={currentTab === 'clarifications' ? 'p-0' : ''}
        icon={GraduationCapIcon}
        breadcrumbs={[{ title: 'Contests', to: '/contests' }]}
        title={
          <Flex align="center" justify="between" fullWidth>
            {contest?.name ?? 'New Contest'}
            {contestId !== 'new' && (
              <Tabs.List className="ml-2 w-fit text-base [&>button]:h-7">
                <Link to={`/contests/${contestId}/edit`}>
                  <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
                </Link>
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
            )}
          </Flex>
        }
        headerBottomBorder
      >
        <Outlet />
      </PageTemplate>
    </Tabs>
  );
};
