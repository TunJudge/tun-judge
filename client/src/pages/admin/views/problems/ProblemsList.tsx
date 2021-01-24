import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { Problem } from '../../../../core/models';
import { hostname, rootStore } from '../../../../core/stores/RootStore';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import ProblemForm from './ProblemForm';

const ProblemsList: React.FC = observer(() => {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
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
      extraActions={
        <Button className="mr-2" color="blue" icon onClick={() => uploadInputRef.current?.click()}>
          <Icon name="upload" />
          <input
            type="file"
            multiple
            hidden
            ref={(ref) => (uploadInputRef.current = ref)}
            onChange={async (event) => {
              const files = event.target.files;
              if (files?.length) {
                await unzip(files[0]);
              }
            }}
          />
        </Button>
      }
      zipUrl={({ id }) => `${hostname}/api/problems/${id}/zip`}
      onDelete={remove}
      onRefresh={() => Promise.all([fetchAll(), fetchAllExecutables()])}
      onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    />
  );
});

export default ProblemsList;
