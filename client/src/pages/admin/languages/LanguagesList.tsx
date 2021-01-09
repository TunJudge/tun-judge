import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import LanguageForm from './LanguageForm';
import { Language } from '../../../core/models';
import LanguageScriptView from './LanguageScriptView';
import ListPage, { ListPageTableColumn } from '../../shared/ListPage';

const LanguagesList: React.FC = observer(() => {
  const [scriptViewOpen, setScriptViewOpen] = useState<boolean>(false);
  const [scriptViewData, setScriptViewData] = useState<{
    language: Language;
    field: 'buildScript' | 'runScript';
  }>({ language: {} as Language, field: 'buildScript' });
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
      header: 'Build Script',
      field: 'buildScript',
      render: (language) => (
        <a
          onClick={() => {
            setScriptViewData({ language, field: 'buildScript' });
            setScriptViewOpen(true);
          }}
        >
          {language.buildScript.name}
        </a>
      ),
    },
    {
      header: 'Run Script',
      field: 'runScript',
      render: (language) => (
        <a
          onClick={() => {
            setScriptViewData({ language, field: 'runScript' });
            setScriptViewOpen(true);
          }}
        >
          {language.runScript.name}
        </a>
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
      <LanguageScriptView
        open={scriptViewOpen}
        language={scriptViewData.language}
        field={scriptViewData.field}
        dismiss={async () => {
          await fetchAll();
          setScriptViewOpen(false);
        }}
        submit={async () => {
          await update(scriptViewData.language);
          setScriptViewOpen(false);
        }}
      />
    </>
  );
});

export default LanguagesList;
