import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { Executable, ExecutableType } from '../../../../core/models';
import { hostname, rootStore } from '../../../../core/stores/RootStore';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import ScriptEditor from '../../../shared/ScriptEditor';
import ExecutableForm from './ExecutableForm';

const executableTypeText: Record<ExecutableType, string> = { RUNNER: 'Runner', CHECKER: 'Checker' };

const ExecutablesList: React.FC = observer(() => {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [scriptData, setScriptData] = useState<
    { executable: Executable; field: 'file' | 'buildScript' } | undefined
  >();
  const {
    isUserAdmin,
    executablesStore: { data, fetchAll, create, update, remove, unzip },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
      field: 'file',
      render: (executable) => (
        <a
          onClick={() =>
            setScriptData({
              executable,
              field: 'file',
            })
          }
        >
          {executable.file.name}
        </a>
      ),
    },
    {
      header: 'Build Script',
      field: 'buildScript',
      render: (executable) =>
        executable.buildScript ? (
          <a
            onClick={() =>
              setScriptData({
                executable,
                field: 'buildScript',
              })
            }
          >
            {executable.buildScript.name}
          </a>
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
    <>
      <ListPage<Executable>
        header="Executables"
        data={data}
        columns={columns}
        ItemForm={isUserAdmin ? ExecutableForm : undefined}
        onDelete={remove}
        onRefresh={fetchAll}
        withoutActions={!isUserAdmin}
        extraActions={
          <Button
            className="mr-2"
            color="blue"
            icon
            onClick={() => uploadInputRef.current?.click()}
          >
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
        zipUrl={({ id }) => `${hostname}/api/executables/${id}/zip`}
        onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      />
      {scriptData && (
        <ScriptEditor
          file={scriptData.executable[scriptData.field]}
          lang={scriptData.executable[scriptData.field].name.endsWith('.cpp') ? 'c_cpp' : 'sh'}
          dismiss={async () => {
            await fetchAll();
            setScriptData(undefined);
          }}
          submit={
            isUserAdmin
              ? async () => {
                  await update(scriptData.executable);
                  setScriptData(undefined);
                }
              : undefined
          }
        />
      )}
    </>
  );
});

export default ExecutablesList;
