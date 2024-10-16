import { EditIcon, PlusIcon, RefreshCcw, Trash2Icon, UsersRoundIcon } from 'lucide-react';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Button, ConfirmDialog, DataTable, DataTableColumn } from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useSorting } from '@core/hooks';
import { useDeleteTeam, useFindManyTeam } from '@models';

import { TeamForm } from './TeamForm';

export type Team = Prisma.TeamGetPayload<{
  include: { category: true; users: true; contests: true };
}>;

export const TeamsList: React.FC = observer(() => {
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [team, setTeam] = useState<Partial<Team>>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const { sorting, setSorting } = useSorting<Team>();

  const {
    data: teams = [],
    isLoading,
    refetch,
  } = useFindManyTeam({
    include: { category: true, users: true, contests: true },
    orderBy: sorting ? { [sorting.field]: sorting.direction } : undefined,
  });
  const { mutate: deleteTeam } = useDeleteTeam();

  const columns: DataTableColumn<Team>[] = [
    {
      header: '#',
      field: 'id',
    },
    {
      header: 'Name',
      field: 'name',
    },
    {
      header: 'Category',
      field: 'category.name',
    },
    {
      header: 'Users',
      field: 'users',
      render: (team) =>
        team.users.map((user) => `${user.username} (${user.lastIpAddress ?? '-'})`).join(', ') ||
        '-',
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      render: (team) => (team.enabled ? 'Yes' : 'No'),
    },
    {
      header: 'Contests',
      field: 'contests',
      render: (team) => team.contests.length,
    },
  ];

  return (
    <PageTemplate
      icon={UsersRoundIcon}
      title="Teams"
      actions={
        <>
          <Button prefixIcon={RefreshCcw} onClick={() => refetch()} />
          <Button prefixIcon={PlusIcon} onClick={() => setTeam({ penalty: 0, enabled: true })} />
        </>
      }
      fullWidth
    >
      <DataTable
        rows={teams}
        columns={columns}
        isLoading={isLoading}
        sorting={{ sorting, onSortingChange: setSorting }}
        rowClassName={(team) => (!team.users.length ? 'bg-red-100' : '')}
        actions={[
          {
            icon: EditIcon,
            hide: !isUserAdmin,
            onClick: setTeam,
          },
          {
            color: 'red',
            icon: Trash2Icon,
            hide: !isUserAdmin,
            onClick: (item) =>
              setDeleteDialogState({
                open: true,
                onConfirm: () => deleteTeam({ where: { id: item.id } }),
              }),
          },
        ]}
      />
      <ConfirmDialog
        open={deleteDialogState?.open ?? false}
        title="Delete Team"
        onConfirm={deleteDialogState?.onConfirm ?? (() => undefined)}
        onClose={() => setDeleteDialogState(undefined)}
      >
        Are you sure you want to delete this team?
      </ConfirmDialog>
      <TeamForm
        team={team}
        onSubmit={() => setTeam(undefined)}
        onClose={() => setTeam(undefined)}
      />
    </PageTemplate>
  );
});
