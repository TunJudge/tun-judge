import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Language } from '../../../../core/models';
import { hostname, rootStore } from '../../../../core/stores/RootStore';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';
import ScriptEditor from '../../../shared/ScriptEditor';
import LanguageForm from './LanguageForm';

const LanguagesList: React.FC = observer(() => {
  const [scriptData, setScriptData] = useState<Language | undefined>();
  const {
    isUserAdmin,
    languagesStore: { data, fetchAll, create, update, remove, unzip },
  } = rootStore;

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
        <a onClick={() => setScriptData(language)}>{language.buildScript.name}</a>
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
      <ListPage<Language>
        header="Languages"
        data={data}
        columns={columns}
        ItemForm={isUserAdmin ? LanguageForm : undefined}
        onDelete={remove}
        onRefresh={fetchAll}
        withoutActions={!isUserAdmin}
        unzip={isUserAdmin ? unzip : undefined}
        zipUrl={({ id }) => `${hostname}/api/languages/${id}/zip`}
        zipAllUrl={`${hostname}/api/languages/zip/all`}
        onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      />
      {scriptData && (
        <ScriptEditor
          file={scriptData.buildScript}
          dismiss={async () => {
            await fetchAll();
            setScriptData(undefined);
          }}
          submit={
            isUserAdmin
              ? async () => {
                  await update(scriptData);
                  setScriptData(undefined);
                }
              : undefined
          }
        />
      )}
    </>
  );
});

export default LanguagesList;
