import { EditIcon, PlusIcon, RefreshCcw, Trash2Icon, UsersIcon } from 'lucide-react';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Button, ConfirmDialog, DataTable, DataTableColumn } from 'tw-react-components';

import { PageTemplate, User, getDisplayDate, useAuthContext, useSorting } from '../../../../core';
import { useDeleteUser, useFindManyUser } from '../../../../hooks';
import UserForm from './UserForm';

const UsersList: React.FC = observer(() => {
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [user, setUser] = useState<Partial<User>>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const { sorting, setSorting } = useSorting<User>();

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useFindManyUser({
    include: { role: true },
    orderBy: sorting ? { [sorting.field]: sorting.direction } : undefined,
  });
  const { mutate: deleteUser } = useDeleteUser();

  const columns: DataTableColumn<User>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (user) => user.name,
    },
    {
      header: 'Username',
      field: 'username',
      render: (user) => user.username,
    },
    {
      header: 'Email',
      field: 'email',
      render: (user) => user.email ?? '-',
    },
    {
      header: 'Role',
      field: 'role',
      render: (user) => user.role.description,
    },
    {
      header: 'Last Login',
      field: 'lastLogin',
      render: (user) => (user.lastLogin ? getDisplayDate(user.lastLogin) : '-'),
    },
    {
      header: 'Last Ip',
      field: 'lastIpAddress',
      render: (user) => user.lastIpAddress ?? '-',
    },
    {
      header: 'Enabled?',
      field: 'enabled',
      render: (user) => (user.enabled ? 'Yes' : 'No'),
    },
  ];

  return (
    // <div className="p-4">
    //   <DataTable<User>
    //     header="Users"
    //     dataFetcher={fetchAll}
    //     dataDependencies={[updateCount]}
    //     columns={columns}
    //     ItemForm={isUserAdmin ? UserForm : undefined}
    //     onDelete={remove}
    //     withoutActions={!isUserAdmin}
    //     canDelete={(item) => !!profile && item.username !== profile.username}
    //     onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    //   />
    // </div>

    <PageTemplate
      icon={UsersIcon}
      title="Users"
      actions={
        <>
          <Button prefixIcon={RefreshCcw} onClick={() => refetch()} />
          <Button prefixIcon={PlusIcon} onClick={() => setUser({})} />
        </>
      }
      fullWidth
    >
      <DataTable
        rows={users}
        columns={columns}
        isLoading={isLoading}
        sorting={{ sorting, onSortingChange: setSorting }}
        actions={[
          {
            icon: EditIcon,
            hide: !isUserAdmin,
            onClick: ({ password, ...item }) => setUser(item),
          },
          {
            color: 'red',
            icon: Trash2Icon,
            hide: (item) => item.username === profile?.username,
            onClick: (item) =>
              setDeleteDialogState({
                open: true,
                onConfirm: () => deleteUser({ where: { id: item.id } }),
              }),
          },
        ]}
      />
      <ConfirmDialog
        open={deleteDialogState?.open ?? false}
        title="Delete User"
        onConfirm={deleteDialogState?.onConfirm ?? (() => undefined)}
        onClose={() => setDeleteDialogState(undefined)}
      >
        Are you sure you want to delete this user?
      </ConfirmDialog>
      <UserForm
        user={user}
        onSubmit={() => setUser(undefined)}
        onClose={() => setUser(undefined)}
      />
    </PageTemplate>
  );
});

export default UsersList;
