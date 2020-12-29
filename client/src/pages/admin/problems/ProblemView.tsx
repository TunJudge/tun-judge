import React, { useEffect } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import Spinner from '../../shared/Spinner';
import { Grid, Header, Segment, Table } from 'semantic-ui-react';

const ProblemView: React.FC<RouteChildrenProps<{ id?: string }>> = observer(({ match }) => {
  const { problemsStore } = rootStore;
  const { item } = problemsStore;

  useEffect(() => {
    problemsStore.fetchById(parseInt(match!.params.id!)).catch(() => location.assign('/'));
  }, [problemsStore, match]);

  return !item.id ? (
    <Spinner />
  ) : (
    <Grid columns="equal">
      <Grid.Row style={{ height: '93vh' }}>
        <Grid.Column style={{ paddingRight: '.5rem' }}>
          <Segment.Group>
            <Segment as={Header}>Problem &apos;{item.name}&apos;</Segment>
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
          <Segment.Group>
            <Segment as={Header}>Test cases</Segment>
            <Segment style={{ height: '51vh', overflowY: 'auto' }} />
          </Segment.Group>
        </Grid.Column>
        <Grid.Column style={{ paddingLeft: '.5rem' }}>
          <Segment style={{ height: '100%' }}>
            <embed src={item.problemText + '#view=Fit'} width="100%" height="100%" />
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});

export default ProblemView;
