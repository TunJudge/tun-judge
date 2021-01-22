import { observer } from 'mobx-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { rootStore } from '../../core/stores/RootStore';
import ActiveContestSelector from '../shared/ActiveContestSelector';

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
        <ActiveContestSelector />
        <Dropdown
          item
          floating
          icon={
            <>
              <Icon name="user circle" />
              {profile?.name ?? '-'}
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
