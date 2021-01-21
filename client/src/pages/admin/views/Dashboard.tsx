import React from 'react';
import { observer } from 'mobx-react';
import { Container, Statistic } from 'semantic-ui-react';

const Dashboard: React.FC = observer(() => {
  return (
    <Container textAlign="center">
      <Statistic.Group>
        <Statistic>
          <Statistic.Value>XXX</Statistic.Value>
          <Statistic.Label>Submissions</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </Container>
  );
});

export default Dashboard;
