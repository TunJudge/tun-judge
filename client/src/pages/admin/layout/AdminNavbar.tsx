import React from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

type AdminNavbarProps = { toggleSidebar: () => void };

const AdminNavbar: React.FC<AdminNavbarProps> = ({ toggleSidebar }) => {
  const history = useHistory();

  return (
    <Menu borderless>
      <Menu.Item as="a" onClick={() => toggleSidebar()}>
        <Icon name="unordered list" />
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <Button color="red" onClick={() => history.push('/logout')}>
            <Icon name="log out" />
            Logout
          </Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default AdminNavbar;
