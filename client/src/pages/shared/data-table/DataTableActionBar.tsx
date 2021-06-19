import React from 'react';
import { Header, Icon, Menu, Popup, Segment } from 'semantic-ui-react';

type Props = {
  header: string;
  canAdd: boolean;
  onAdd: () => void;
  onRefresh?: () => void;
};

const DataTableActionBar: React.FC<Props> = ({ header, canAdd, onAdd, onRefresh }) => {
  return (
    <Segment as={Menu} style={{ padding: 0 }} borderless>
      <Menu.Item>
        <Header>{header}</Header>
      </Menu.Item>
      <Menu.Menu position="right">
        {onRefresh && (
          <Popup
            trigger={
              <Menu.Item onClick={onRefresh}>
                <Icon name="refresh" />
              </Menu.Item>
            }
            position="bottom center"
          >
            Refresh
          </Popup>
        )}
        {canAdd && (
          <Popup
            trigger={
              <Menu.Item color="green" onClick={onAdd}>
                <Icon name="plus" />
              </Menu.Item>
            }
            position="bottom center"
          >
            Add
          </Popup>
        )}
      </Menu.Menu>
    </Segment>
  );
};

export default DataTableActionBar;
