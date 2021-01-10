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
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const columns: ListPageTableColumn<Problem>[] = [
    {
      header: 'Name',
      field: 'name',
      className: 'cursor-pointer',
      onClick: (problem) => history.push(`/problems/${problem.id}`),
      render: (problem) => problem.name,
    },
    {
      header: 'Time Limit',
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
      onDelete={remove}
      onRefresh={fetchAll}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default ProblemsList;
