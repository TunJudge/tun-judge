import { RefreshCcw, ServerIcon, Trash2Icon } from 'lucide-react';
import { FC, useState } from 'react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  DataTableColumn,
  Switch,
  useLayoutContext,
} from 'tw-react-components';

import { PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useSorting } from '@core/hooks';
import { Prisma } from '@core/prisma';
import { useDeleteJudgeHost, useFindManyJudgeHost, useUpdateJudgeHost } from '@core/queries';
import { getDisplayDate } from '@core/utils';

import { JudgeHostLogsViewer } from './JudgeHostLogsViewer';

type JudgeHost = Prisma.JudgeHostGetPayload<{
  include: { user: true };
}>;

export const JudgeHostsList: FC = () => {
  const { showIds } = useLayoutContext();
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [hostname, setHostname] = useState<string>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const { orderBy, sorting, setSorting } = useSorting<JudgeHost>('hostname');

  const {
    data: judgeHosts = [],
    isLoading,
    refetch,
  } = useFindManyJudgeHost({ include: { user: true }, orderBy }, { refetchInterval: 5000 });
  const { mutateAsync: updateJudgeHost } = useUpdateJudgeHost();
  const { mutateAsync: deleteJudgeHost } = useDeleteJudgeHost();

  const columns: DataTableColumn<JudgeHost>[] = [
    {
      header: '#',
      field: 'id',
      className: 'w-px',
      align: 'center',
      hide: !showIds,
    },
    {
      header: 'Hostname',
      field: 'hostname',
    },
    {
      header: 'User',
      field: 'user',
      render: (judgeHost) => judgeHost.user?.username ?? '-',
    },
    {
      header: 'Poll Time',
      field: 'pollTime',
      render: (judgeHost) => (judgeHost.pollTime ? getDisplayDate(judgeHost.pollTime) : '-'),
    },
    {
      header: 'Active',
      field: 'active',
      align: 'center',
      render: (judgeHost) =>
        isUserAdmin ? (
          <Switch
            checked={judgeHost.active}
            onClick={() =>
              updateJudgeHost({ where: { id: judgeHost.id }, data: { active: !judgeHost.active } })
            }
          />
        ) : judgeHost.active ? (
          'Yes'
        ) : (
          'No'
        ),
    },
    {
      header: 'Live Logs',
      field: 'id',
      align: 'center',
      render: (judgeHost) => (
        <Button onClick={() => setHostname(judgeHost.hostname)} disabled={!judgeHost.active}>
          Logs
        </Button>
      ),
    },
  ];

  return (
    <PageTemplate
      icon={ServerIcon}
      title="JudgeHosts"
      actions={<Button prefixIcon={RefreshCcw} onClick={() => refetch()} />}
      fullWidth
    >
      <DataTable
        rows={judgeHosts}
        columns={columns}
        isLoading={isLoading}
        sorting={{ sorting, onSortingChange: setSorting }}
        rowClassName={(judgeHost) => {
          if (!judgeHost.active || !judgeHost.pollTime) return 'bg-white';

          const diff = Date.now() - new Date(judgeHost.pollTime).getTime();

          if (diff < 30000) return 'bg-green-200 dark:bg-green-800';

          if (diff < 60000) return 'bg-yellow-200 dark:bg-yellow-800';

          return 'bg-red-200 dark:bg-red-800';
        }}
        actions={[
          {
            color: 'red',
            icon: Trash2Icon,
            hide: !isUserAdmin,
            onClick: (item) =>
              setDeleteDialogState({
                open: true,
                onConfirm: () => deleteJudgeHost({ where: { id: item.id } }),
              }),
          },
        ]}
      />
      <ConfirmDialog
        open={deleteDialogState?.open ?? false}
        title="Delete JudgeHost"
        onConfirm={deleteDialogState?.onConfirm ?? (() => undefined)}
        onClose={() => setDeleteDialogState(undefined)}
      >
        Are you sure you want to delete this judge host?
      </ConfirmDialog>
      <JudgeHostLogsViewer hostname={hostname} onClose={() => setHostname(undefined)} />
    </PageTemplate>
  );
};
