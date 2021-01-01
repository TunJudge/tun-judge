import React, { useEffect, useState } from 'react';
import { Button, Header, Icon, Menu, Segment, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import ContestForm from './ContestForm';
import { Contest } from '../../../core/models';
import { MOMENT_DEFAULT_FORMAT } from '../../shared/extended-form';
import moment from 'moment';

const ContestsList: React.FC = observer(() => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formContest, setFormContest] = useState<Contest>({} as Contest);
  const {
    contestsStore: { data, fetchAll, create, update, remove },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const dismissForm = () => {
    setFormContest({} as Contest);
    setFormOpen(false);
  };

  return (
    <Segment.Group>
      <Segment as={Menu} style={{ padding: 0 }} borderless>
        <Menu.Item>
          <Header>Contests</Header>
        </Menu.Item>
        <Menu.Item position="right">
          <Button color="blue" icon onClick={() => setFormOpen(true)}>
            <Icon name="plus" />
          </Button>
        </Menu.Item>
      </Segment>
      <Segment>
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
                  <Table.Cell>0</Table.Cell>
                  <Table.Cell>{contest.problems.length}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Icon
                      name="edit"
                      onClick={() => {
                        setFormContest(contest);
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
      </Segment>
      {formOpen && (
        <ContestForm
          contest={formContest as Contest}
          dismiss={dismissForm}
          submit={async () => {
            if (formContest.id) {
              await update(formContest);
            } else {
              await create(formContest);
            }
            dismissForm();
          }}
        />
      )}
    </Segment.Group>
  );
});

export default ContestsList;
