import {
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  PlusIcon,
  RefreshCcw,
  TagsIcon,
  Trash2Icon,
} from 'lucide-react';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Button, ConfirmDialog, DataTable, DataTableColumn, cn } from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useSorting } from '@core/hooks';
import { getRGBColorContrast } from '@core/utils';
import { useDeleteTeamCategory, useFindManyTeamCategory } from '@models';

import { TeamCategoryForm } from './TeamCategoryForm';

export type TeamCategory = Prisma.TeamCategoryGetPayload<{
  include: { teams: true };
}>;

export const TeamCategoriesList: React.FC = observer(() => {
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [teamCategory, setTeamCategory] = useState<Partial<TeamCategory>>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const { sorting, setSorting } = useSorting<TeamCategory>();

  const {
    data: teamCategories = [],
    isLoading,
    refetch,
  } = useFindManyTeamCategory({
    include: { teams: true },
    orderBy: sorting ? { [sorting.field]: sorting.direction } : undefined,
  });
  const { mutate: deleteTeamCategory } = useDeleteTeamCategory();

  const columns: DataTableColumn<TeamCategory>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (category) => category.name,
    },
    {
      header: 'Sort Order',
      field: 'rank',
      render: (category) => (
        <div className="flex items-center justify-center gap-1">
          {isUserAdmin && (
            <ChevronDownIcon
              className={cn('h-4 w-4 cursor-pointer', {
                'opacity-0': category.rank + 1 >= teamCategories.length,
              })}
              // onClick={() => move(category.id, 'down')}
            />
          )}
          {category.rank}
          {isUserAdmin && (
            <ChevronUpIcon
              className={cn('h-4 w-4 cursor-pointer', {
                'opacity-0': category.rank === 0,
              })}
              // onClick={() => (category.rank > 0 ? move(category.id, 'up') : undefined)}
            />
          )}
        </div>
      ),
    },
    {
      header: 'Color',
      field: 'color',
      align: 'center',
      render: (category) => (
        <div
          className={cn('rounded-md px-2', {
            'text-white': getRGBColorContrast(category.color) <= 0.5,
            'text-black': getRGBColorContrast(category.color) > 0.5,
          })}
          style={{ backgroundColor: category.color }}
        >
          {category.color}
        </div>
      ),
    },
    {
      header: 'Visible?',
      field: 'visible',
      render: (category) => (category.visible ? 'Yes' : 'No'),
    },
    {
      header: 'Teams',
      field: 'teams',
      render: (category) => category.teams.length,
    },
  ];

  return (
    <PageTemplate
      icon={TagsIcon}
      title="Teams"
      actions={
        <>
          <Button prefixIcon={RefreshCcw} onClick={() => refetch()} />
          <Button prefixIcon={PlusIcon} onClick={() => setTeamCategory({})} />
        </>
      }
      fullWidth
    >
      <DataTable
        rows={teamCategories}
        columns={columns}
        isLoading={isLoading}
        sorting={{ sorting, onSortingChange: setSorting }}
        actions={[
          {
            icon: EditIcon,
            hide: !isUserAdmin,
            onClick: setTeamCategory,
          },
          {
            color: 'red',
            icon: Trash2Icon,
            hide: !isUserAdmin,
            onClick: (item) =>
              setDeleteDialogState({
                open: true,
                onConfirm: () => deleteTeamCategory({ where: { id: item.id } }),
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
        Are you sure you want to delete this team category?
      </ConfirmDialog>
      <TeamCategoryForm
        teamCategory={teamCategory}
        onSubmit={() => setTeamCategory(undefined)}
        onClose={() => setTeamCategory(undefined)}
      />
    </PageTemplate>
  );
});
