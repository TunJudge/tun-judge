import { FC, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Flex } from 'tw-react-components';

import { useFindFirstContest, useFindManyClarification } from '@core/queries';

import { ClarificationGroupTab } from './ClarificationGroupTab';

export const ClarificationsSidebar: FC = () => {
  const { contestId } = useParams();

  const [tabStatus, setTabStatus] = useState<Record<number | 'general', boolean>>({
    general: false,
  });

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

  const flipTabStatus = (tab: number | 'general') => () =>
    setTabStatus((tabStatus) => ({ ...tabStatus, [tab]: !tabStatus[tab] }));

  return (
    <Flex className="w-96 overflow-auto p-3" direction="column" fullHeight>
      <Link to={`/contests/${contestId}/clarifications/new`}>
        <Button className="w-full" color="blue">
          New Clarification
        </Button>
      </Link>
      <ClarificationGroupTab
        clarifications={clarifications.filter((clarification) => clarification.general)}
        open={tabStatus.general}
        onTabClick={flipTabStatus('general')}
      />
      {contest?.problems.map((contestProblem) => (
        <ClarificationGroupTab
          key={contestProblem.id}
          clarifications={clarifications.filter(
            (clarification) => clarification.problemId === contestProblem.id,
          )}
          problem={contestProblem}
          open={tabStatus[contestProblem.problem.id]}
          onTabClick={flipTabStatus(contestProblem.problem.id)}
        />
      ))}
    </Flex>
  );
};
