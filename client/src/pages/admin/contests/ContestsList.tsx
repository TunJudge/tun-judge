import React, { useEffect, useState } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import ContestForm from './ContestForm';
import { Contest } from '../../../core/models';
import { MOMENT_DEFAULT_FORMAT } from '../../shared/extended-form';
import moment from 'moment';
import ListPage from '../../shared/ListPage';

const ContestsList: React.FC = observer(() => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const {
    contestsStore: { data, item, setItem, fetchAll, create, update, remove },
    problemsStore: { fetchAll: fetchAllProblems },
  } = rootStore;

  useEffect(() => {
    Promise.all([fetchAll(), fetchAllProblems()]);
  }, [fetchAll, fetchAllProblems]);

  const dismissForm = async () => {
    setItem({ problems: [] });
    setFormOpen(false);
    await fetchAll();
  };

  return (
    <ListPage
      header="Contests"
      onRefresh={() => Promise.all([fetchAll(), fetchAllProblems()])}
      onAdd={() => setFormOpen(true)}
    >
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Short Name</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Active</Table.HeaderCell>
            <Table.HeaderCell>Start</Table.HeaderCell>
            <Table.HeaderCell>End</Table.HeaderCell>
            <Table.HeaderCell>Process Balloons?</Table.HeaderCell>
            <Table.HeaderCell>Public?</Table.HeaderCell>
            <Table.HeaderCell>Teams</Table.HeaderCell>
            <Table.HeaderCell>Problems</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.length === 0 ? (
            <Table.Row textAlign="center">
              <Table.Cell colSpan="10">No data</Table.Cell>
            </Table.Row>
          ) : (
            data.map((contest) => (
              <Table.Row key={contest.id}>
                <Table.Cell textAlign="center">{contest.id}</Table.Cell>
                <Table.Cell>{contest.shortName}</Table.Cell>
                <Table.Cell>{contest.name}</Table.Cell>
                <Table.Cell>
                  {moment(contest.activateTime).format(MOMENT_DEFAULT_FORMAT)}
                </Table.Cell>
                <Table.Cell>{moment(contest.startTime).format(MOMENT_DEFAULT_FORMAT)}</Table.Cell>
                <Table.Cell>{moment(contest.endTime).format(MOMENT_DEFAULT_FORMAT)}</Table.Cell>
                <Table.Cell>{contest.processBalloons ? 'true' : 'false'}</Table.Cell>
                <Table.Cell>{contest.public ? 'true' : 'false'}</Table.Cell>
                <Table.Cell>{contest.teams.length}</Table.Cell>
                <Table.Cell>{contest.problems.length}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Icon
                    name="edit"
                    onClick={() => {
                      setItem(contest);
                      setFormOpen(true);
                    }}
                    style={{ cursor: 'pointer', marginRight: '25%' }}
                  />
                  <Icon
                    name="trash"
                    color="red"
                    onClick={() => remove(contest.id)}
                    style={{ cursor: 'pointer', marginRight: '0' }}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      {formOpen && (
        <ContestForm
          contest={item as Contest}
          dismiss={dismissForm}
          submit={async () => {
            if (item.id) {
              await update(item);
            } else {
              await create(item);
            }
            await dismissForm();
          }}
        />
      )}
    </ListPage>
  );
});

export default ContestsList;
