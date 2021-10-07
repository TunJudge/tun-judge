import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Language } from '../../../../core/models';
import { rootStore } from '../../../../core/stores/RootStore';
import DataTable, { ListPageTableColumn } from '../../../shared/data-table/DataTable';
import { CodeEditorDialog } from '../../../shared/dialogs';
import LanguageForm from './LanguageForm';

const LanguagesList: React.FC = observer(() => {
  const [scriptData, setScriptData] = useState<Language | undefined>();
  const {
    isUserAdmin,
    languagesStore: { updateCount, fetchAll, create, update, remove },
  } = rootStore;

  const columns: ListPageTableColumn<Language>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (language) => language.name,
    },
    {
      header: 'Docker Image',
      field: 'dockerImage',
      render: (language) => language.dockerImage,
    },
    {
      header: 'Build Script',
      field: 'buildScript',
      render: (language) => (
        <div className="text-blue-700 cursor-pointer" onClick={() => setScriptData(language)}>
          {language.buildScript.name}
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
    <>
      <DataTable<Language>
        header="Languages"
        dataFetcher={fetchAll}
        dataDependencies={[updateCount]}
        columns={columns}
        ItemForm={isUserAdmin ? LanguageForm : undefined}
        onDelete={remove}
        withoutActions={!isUserAdmin}
        onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      />
      <CodeEditorDialog
        file={scriptData?.buildScript}
        readOnly={!isUserAdmin}
        dismiss={async () => {
          await fetchAll();
          setScriptData(undefined);
        }}
        submit={async () => {
          await update(scriptData!);
          setScriptData(undefined);
        }}
      />
    </>
  );
});

export default LanguagesList;
