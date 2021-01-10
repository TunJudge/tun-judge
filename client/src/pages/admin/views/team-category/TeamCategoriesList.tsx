import React, { useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../../core/stores/RootStore';
import TeamCategoryForm from './TeamCategoryForm';
import { TeamCategory } from '../../../../core/models';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';

const TeamCategoriesList: React.FC = observer(() => {
  const {
    teamCategoriesStore: { data, fetchAll, create, update, move, remove },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
        <>
          {category.sortOrder + 1 < data.length ? (
            <Icon
              className="cursor-pointer"
              name="angle down"
              onClick={() => move(category.id, 'down')}
              style={{ marginRight: 0 }}
            />
          ) : (
            <Icon name="angle down" style={{ opacity: 0, marginRight: 0 }} />
          )}
          {category.sortOrder}
          {category.sortOrder > 0 && (
            <Icon
              className="cursor-pointer"
              name="angle up"
              onClick={() => move(category.id, 'up')}
              style={{ marginRight: 0 }}
            />
          )}
        </>
      ),
    },
    {
      header: 'Color',
      field: 'color',
      render: (category) => <div style={{ backgroundColor: category.color }}>{category.color}</div>,
    },
    {
      header: 'Visible?',
      field: 'visible',
      render: (category) => (category.visible ? 'true' : 'false'),
    },
    {
      header: 'Teams',
      field: 'teams',
      render: (category) => category.teams.length,
    },
  ];

  return (
    <ListPage<TeamCategory>
      header="Team Categories"
      data={data}
      columns={columns}
      ItemForm={TeamCategoryForm}
      onDelete={remove}
      onRefresh={fetchAll}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default TeamCategoriesList;
