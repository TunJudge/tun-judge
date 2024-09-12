import { observer } from 'mobx-react';
import React, { useState } from 'react';

import { Executable, ExecutableType } from '@core/models';
import { ExecutablesStore, RootStore, useStore } from '@core/stores';

import DataTable, { ListPageTableColumn } from '@shared/data-table/DataTable';
import { CodeEditorDialog } from '@shared/dialogs';

import ExecutableForm from './ExecutableForm';

const executableTypeText: Record<ExecutableType, string> = { RUNNER: 'Runner', CHECKER: 'Checker' };

const ExecutablesList: React.FC = observer(() => {
  const { isUserAdmin } = useStore<RootStore>('rootStore');
  const { fetchAll, updateCount, create, update, remove } =
    useStore<ExecutablesStore>('executablesStore');

  const [scriptData, setScriptData] = useState<
    { executable: Executable; field: 'sourceFile' | 'buildScript' } | undefined
  >();

  const columns: ListPageTableColumn<Executable>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (executable) => executable.name,
    },
    {
      header: 'Type',
      field: 'type',
      render: (executable) => executableTypeText[executable.type],
    },
    {
      header: 'Source File',
      field: 'sourceFile',
      render: (executable) => (
        <div
          className="text-blue-700 cursor-pointer"
          onClick={() =>
            setScriptData({
              executable,
              field: 'sourceFile',
            })
          }
        >
          {executable.sourceFile.name}
        </div>
      ),
    },
    {
      header: 'Build Script',
      field: 'buildScript',
      render: (executable) =>
        executable.buildScript ? (
          <div
            className="text-blue-700 cursor-pointer"
            onClick={() =>
              setScriptData({
                executable,
                field: 'buildScript',
              })
            }
          >
            {executable.buildScript.name}
          </div>
        ) : (
          '-'
        ),
    },
    {
      header: 'Docker Image',
      field: 'dockerImage',
      render: (executable) => executable.dockerImage ?? '-',
    },
    {
      header: 'Default',
      field: 'default',
      render: (executable) => (executable.default ? 'Yes' : 'No'),
    },
  ];

  return (
    <div className="p-4">
      <DataTable<Executable>
        header="Executables"
        dataFetcher={fetchAll}
        dataDependencies={[updateCount]}
        columns={columns}
        ItemForm={isUserAdmin ? ExecutableForm : undefined}
        onDelete={remove}
        withoutActions={!isUserAdmin}
        onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      />
      <CodeEditorDialog
        file={scriptData?.executable[scriptData.field]}
        readOnly={!isUserAdmin}
        lang={scriptData?.executable[scriptData.field].name.endsWith('.cpp') ? 'c_cpp' : 'sh'}
        dismiss={async () => {
          await fetchAll();
          setScriptData(undefined);
        }}
        submit={async () => {
          await update(scriptData!.executable);
          setScriptData(undefined);
        }}
      />
    </div>
  );
});

export default ExecutablesList;
