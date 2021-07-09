import { observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Problem } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import ProblemForm from './ProblemForm';

const ProblemsList: React.FC = observer(() => {
  const history = useHistory();
  const {
    isUserAdmin,
    problemsStore: { fetchAll, create, update, remove },
  } = rootStore;

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
    <DataTable<Problem>
      header="Problems"
      dataFetcher={fetchAll}
      columns={columns}
      ItemForm={isUserAdmin ? ProblemForm : undefined}
      withoutActions={!isUserAdmin}
      onDelete={remove}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default ProblemsList;
