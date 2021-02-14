import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Problem } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import ProblemForm from './ProblemForm';

const ProblemsList: React.FC = observer(() => {
  const history = useHistory();
  const {
    isUserAdmin,
    problemsStore: { data, fetchAll, create, update, remove, unzip },
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
      ItemForm={isUserAdmin ? ProblemForm : undefined}
      formItemInitValue={{
        runScript: executables.find((e) => e.type === 'RUNNER' && e.default),
        checkScript: executables.find((e) => e.type === 'CHECKER' && e.default),
      }}
      withoutActions={!isUserAdmin}
      unzip={isUserAdmin ? unzip : undefined}
      zipUrl={({ id }) => `/api/problems/${id}/zip`}
      zipAllUrl={`/api/problems/zip/all`}
      onDelete={remove}
      onRefresh={() => Promise.all([fetchAll(), fetchAllExecutables()])}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default ProblemsList;
