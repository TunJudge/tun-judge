import React from 'react';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { rootStore } from '../../../core/stores/RootStore';
import { observer } from 'mobx-react';

type AdminNavbarProps = { toggleSidebar: () => void };

const AdminNavbar: React.FC<AdminNavbarProps> = observer(({ toggleSidebar }) => {
  const history = useHistory();
  const { profile } = rootStore;

  return (
    <Menu borderless>
      <Menu.Item as="a" onClick={() => toggleSidebar()}>
        <Icon name="unordered list" />
      </Menu.Item>
      <Menu.Menu position="right">
        <Dropdown
          item
          floating
          icon={
            <>
              <Icon name="user circle" />
              {profile?.username ?? '-'}
            </>
          }
        >
          <Dropdown.Menu>
            <Dropdown.Item text="Logout" icon="log out" onClick={() => history.push('/logout')} />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
});

export default AdminNavbar;
