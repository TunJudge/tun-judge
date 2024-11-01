import { EyeIcon, SendIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { Button, DataTable, DataTableColumn, Flex } from 'tw-react-components';

import { ChatBoxDialog, Clarification, PageTemplate } from '@core/components';
import { useActiveContest, useAuthContext } from '@core/contexts';
import { useFindManyClarification } from '@core/queries';
import { countUnseenMessages } from '@core/utils';

export const ClarificationsList: FC<{ className?: string }> = ({ className }) => {
  const { profile } = useAuthContext();
  const { currentContest } = useActiveContest();

  const [clarificationId, setClarificationId] = useState<number>();

  const { data: clarifications = [] } = useFindManyClarification(
    {
      include: {
        team: true,
        problem: { include: { problem: true } },
        messages: { include: { sentBy: true, seenBy: true } },
      },
      orderBy: { id: 'desc' },
    },
    { refetchInterval: import.meta.env.MODE !== 'development' && 5000 },
  );

  const columns: DataTableColumn<Clarification>[] = [
    {
      header: '#',
      field: 'id',
      className: 'w-px',
      align: 'center',
    },
    {
      header: 'Subject',
      field: 'problemId',
      render: (clarification) => {
        const unseenMessagesCount = profile ? countUnseenMessages(clarification, profile) : 0;

        return (
          <Flex fullWidth>
            {clarification.general || !clarification.problemId
              ? 'General'
              : `Problem ${
                  currentContest?.problems?.find(
                    (problem) => problem.id === clarification.problemId,
                  )?.shortName ?? '-'
                }`}
            {unseenMessagesCount > 0 && (
              <div className="float-right rounded-md bg-green-500 px-2 py-0.5 text-sm text-white">
                {unseenMessagesCount}
              </div>
            )}
          </Flex>
        );
      },
    },
  ];

  return (
    <PageTemplate
      className={className}
      title="Clarifications"
      actions={<Button size="small" prefixIcon={SendIcon} onClick={() => setClarificationId(-1)} />}
      isSubSection
    >
      <DataTable
        rows={clarifications}
        columns={columns}
        onRowClick={(clarification) => setClarificationId(clarification.id)}
        actions={[
          {
            icon: EyeIcon,
            onClick: (clarification) => setClarificationId(clarification.id),
          },
        ]}
      />
      <ChatBoxDialog
        clarificationId={clarificationId}
        onClose={() => setClarificationId(undefined)}
      />
    </PageTemplate>
  );
};
