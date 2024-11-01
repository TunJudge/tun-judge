import { BracesIcon, EditIcon, PlusIcon, RefreshCcw, Trash2Icon } from 'lucide-react';
import { FC, useState } from 'react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  DataTableColumn,
  useLayoutContext,
} from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { CodeEditorSheet, PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useSorting } from '@core/hooks';
import { useDeleteLanguage, useFindManyLanguage } from '@core/queries';

import { LanguageForm } from './LanguageForm';

export type Language = Prisma.LanguageGetPayload<{
  include: { buildScript: true };
}>;

export const LanguagesList: FC = () => {
  const { showIds } = useLayoutContext();
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [language, setLanguage] = useState<Partial<Language>>();
  const [buildScript, setScriptData] = useState<Partial<Language>>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const { orderBy, sorting, setSorting } = useSorting<Language>();

  const {
    data: languages = [],
    isLoading,
    refetch,
  } = useFindManyLanguage({ include: { buildScript: true }, orderBy });
  const { mutateAsync: deleteLanguage } = useDeleteLanguage();

  const columns: DataTableColumn<Language>[] = [
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
      header: 'Docker Image',
      field: 'dockerImage',
    },
    {
      header: 'Build Script',
      field: 'buildScriptName',
      render: (language) => (
        <div
          className="cursor-pointer text-blue-700 dark:text-blue-500"
          onClick={() => setScriptData(language)}
        >
          {language.buildScriptName.replace(/^[^/]*\//g, '')}
        </div>
      ),
    },
    {
      header: 'Allow Submit?',
      field: 'allowSubmit',
      render: (language) => (language.allowSubmit ? 'Yes' : 'No'),
    },
    {
      header: 'Allow Judge?',
      field: 'allowJudge',
      render: (language) => (language.allowJudge ? 'Yes' : 'No'),
    },
    {
      header: 'Extensions',
      field: 'extensions',
      render: (language) => language.extensions.join(', '),
    },
  ];

  return (
    //   <CodeEditorDialog
    //     file={scriptData?.buildScript}
    //     readOnly={!isUserAdmin}
    //     dismiss={async () => {
    //       await fetchAll();
    //       setScriptData(undefined);
    //     }}
    //     submit={async () => {
    //       await update(scriptData!);
    //       setScriptData(undefined);
    //     }}
    //   />
    <PageTemplate
      icon={BracesIcon}
      title="Languages"
      actions={
        <>
          <Button prefixIcon={RefreshCcw} onClick={() => refetch()} />
          <Button
            prefixIcon={PlusIcon}
            onClick={() => setLanguage({ extensions: [], allowJudge: true, allowSubmit: true })}
          />
        </>
      }
      fullWidth
    >
      <DataTable
        rows={languages}
        columns={columns}
        isLoading={isLoading}
        sorting={{ sorting, onSortingChange: setSorting }}
        actions={[
          {
            icon: EditIcon,
            hide: !isUserAdmin,
            onClick: setLanguage,
          },
          {
            color: 'red',
            icon: Trash2Icon,
            hide: !isUserAdmin,
            onClick: (item) =>
              setDeleteDialogState({
                open: true,
                onConfirm: () => deleteLanguage({ where: { id: item.id } }),
              }),
          },
        ]}
      />
      <ConfirmDialog
        open={deleteDialogState?.open ?? false}
        title="Delete Language"
        onConfirm={deleteDialogState?.onConfirm ?? (() => undefined)}
        onClose={() => setDeleteDialogState(undefined)}
      >
        Are you sure you want to delete this language?
      </ConfirmDialog>
      <CodeEditorSheet
        fileName={buildScript?.buildScriptName}
        readOnly={!isUserAdmin}
        onClose={() => setScriptData(undefined)}
      />
      <LanguageForm
        language={language}
        onSubmit={() => setLanguage(undefined)}
        onClose={() => setLanguage(undefined)}
      />
    </PageTemplate>
  );
};
