import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../../core/stores/RootStore';
import LanguageForm from './LanguageForm';
import { Language } from '../../../../core/models';
import ScriptEditor from '../../../shared/ScriptEditor';
import ListPage, { ListPageTableColumn } from '../../../shared/ListPage';

const LanguagesList: React.FC = observer(() => {
  const [scriptData, setScriptData] = useState<Language | undefined>();
  const {
    languagesStore: { data, fetchAll, create, update, remove },
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
      render: (language) => (language.allowSubmit ? 'true' : 'false'),
    },
    {
      header: 'Allow Judge?',
      field: 'allowJudge',
      render: (language) => (language.allowJudge ? 'true' : 'false'),
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
        ItemForm={LanguageForm}
        onDelete={remove}
        onRefresh={fetchAll}
        onFormSubmit={(item) => (item.id ? update(item) : create(item))}
      />
      {scriptData && (
        <ScriptEditor
          file={scriptData.buildScript}
          dismiss={async () => {
            await fetchAll();
            setScriptData(undefined);
          }}
          submit={async () => {
            await update(scriptData);
            setScriptData(undefined);
          }}
        />
      )}
    </>
  );
});

export default LanguagesList;
