import React from 'react';
import { Grid, Loader } from 'semantic-ui-react';

const Spinner: React.FC = () => (
  <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
    <Grid.Column>
      <Loader active inline />
    </Grid.Column>
  </Grid>
);

export default Spinner;
