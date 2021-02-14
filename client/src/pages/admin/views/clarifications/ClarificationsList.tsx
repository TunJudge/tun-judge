import { observer } from 'mobx-react';
import React from 'react';
import { Grid, Header, Icon, Menu, Popup, Segment } from 'semantic-ui-react';

const ClarificationsList: React.FC = observer(() => {
  return (
    <>
      <Segment as={Menu} style={{ padding: 0 }} borderless>
        <Menu.Item>
          <Header>Clarifications</Header>
        </Menu.Item>
        <Menu.Menu position="right">
          <Popup
            trigger={
              <Menu.Item>
                <Icon name="refresh" />
              </Menu.Item>
            }
            position="bottom center"
          >
            Refresh
          </Popup>
        </Menu.Menu>
      </Segment>
      <Grid style={{ height: '87vh' }}>
        <Grid.Column width="3" style={{ paddingRight: 0 }}>
          <Menu vertical fluid>
            <Menu.Item active name="home" />
            <Menu.Item name="messages" />
            <Menu.Item name="friends" />
          </Menu>
        </Grid.Column>
        <Grid.Column width="13" stretched></Grid.Column>
      </Grid>
    </>
  );
});

export default ClarificationsList;
