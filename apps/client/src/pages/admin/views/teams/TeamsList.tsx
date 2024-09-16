import { EditIcon, PlusIcon, RefreshCcw, Trash2Icon, UsersIcon } from 'lucide-react';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Button, ConfirmDialog, DataTable, DataTableColumn } from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { PageTemplate, useAuthContext, useSorting } from '../../../../core';
import { useDeleteTeam, useFindManyTeam } from '../../../../hooks';
import { TeamForm } from './TeamForm';

export type Team = Prisma.TeamGetPayload<{
  include: { category: true; users: true; contests: true };
}>;

const TeamsList: React.FC = observer(() => {
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
      header: 'Name',
      field: 'name',
      render: (team) => team.name,
    },
    {
      header: 'Category',
      field: 'category',
      render: (team) => team.category.name,
    },
    {
      header: 'User',
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
      icon={UsersIcon}
      title="Users"
      actions={
        <>
          <Button prefixIcon={RefreshCcw} onClick={() => refetch()} />
          <Button prefixIcon={PlusIcon} onClick={() => setTeam({})} />
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

export default TeamsList;
