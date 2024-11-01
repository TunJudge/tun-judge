import { SendIcon } from 'lucide-react';
import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Sidebar } from 'tw-react-components';

import { useFindFirstContest, useFindManyClarification } from '@core/queries';

import { ClarificationGroupTab } from './ClarificationGroupTab';

export const ClarificationsSidebar: FC = () => {
  const { contestId } = useParams();

  const { data: contest } = useFindFirstContest({
    where: { id: parseInt(contestId ?? '-1') },
    include: { problems: { include: { problem: true } } },
  });

  const { data: clarifications = [] } = useFindManyClarification(
    {
      where: { contestId: parseInt(contestId ?? '-1') },
      include: {
        team: true,
        problem: { include: { problem: true } },
        messages: { include: { sentBy: true, seenBy: true } },
      },
    },
    { enabled: !!contestId },
  );

  return (
    <Sidebar className="[--sidebar-width:250px]" collapsible="none">
      <Sidebar.Header>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Link to={`/contests/${contestId}/clarifications/new`}>
              <Sidebar.MenuButton asChild>
                <Button
                  className="text-md h-9 w-full justify-center"
                  color="blue"
                  prefixIcon={SendIcon}
                >
                  New Clarification
                </Button>
              </Sidebar.MenuButton>
            </Link>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>
      <Sidebar.Content className="gap-0">
        <ClarificationGroupTab
          clarifications={clarifications.filter((clarification) => clarification.general)}
        />
        {contest?.problems
          .sort((a, b) => a.shortName.localeCompare(b.shortName))
          .map((contestProblem) => (
            <ClarificationGroupTab
              key={contestProblem.id}
              clarifications={clarifications.filter(
                (clarification) => clarification.problemId === contestProblem.id,
              )}
              problem={contestProblem}
            />
          ))}
      </Sidebar.Content>
    </Sidebar>
  );
};
