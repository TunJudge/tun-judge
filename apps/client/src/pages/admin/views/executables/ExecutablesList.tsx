import { CogIcon, EditIcon, PlusIcon, RefreshCcw, Trash2Icon } from 'lucide-react';
import { FC, useState } from 'react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  DataTableColumn,
  useLayoutContext,
} from 'tw-react-components';

import { CodeEditorSheet, PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useSorting } from '@core/hooks';
import { Executable, ExecutableType } from '@core/prisma';
import { useDeleteExecutable, useFindManyExecutable } from '@core/queries';

import { ExecutableForm } from './ExecutableForm';

export const executableTypeText: Record<ExecutableType, string> = {
  RUNNER: 'Runner',
  CHECKER: 'Checker',
};

export const ExecutablesList: FC = () => {
  const { showIds } = useLayoutContext();
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [executable, setExecutable] = useState<Partial<Executable>>();
  const [scriptFileName, setScriptFileName] = useState<string>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const { orderBy, sorting, setSorting } = useSorting<Executable>();

  const { data: executables = [], isLoading, refetch } = useFindManyExecutable({ orderBy });
  const { mutateAsync: deleteExecutable } = useDeleteExecutable();

  const columns: DataTableColumn<Executable>[] = [
    {
      header: '#',
      field: 'id',
      hide: !showIds,
    },
    {
      header: 'Name',
      field: 'name',
    },
    {
      header: 'Type',
      field: 'type',
      render: (executable) => executableTypeText[executable.type],
    },
    {
      header: 'Source File',
      field: 'sourceFileName',
      render: (executable) => (
        <div
          className="cursor-pointer text-blue-700"
          onClick={() => setScriptFileName(executable.sourceFileName)}
        >
          {executable.sourceFileName.replace(/^([^/]*\/)+/g, '')}
        </div>
      ),
    },
    {
      header: 'Build Script',
      field: 'buildScriptName',
      render: (executable) =>
        executable.buildScriptName ? (
          <div
            className="cursor-pointer text-blue-700"
            onClick={() => setScriptFileName(executable.buildScriptName ?? undefined)}
          >
            {executable.buildScriptName.replace(/^([^/]*\/)+/g, '')}
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
    <PageTemplate
      icon={CogIcon}
      title="Executables"
      actions={
        <>
          <Button prefixIcon={RefreshCcw} onClick={() => refetch()} />
          <Button prefixIcon={PlusIcon} onClick={() => setExecutable({})} />
        </>
      }
      fullWidth
    >
      <DataTable
        rows={executables}
        columns={columns}
        isLoading={isLoading}
        sorting={{ sorting, onSortingChange: setSorting }}
        actions={[
          {
            icon: EditIcon,
            hide: !isUserAdmin,
            onClick: setExecutable,
          },
          {
            color: 'red',
            icon: Trash2Icon,
            hide: !isUserAdmin,
            onClick: (item) =>
              setDeleteDialogState({
                open: true,
                onConfirm: () => deleteExecutable({ where: { id: item.id } }),
              }),
          },
        ]}
      />
      <ConfirmDialog
        open={deleteDialogState?.open ?? false}
        title="Delete Executable"
        onConfirm={deleteDialogState?.onConfirm ?? (() => undefined)}
        onClose={() => setDeleteDialogState(undefined)}
      >
        Are you sure you want to delete this executable?
      </ConfirmDialog>
      <CodeEditorSheet
        fileName={scriptFileName}
        lang={scriptFileName?.endsWith('.cpp') ? 'c_cpp' : 'sh'}
        readOnly={!isUserAdmin}
        onClose={() => setScriptFileName(undefined)}
      />
      <ExecutableForm
        executable={executable}
        onSubmit={() => setExecutable(undefined)}
        onClose={() => setExecutable(undefined)}
      />
    </PageTemplate>
  );
};
