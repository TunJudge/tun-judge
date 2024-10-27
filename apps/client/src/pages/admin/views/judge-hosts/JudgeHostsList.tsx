import { RefreshCcw, ServerIcon, Trash2Icon } from 'lucide-react';
import { FC, useState } from 'react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  DataTableColumn,
  Flex,
  cn,
  useLayoutContext,
} from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useSorting } from '@core/hooks';
import { getDisplayDate } from '@core/utils';
import { useDeleteJudgeHost, useFindManyJudgeHost } from '@models';

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
  const { sorting, setSorting } = useSorting<JudgeHost>();

  const {
    data: judgeHosts = [],
    isLoading,
    refetch,
  } = useFindManyJudgeHost(
    {
      include: { user: true },
      orderBy: sorting ? { [sorting.field]: sorting.direction } : undefined,
    },
    { refetchInterval: 5000 },
  );
  const { mutate: deleteJudgeHost } = useDeleteJudgeHost();

  const columns: DataTableColumn<JudgeHost>[] = [
    {
      header: '#',
      field: 'id',
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
          <Flex className="select-none" justify="center">
            <div
              className={cn('cursor-pointer rounded px-3 py-2 text-white', {
                'bg-red-600': judgeHost.active,
                'bg-green-600': !judgeHost.active,
              })}
              // onClick={() => toggle(judgeHost.id, !judgeHost.active)}
            >
              {judgeHost.active ? 'Deactivate' : 'Activate'}
            </div>
          </Flex>
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
        <Flex className="select-none" justify="center">
          <div
            className={cn('w-min cursor-pointer rounded bg-blue-600 px-3 py-2 text-white', {
              disabled: !judgeHost.active,
            })}
            onClick={() => setHostname(judgeHost.hostname)}
          >
            Logs
          </div>
        </Flex>
      ),
    },
  ];

  return (
    // <div className="p-4">
    //   <DataTable<JudgeHost>
    //     header="Judge Hosts"
    //     dataFetcher={fetchAll}
    //     dataDependencies={[updateCount]}
    //     columns={columns}
    //     onDelete={remove}
    //     withoutActions={!isUserAdmin}
    //     rowBackgroundColor={(judgeHost) => {
    //       if (!judgeHost.active) return 'white';

    //       const diff = Date.now() - new Date(judgeHost.pollTime).getTime();
    //       if (diff < 30000) {
    //         return 'green';
    //       }
    //       if (diff < 60000) {
    //         return 'yellow';
    //       }
    //       return 'red';
    //     }}
    //   />
    //   <JudgeHostLogsViewer hostname={hostname} dismiss={() => setHostname(undefined)} />
    // </div>
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
    </PageTemplate>
  );
};
