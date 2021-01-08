import React, { useEffect, useState } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import TeamForm from './TeamForm';
import { Team } from '../../../core/models';
import ListPage from '../../shared/ListPage';

const TeamsList: React.FC = observer(() => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formTeam, setFormTeam] = useState<Team>({} as Team);
  const {
    teamsStore: { data, fetchAll, create, update, remove },
    usersStore: { teamUsers: users, fetchAll: fetchAllCategories },
    contestsStore: { data: contests, fetchAll: fetchAllContests },
    teamCategoriesStore: { data: categories, fetchAll: fetchAllUsers },
  } = rootStore;

  useEffect(() => {
    Promise.all([fetchAll(), fetchAllUsers(), fetchAllContests(), fetchAllCategories()]);
  }, [fetchAll, fetchAllUsers, fetchAllContests, fetchAllCategories]);

  const refreshAllData = async (): Promise<void> => {
    await Promise.all([fetchAll(), fetchAllUsers(), fetchAllContests(), fetchAllCategories()]);
  };

  const dismissForm = async () => {
    setFormTeam({} as Team);
    setFormOpen(false);
    await refreshAllData();
  };

  return (
    <ListPage header="Teams" onRefresh={refreshAllData} onAdd={() => setFormOpen(true)}>
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell>Ip</Table.HeaderCell>
            <Table.HeaderCell>Enabled</Table.HeaderCell>
            <Table.HeaderCell>Contests</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.length === 0 ? (
            <Table.Row textAlign="center">
              <Table.Cell colSpan="10">No data</Table.Cell>
            </Table.Row>
          ) : (
            data.map((team) => (
              <Table.Row key={team.id}>
                <Table.Cell textAlign="center">{team.id}</Table.Cell>
                <Table.Cell>{team.name}</Table.Cell>
                <Table.Cell>{team.category.name}</Table.Cell>
                <Table.Cell>{team.user?.lastIpAddress ?? '-'}</Table.Cell>
                <Table.Cell>{team.enabled ? 'true' : 'false'}</Table.Cell>
                <Table.Cell>{team.contests.length}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Icon
                    name="edit"
                    onClick={() => {
                      setFormTeam(team);
                      setFormOpen(true);
                    }}
                    style={{ cursor: 'pointer', marginRight: '25%' }}
                  />
                  <Icon
                    name="trash"
                    color="red"
                    onClick={async () => {
                      await remove(team.id);
                      await refreshAllData();
                    }}
                    style={{ cursor: 'pointer', marginRight: '0' }}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      {formOpen && (
        <TeamForm
          team={formTeam as Team}
          users={users}
          contests={contests}
          categories={categories}
          dismiss={dismissForm}
          submit={async () => {
            if (formTeam.id) {
              await update(formTeam);
            } else {
              await create(formTeam);
            }
            dismissForm();
          }}
        />
      )}
    </ListPage>
  );
});

export default TeamsList;
