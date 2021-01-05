import React, { useEffect, useState } from 'react';
import { Button, Header, Icon, Menu, Segment, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import LanguageForm from './LanguageForm';
import { Language } from '../../../core/models';
import LanguageScriptView from './LanguageScriptView';

const LanguagesList: React.FC = observer(() => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formLanguage, setFormLanguage] = useState<Language>({} as Language);
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

  const dismissForm = () => {
    setFormLanguage({} as Language);
    setFormOpen(false);
  };

  return (
    <Segment.Group>
      <Segment as={Menu} style={{ padding: 0 }} borderless>
        <Menu.Item>
          <Header>Languages</Header>
        </Menu.Item>
        <Menu.Item position="right">
          <Button color="blue" icon onClick={() => setFormOpen(true)}>
            <Icon name="plus" />
          </Button>
        </Menu.Item>
      </Segment>
      <Segment>
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">ID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Build Script</Table.HeaderCell>
              <Table.HeaderCell>Run Script</Table.HeaderCell>
              <Table.HeaderCell>Allow Submit</Table.HeaderCell>
              <Table.HeaderCell>Allow Judge</Table.HeaderCell>
              <Table.HeaderCell>Extensions</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.length === 0 ? (
              <Table.Row textAlign="center">
                <Table.Cell colSpan="10">No data</Table.Cell>
              </Table.Row>
            ) : (
              data.map((language) => (
                <Table.Row key={language.id}>
                  <Table.Cell textAlign="center">{language.id}</Table.Cell>
                  <Table.Cell>{language.name}</Table.Cell>
                  <Table.Cell>
                    <a
                      onClick={() => {
                        setScriptViewData({ language, field: 'buildScript' });
                        setScriptViewOpen(true);
                      }}
                    >
                      {language.buildScript.name}
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    {' '}
                    <a
                      onClick={() => {
                        setScriptViewData({ language, field: 'runScript' });
                        setScriptViewOpen(true);
                      }}
                    >
                      {language.runScript.name}
                    </a>
                  </Table.Cell>
                  <Table.Cell>{language.allowSubmit ? 'true' : 'false'}</Table.Cell>
                  <Table.Cell>{language.allowJudge ? 'true' : 'false'}</Table.Cell>
                  <Table.Cell>{language.extensions.join(', ')}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Icon
                      name="edit"
                      onClick={() => {
                        setFormLanguage(language);
                        setFormOpen(true);
                      }}
                      style={{ cursor: 'pointer', marginRight: '25%' }}
                    />
                    <Icon
                      name="trash"
                      color="red"
                      onClick={() => remove(language.id)}
                      style={{ cursor: 'pointer', marginRight: '0' }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Segment>
      {formOpen && (
        <LanguageForm
          language={formLanguage as Language}
          dismiss={dismissForm}
          submit={async () => {
            if (formLanguage.id) {
              await update(formLanguage);
            } else {
              await create(formLanguage);
            }
            dismissForm();
          }}
        />
      )}
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
    </Segment.Group>
  );
});

export default LanguagesList;
