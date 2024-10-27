import { EditIcon, GraduationCapIcon, PlusIcon, RefreshCcw, Trash2Icon } from 'lucide-react';
import { FC, useState } from 'react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  DataTableColumn,
  useLayoutContext,
} from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useSorting } from '@core/hooks';
import { getDisplayDate } from '@core/utils';
import { useDeleteContest, useFindManyContest } from '@models';

import { ContestForm } from './ContestForm';

export type Contest = Prisma.ContestGetPayload<{
  include: { problems: true; _count: { select: { teams: true; problems: true } } };
}>;

export const ContestsList: FC = () => {
  const { showIds } = useLayoutContext();
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [contest, setContest] = useState<Partial<Contest>>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const { sorting, setSorting } = useSorting<Contest>();

  const {
    data: contests = [],
    isLoading,
    refetch,
  } = useFindManyContest({
    include: { problems: true, _count: { select: { teams: true, problems: true } } },
    orderBy: sorting ? { [sorting.field]: sorting.direction } : undefined,
  });
  const { mutate: deleteContest } = useDeleteContest();

  const columns: DataTableColumn<Contest>[] = [
    {
      header: '#',
      field: 'id',
      hide: !showIds,
    },
    {
      header: 'Short Name',
      field: 'shortName',
    },
    {
      header: 'Name',
      field: 'name',
    },
    {
      header: 'Active Time',
      field: 'activateTime',
      render: (contest) => getDisplayDate(contest.activateTime),
    },
    {
      header: 'Start Time',
      field: 'startTime',
      render: (contest) => getDisplayDate(contest.startTime),
    },
    {
      header: 'End Time',
      field: 'endTime',
      render: (contest) => (contest.endTime ? getDisplayDate(contest.endTime) : '-'),
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      align: 'center',
      render: (contest) => (contest.enabled ? 'Yes' : 'No'),
    },
    {
      header: 'Public?',
      field: 'public',
      align: 'center',
      render: (contest) => (contest.public ? 'Yes' : 'No'),
    },
    {
      header: 'Teams',
      field: '_count.teams',
      align: 'center',
      render: (contest) => contest._count.teams,
    },
    {
      header: 'Problems',
      field: '_count.problems',
      align: 'center',
      render: (contest) => contest._count.problems,
    },
  ];

  return (
    <PageTemplate
      icon={GraduationCapIcon}
      title="Contests"
      actions={
        <>
          <Button prefixIcon={RefreshCcw} onClick={() => refetch()} />
          <Button
            prefixIcon={PlusIcon}
            onClick={() =>
              setContest({ enabled: true, public: true, processBalloons: true, problems: [] })
            }
          />
        </>
      }
      fullWidth
    >
      <DataTable
        rows={contests}
        columns={columns}
        isLoading={isLoading}
        sorting={{ sorting, onSortingChange: setSorting }}
        actions={[
          {
            icon: EditIcon,
            hide: !isUserAdmin,
            onClick: setContest,
          },
          {
            color: 'red',
            icon: Trash2Icon,
            hide: !isUserAdmin,
            onClick: (item) =>
              setDeleteDialogState({
                open: true,
                onConfirm: () => deleteContest({ where: { id: item.id } }),
              }),
          },
        ]}
      />
      <ConfirmDialog
        open={deleteDialogState?.open ?? false}
        title="Delete Contest"
        onConfirm={deleteDialogState?.onConfirm ?? (() => undefined)}
        onClose={() => setDeleteDialogState(undefined)}
      >
        Are you sure you want to delete this contest?
      </ConfirmDialog>
      <ContestForm
        contest={contest}
        onSubmit={() => setContest(undefined)}
        onClose={() => setContest(undefined)}
      />
    </PageTemplate>
  );
};
