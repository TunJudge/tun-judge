import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import ProblemSet from '../../shared/ProblemSet';
import Scoreboard from '../../shared/Scoreboard';
import SubmissionsList from './SubmissionsList';

const HomeView: React.FC = () => {
  return (
    <>
      <Scoreboard compact />
      <Container>
        <Grid columns="equal" stackable>
          <Grid.Row>
            <Grid.Column style={{ padding: '.5rem' }}>
              <ProblemSet listMode />
            </Grid.Column>
            <Grid.Column style={{ padding: '.5rem' }}>
              <SubmissionsList />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
};

export default HomeView;
