import { RefreshIcon } from '@heroicons/react/solid';
import { observer } from 'mobx-react';
import React from 'react';

const ClarificationsList: React.FC = observer(() => {
  return (
    <>
      <div className="flex items-center shadow rounded-md border w-full justify-between px-4 py-2 bg-white">
        <div className="text-xl font-medium">Clarifications</div>
        <div className="flex items-center space-x-2">
          <div className="hover:bg-gray-200 rounded-md p-2 cursor-pointer">
            <RefreshIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
      {/*<Grid style={{ height: '87vh' }}>*/}
      {/*  <Grid.Column width="3" style={{ paddingRight: 0 }}>*/}
      {/*    <Menu vertical fluid>*/}
      {/*      <Menu.Item active name="home" />*/}
      {/*      <Menu.Item name="messages" />*/}
      {/*      <Menu.Item name="friends" />*/}
      {/*    </Menu>*/}
      {/*  </Grid.Column>*/}
      {/*  <Grid.Column width="13" stretched></Grid.Column>*/}
      {/*</Grid>*/}
    </>
  );
});

export default ClarificationsList;
