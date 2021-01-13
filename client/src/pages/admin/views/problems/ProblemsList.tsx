import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../../core/stores/RootStore';
import { useHistory } from 'react-router-dom';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import { Problem } from '../../../../core/models';
import ProblemForm from './ProblemForm';

const ProblemsList: React.FC = observer(() => {
  const history = useHistory();
  const {
    problemsStore: { data, fetchAll, create, update, remove },
    executablesStore: { data: executables, fetchAll: fetchAllExecutables },
  } = rootStore;

  useEffect(() => {
    Promise.all([fetchAll(), fetchAllExecutables()]);
  }, [fetchAll, fetchAllExecutables]);

  const columns: ListPageTableColumn<Problem>[] = [
    {
      header: 'Name',
      field: 'name',
      className: 'cursor-pointer',
      onClick: (problem) => history.push(`/problems/${problem.id}`),
      render: (problem) => problem.name,
    },
    {
      header: 'Limits',
      field: 'timeLimit',
      render: (problem) => `${problem.timeLimit}s`,
    },
    {
      header: 'Memory Limit',
      field: 'memoryLimit',
      render: (problem) => `${problem.memoryLimit}Kb`,
    },
    {
      header: 'Output Limit',
      field: 'outputLimit',
      render: (problem) => `${problem.outputLimit}Kb`,
    },
    {
      header: 'Testcases',
      field: 'testcases',
      render: (problem) => problem.testcases.length,
    },
  ];

  return (
    <ListPage<Problem>
      header="Problems"
      data={data}
      columns={columns}
      ItemForm={ProblemForm}
      formItemInitValue={{
        runScript: executables.find((e) => e.type === 'RUNNER' && e.default),
        checkScript: executables.find((e) => e.type === 'CHECKER' && e.default),
      }}
      onDelete={remove}
      onRefresh={() => Promise.all([fetchAll(), fetchAllExecutables()])}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default ProblemsList;
