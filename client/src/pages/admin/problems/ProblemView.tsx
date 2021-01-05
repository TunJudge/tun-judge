import React, { useEffect, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import ResizeDetector from 'react-resize-detector';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import Spinner from '../../shared/Spinner';
import { Grid, Header, Segment, Table } from 'semantic-ui-react';
import TestcasesList from './testcases/TestcasesList';
import { Problem } from '../../../core/models';

const ProblemView: React.FC<RouteChildrenProps<{ id?: string }>> = observer(({ match }) => {
  const [rowHeight, setRowHeight] = useState<number>(window.innerHeight - 84);
  const [problemInfoHeight, setProblemInfoHeight] = useState<number>(0);
  const {
    problemsStore: { item, fetchById, cleanItem },
  } = rootStore;

  useEffect(() => {
    fetchById(parseInt(match!.params.id!)).catch(() => location.assign('/'));
    return () => cleanItem();
  }, [fetchById, cleanItem, match]);

  useEffect(() => {
    window.onresize = () => setRowHeight(window.innerHeight - 84);
  }, []);

  return !item.id ? (
    <Spinner />
  ) : (
    <Grid columns="equal">
      <Grid.Row style={{ height: rowHeight }}>
        <Grid.Column style={{ paddingRight: '.5rem' }}>
          <ResizeDetector handleHeight onResize={(_, height) => setProblemInfoHeight(height)}>
            {() => (
              <Segment.Group>
                <Segment>
                  <Header>Problem &apos;{item.name}&apos;</Header>
                </Segment>
                <Segment>
                  <Table striped celled>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell width={6}>ID</Table.Cell>
                        <Table.Cell width={10}>{item.id}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={6}>Name</Table.Cell>
                        <Table.Cell width={10}>{item.name}</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={6}>Time limit</Table.Cell>
                        <Table.Cell width={10}>{item.timeLimit} s</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={6}>Memory limit</Table.Cell>
                        <Table.Cell width={10}>{item.memoryLimit} Kb</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell width={6}>Output limit</Table.Cell>
                        <Table.Cell width={10}>{item.outputLimit} Kb</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Segment>
              </Segment.Group>
            )}
          </ResizeDetector>
          <TestcasesList
            problem={item as Problem}
            rowHeight={rowHeight}
            problemInfoHeight={problemInfoHeight}
          />
        </Grid.Column>
        <Grid.Column style={{ paddingLeft: '.5rem' }}>
          <Segment style={{ height: '100%' }}>
            <embed
              src={`data:${item.file?.type};headers=filename%3D${encodeURIComponent(
                item.file!.name,
              )};base64,${item.file?.content.payload}`}
              type={item.file?.type}
              width="100%"
              height="100%"
            />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});

export default ProblemView;
