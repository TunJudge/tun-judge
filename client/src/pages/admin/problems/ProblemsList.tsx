import React, { useEffect, useState } from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import ProblemForm from './ProblemForm';
import { Problem } from '../../../core/models';
import { useHistory } from 'react-router-dom';
import ListPage from '../../shared/ListPage';

const ProblemsList: React.FC = observer(() => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formProblem, setFormProblem] = useState<Partial<Problem>>({});
  const history = useHistory();
  const {
    problemsStore: { data, fetchAll, create, update, remove },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const dismissForm = () => {
    setFormProblem({});
    setFormOpen(false);
  };

  return (
    <ListPage header="Problems" onRefresh={fetchAll} onAdd={() => setFormOpen(true)}>
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Time Limit</Table.HeaderCell>
            <Table.HeaderCell>Memory Limit</Table.HeaderCell>
            <Table.HeaderCell>Output Limit</Table.HeaderCell>
            <Table.HeaderCell>Test Cases</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.length === 0 ? (
            <Table.Row textAlign="center">
              <Table.Cell colSpan="10">No data</Table.Cell>
            </Table.Row>
          ) : (
            data.map((problem) => (
              <Table.Row key={problem.id}>
                <Table.Cell textAlign="center">{problem.id}</Table.Cell>
                <Table.Cell
                  className="cursor-pointer"
                  onClick={() => history.push(`/problems/${problem.id}`)}
                >
                  {problem.name}
                </Table.Cell>
                <Table.Cell>{problem.timeLimit}s</Table.Cell>
                <Table.Cell>{problem.memoryLimit}Kb</Table.Cell>
                <Table.Cell>{problem.outputLimit}Kb</Table.Cell>
                <Table.Cell>{problem.testcases.length}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Icon
                    name="edit"
                    onClick={() => {
                      setFormProblem(problem);
                      setFormOpen(true);
                    }}
                    style={{ cursor: 'pointer', marginRight: '25%' }}
                  />
                  <Icon
                    name="trash"
                    color="red"
                    onClick={() => remove(problem.id)}
                    style={{ cursor: 'pointer', marginRight: '0' }}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      {formOpen && (
        <ProblemForm
          problem={formProblem}
          dismiss={dismissForm}
          submit={async () => {
            if (formProblem.id) {
              await update(formProblem);
            } else {
              await create(formProblem);
            }
            dismissForm();
          }}
        />
      )}
    </ListPage>
  );
});

export default ProblemsList;
