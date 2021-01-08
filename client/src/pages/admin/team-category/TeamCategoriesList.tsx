import React, { useEffect, useState } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import TeamCategoryForm from './TeamCategoryForm';
import { TeamCategory } from '../../../core/models';
import ListPage from '../../shared/ListPage';
import { observable } from 'mobx';

const TeamCategoriesList: React.FC = observer(() => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formTeamCategory, setFormTeamCategory] = useState<TeamCategory>(
    observable({} as TeamCategory),
  );
  const {
    teamCategoriesStore: { data, fetchAll, create, update, move, remove },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const dismissForm = async () => {
    setFormTeamCategory(observable({} as TeamCategory));
    setFormOpen(false);
    await fetchAll();
  };

  return (
    <ListPage header="Team Categories" onRefresh={fetchAll} onAdd={() => setFormOpen(true)}>
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Sort Order</Table.HeaderCell>
            <Table.HeaderCell>Color</Table.HeaderCell>
            <Table.HeaderCell>Visible</Table.HeaderCell>
            <Table.HeaderCell>Teams</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.length === 0 ? (
            <Table.Row textAlign="center">
              <Table.Cell colSpan="10">No data</Table.Cell>
            </Table.Row>
          ) : (
            data.map((teamCategory) => (
              <Table.Row key={teamCategory.id}>
                <Table.Cell textAlign="center">{teamCategory.id}</Table.Cell>
                <Table.Cell>{teamCategory.name}</Table.Cell>
                <Table.Cell>
                  {teamCategory.sortOrder + 1 < data.length ? (
                    <Icon
                      className="cursor-pointer"
                      name="angle down"
                      onClick={() => move(teamCategory.id, 'down')}
                      style={{ marginRight: 0 }}
                    />
                  ) : (
                    <Icon name="angle down" style={{ opacity: 0, marginRight: 0 }} />
                  )}
                  {teamCategory.sortOrder}
                  {teamCategory.sortOrder > 0 && (
                    <Icon
                      className="cursor-pointer"
                      name="angle up"
                      onClick={() => move(teamCategory.id, 'up')}
                      style={{ marginRight: 0 }}
                    />
                  )}
                </Table.Cell>
                <Table.Cell style={{ backgroundColor: teamCategory.color }}>
                  {teamCategory.color}
                </Table.Cell>
                <Table.Cell>{teamCategory.visible ? 'true' : 'false'}</Table.Cell>
                <Table.Cell>{teamCategory.teams.length}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Icon
                    name="edit"
                    onClick={() => {
                      setFormTeamCategory(teamCategory);
                      setFormOpen(true);
                    }}
                    style={{ cursor: 'pointer', marginRight: '25%' }}
                  />
                  <Icon
                    name="trash"
                    color="red"
                    onClick={() => remove(teamCategory.id)}
                    style={{ cursor: 'pointer', marginRight: '0' }}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      {formOpen && (
        <TeamCategoryForm
          teamCategory={formTeamCategory as TeamCategory}
          dismiss={dismissForm}
          submit={async () => {
            if (formTeamCategory.id) {
              await update(formTeamCategory);
            } else {
              await create(formTeamCategory);
            }
            dismissForm();
          }}
        />
      )}
    </ListPage>
  );
});

export default TeamCategoriesList;
