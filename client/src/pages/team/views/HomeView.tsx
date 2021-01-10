import React from 'react';
import { Grid } from 'semantic-ui-react';
import SubmissionsList from './SubmissionsList';
import ClarificationsList from './ClarificationsList';

const HomeView: React.FC = () => {
  return (
    <Grid columns="equal" stackable>
      <Grid.Row centered>team row</Grid.Row>
      <Grid.Row>
        <Grid.Column style={{ paddingRight: '.5rem' }}>
          <SubmissionsList />
        </Grid.Column>
        <Grid.Column style={{ paddingLeft: '.5rem' }}>
          <ClarificationsList />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default HomeView;
