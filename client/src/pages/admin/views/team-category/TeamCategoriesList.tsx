import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React from 'react';
import { TeamCategory } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import TeamCategoryForm from './TeamCategoryForm';

const TeamCategoriesList: React.FC = observer(() => {
  const {
    isUserAdmin,
    teamCategoriesStore: {
      data: teamCategories,
      updateCount,
      fetchAll,
      create,
      update,
      move,
      remove,
    },
  } = rootStore;

  const columns: ListPageTableColumn<TeamCategory>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (category) => category.name,
    },
    {
      header: 'Sort Order',
      field: 'sortOrder',
      render: (category) => (
        <div className="flex items-center justify-center gap-1">
          {isUserAdmin && (
            <ChevronDownIcon
              className={classNames('cursor-pointer h-4 w-4', {
                'opacity-0': category.sortOrder + 1 >= teamCategories.length,
              })}
              onClick={() => move(category.id, 'down')}
            />
          )}
          {category.sortOrder}
          {isUserAdmin && (
            <ChevronUpIcon
              className={classNames('cursor-pointer h-4 w-4', {
                'opacity-0': category.sortOrder === 0,
              })}
              onClick={() => (category.sortOrder > 0 ? move(category.id, 'up') : undefined)}
            />
          )}
        </div>
      ),
    },
    {
      header: 'Color',
      field: 'color',
      render: (category) => (
        <div className="flex items-center justify-center gap-2 w-full">
          {category.color}
          <div
            className="h-6 w-6 border border-black rounded-full dark:border-white"
            style={{ backgroundColor: category.color }}
          />
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
    <DataTable<TeamCategory>
      header="Team Categories"
      dataFetcher={fetchAll}
      dataDependencies={[updateCount]}
      columns={columns}
      ItemForm={isUserAdmin ? TeamCategoryForm : undefined}
      onDelete={remove}
      withoutActions={!isUserAdmin}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default TeamCategoriesList;
