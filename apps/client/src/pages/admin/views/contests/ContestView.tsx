import { GraduationCapIcon } from 'lucide-react';
import { FC } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Flex, Tabs } from 'tw-react-components';

import { PageTemplate } from '@core/components';
import { useFindFirstContest } from '@models';

export const ContestView: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: contestId } = useParams();
  const currentTab = location.pathname.split('/').pop();

  const { data: contest } = useFindFirstContest({ where: { id: parseInt(contestId ?? '-1') } });

  return (
    <Tabs className="w-full" value={currentTab} onValueChange={(tab) => navigate(tab)}>
      <PageTemplate
        icon={GraduationCapIcon}
        title={
          <Flex align="center" justify="between" fullWidth>
            {contest?.name}
            <Tabs.List className="ml-2 w-fit text-sm [&>button]:h-6">
              <Tabs.Trigger value="submissions">Submissions</Tabs.Trigger>
              <Tabs.Trigger value="clarifications">Clarifications</Tabs.Trigger>
              <Tabs.Trigger value="scoreboard">Scoreboard</Tabs.Trigger>
            </Tabs.List>
          </Flex>
        }
      >
        <Outlet />
      </PageTemplate>
    </Tabs>
  );
};
