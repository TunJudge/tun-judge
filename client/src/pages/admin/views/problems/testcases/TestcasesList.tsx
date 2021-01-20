import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Problem, Testcase } from '../../../../../core/models';
import { Button, Header, Icon, Menu, Popup, Segment, Table } from 'semantic-ui-react';
import TestcaseForm from './TestcaseForm';
import { rootStore } from '../../../../../core/stores/RootStore';
import { CheckBoxField } from '../../../../shared/extended-form';
import TestcaseContentView from './TestcaseContentView';
import TestcaseBulkUploader from './TestcaseBulkUploader';
import { formatBytes } from '../../../../../core/helpers';

type TestcasesListProps = {
  problem: Problem;
  rowHeight: number;
  problemInfoHeight: number;
};

const TestcasesList: React.FC<TestcasesListProps> = observer(
  ({ problem, rowHeight, problemInfoHeight }) => {
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [formTestcase, setFormTestcase] = useState<Partial<Testcase>>({
      problem: problem,
    });
    const [contentViewData, setContentViewData] = useState<{
      testcase: Testcase | undefined;
      field: 'input' | 'output';
    }>({ testcase: undefined, field: 'input' });
    const {
      isUserAdmin,
      testcasesStore: { data, fetchAll, create, update, remove, move },
    } = rootStore;

    const dismissForm = async () => {
      setFormTestcase({ problem: problem });
      setFormOpen(false);
      await fetchAll();
    };

    return (
      <Segment.Group>
        <Segment as={Menu} style={{ padding: 0 }} borderless>
          <Menu.Item>
            <Header>Testcases</Header>
          </Menu.Item>
          {isUserAdmin && (
            <Menu.Item position="right">
              <TestcaseBulkUploader problem={problem} />

              <Button color="blue" icon onClick={() => setFormOpen(true)}>
                <Icon name="plus" />
              </Button>
            </Menu.Item>
          )}
        </Segment>
        <Segment style={{ height: rowHeight - problemInfoHeight - 66, overflowY: 'auto' }}>
          <Table celled structured>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center" width="1">
                  #
                </Table.HeaderCell>
                <Table.HeaderCell>Content</Table.HeaderCell>
                <Table.HeaderCell width="1">Sample</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                {isUserAdmin && <Table.HeaderCell width="1" />}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.length === 0 ? (
                <Table.Row textAlign="center">
                  <Table.Cell colSpan="10">No data</Table.Cell>
                </Table.Row>
              ) : (
                data.map((testcase) => [
                  <Table.Row key={`${testcase.id}-in`}>
                    <Table.Cell rowSpan={2} textAlign="center">
                      {testcase.rank > 0 && (
                        <Icon
                          className="cursor-pointer"
                          name="angle up"
                          onClick={() => move(testcase.id, 'up')}
                          style={{ marginRight: 0 }}
                        />
                      )}
                      <br />
                      {testcase.rank}
                      <br />
                      {testcase.rank < data.length - 1 && (
                        <Icon
                          className="cursor-pointer"
                          name="angle down"
                          onClick={() => move(testcase.id, 'down')}
                          style={{ marginRight: 0 }}
                        />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <a onClick={() => setContentViewData({ testcase, field: 'input' })}>
                        {`test.${testcase.rank}.in`}
                      </a>{' '}
                      {formatBytes(testcase.input.size)}
                      <Popup
                        content={testcase.input.md5Sum}
                        position="top center"
                        trigger={<Icon name="hashtag" />}
                      />
                    </Table.Cell>
                    <Table.Cell rowSpan={2} textAlign="center">
                      <CheckBoxField<Testcase>
                        entity={testcase}
                        field="sample"
                        label=""
                        onChange={() => update(testcase)}
                      />
                    </Table.Cell>
                    <Table.Cell rowSpan={2}>{testcase.description ?? '-'}</Table.Cell>
                    {isUserAdmin && (
                      <Table.Cell rowSpan={2} textAlign="center">
                        <Icon
                          className="cursor-pointer"
                          name="edit"
                          onClick={() => {
                            setFormTestcase(testcase);
                            setFormOpen(true);
                          }}
                          style={{ marginRight: 0 }}
                        />
                        <br />
                        <Icon
                          className="cursor-pointer"
                          name="trash"
                          color="red"
                          onClick={() => remove(testcase.id)}
                          style={{ marginRight: 0, marginTop: '.5rem' }}
                        />
                      </Table.Cell>
                    )}
                  </Table.Row>,
                  <Table.Row key={`${testcase.id}-ans`}>
                    <Table.Cell>
                      <a onClick={() => setContentViewData({ testcase, field: 'output' })}>
                        {`test.${testcase.rank}.out`}
                      </a>{' '}
                      {formatBytes(testcase.output.size)}
                      <Popup
                        content={testcase.output.md5Sum}
                        position="top center"
                        trigger={<Icon name="hashtag" />}
                      />
                    </Table.Cell>
                  </Table.Row>,
                ])
              )}
            </Table.Body>
          </Table>
        </Segment>
        <TestcaseForm
          open={formOpen}
          testcase={formTestcase}
          dismiss={dismissForm}
          submit={async () => {
            if (formTestcase.id) {
              await update(formTestcase);
            } else {
              await create(formTestcase);
            }
            await dismissForm();
          }}
        />
        {contentViewData.testcase && (
          <TestcaseContentView
            testcase={contentViewData.testcase}
            field={contentViewData.field}
            dismiss={() => setContentViewData({ testcase: undefined, field: 'input' })}
          />
        )}{' '}
      </Segment.Group>
    );
  },
);

export default TestcasesList;
