import { BracesIcon, EditIcon, PlusIcon, RefreshCcw, Trash2Icon } from 'lucide-react';
import { FC, useState } from 'react';
import { Button, ConfirmDialog, DataTable, DataTableColumn } from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { PageTemplate } from '@core/components';
import { useAuthContext } from '@core/contexts';
import { useSorting } from '@core/hooks';
import { useDeleteLanguage, useFindManyLanguage } from '@models';

import { LanguageForm } from './LanguageForm';

export type Language = Prisma.LanguageGetPayload<{
  include: { buildScript: true };
}>;

export const LanguagesList: FC = () => {
  const { profile } = useAuthContext();
  const isUserAdmin = profile?.role.name === 'admin';

  const [language, setLanguage] = useState<Partial<Language>>();
  const [buildScript, setScriptData] = useState<Partial<Language>>();
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    onConfirm: () => void;
  }>();
  const { sorting, setSorting } = useSorting<Language>();

  const {
    data: languages = [],
    isLoading,
    refetch,
  } = useFindManyLanguage({
    include: { buildScript: true },
    orderBy: sorting ? { [sorting.field]: sorting.direction } : undefined,
  });
  const { mutate: deleteLanguage } = useDeleteLanguage();

  const columns: DataTableColumn<Language>[] = [
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
    // <div className="p-4">
    //   <DataTable<Language>
    //     header="Languages"
    //     dataFetcher={fetchAll}
    //     dataDependencies={[updateCount]}
    //     columns={columns}
    //     ItemForm={isUserAdmin ? LanguageForm : undefined}
    //     onDelete={remove}
    //     withoutActions={!isUserAdmin}
    //     onFormSubmit={(item) => (item.id ? update(item) : create(item))}
    //   />
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
    // </div>
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
        Are you sure you want to delete this team?
      </ConfirmDialog>
      <LanguageForm
        language={language}
        onSubmit={() => setLanguage(undefined)}
        onClose={() => setLanguage(undefined)}
      />
    </PageTemplate>
  );
};
