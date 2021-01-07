import React, { useEffect, useState } from 'react';
import { Button, Header, Icon, Menu, Segment, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { rootStore } from '../../../core/stores/RootStore';
import UserForm from './UserForm';
import { User } from '../../../core/models';
import moment from 'moment';
import { MOMENT_DEFAULT_FORMAT } from '../../shared/extended-form';

const GroupedUsersRows: React.FC<{
  list: User[];
  label: string;
  labelBackgroundColor?: string;
  onUpdate: (user: User) => void;
  onDelete: (user: User) => void;
}> = observer(({ list, label, labelBackgroundColor, onUpdate, onDelete }) => {
  const { profile } = rootStore;

  return list.length === 0 ? (
    <Table.Row key="admin" textAlign="center">
      <Table.Cell colSpan="9" style={{ backgroundColor: labelBackgroundColor ?? 'white' }}>
        No {label}
      </Table.Cell>
    </Table.Row>
  ) : (
    <>
      {list.map((user) => (
        <Table.Row key={user.id} style={{ backgroundColor: labelBackgroundColor ?? 'white' }}>
          <Table.Cell textAlign="center">{user.id}</Table.Cell>
          <Table.Cell>{user.name}</Table.Cell>
          <Table.Cell>{user.username}</Table.Cell>
          <Table.Cell>{user.email ?? '-'}</Table.Cell>
          <Table.Cell>{user.role.description}</Table.Cell>
          <Table.Cell>
            {user.lastLogin ? moment(user.lastLogin).format(MOMENT_DEFAULT_FORMAT) : '-'}
          </Table.Cell>
          <Table.Cell>{user.lastIpAddress ?? '-'}</Table.Cell>
          <Table.Cell>{user.enabled ? 'true' : 'false'}</Table.Cell>
          <Table.Cell textAlign="center">
            <Icon
              name="edit"
              onClick={() => onUpdate(user)}
              style={{ cursor: 'pointer', marginRight: '0' }}
            />
            {profile && user.username !== profile.username && (
              <Icon
                name="trash"
                color="red"
                onClick={() => onDelete(user)}
                style={{ cursor: 'pointer', marginLeft: '25%', marginRight: '0' }}
              />
            )}
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );
});

const UsersList: React.FC = observer(() => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formUser, setFormUser] = useState<User>({} as User);
  const {
    usersStore: {
      adminUsers,
      teamUsers,
      juryUsers,
      fetchAll,
      fetchAllRoles,
      create,
      update,
      remove,
    },
  } = rootStore;

  useEffect(() => {
    Promise.all([fetchAll(), fetchAllRoles()]);
  }, [fetchAll, fetchAllRoles]);

  const dismissForm = () => {
    setFormUser({} as User);
    setFormOpen(false);
  };

  const handleUpdateUser = (user: User): void => {
    setFormUser(user);
    setFormOpen(true);
  };

  const handleDeleteUser = (user: User): Promise<void> => remove(user.id);

  return (
    <Segment.Group>
      <Segment as={Menu} style={{ padding: 0 }} borderless>
        <Menu.Item>
          <Header>Users</Header>
        </Menu.Item>
        <Menu.Item position="right">
          <Button color="blue" icon onClick={() => setFormOpen(true)}>
            <Icon name="plus" />
          </Button>
        </Menu.Item>
      </Segment>
      <Segment>
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">ID</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Last Login</Table.HeaderCell>
              <Table.HeaderCell>Last Ip Login</Table.HeaderCell>
              <Table.HeaderCell>Enabled</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <GroupedUsersRows
              list={adminUsers}
              label="Admins"
              labelBackgroundColor="#FFC2C2"
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
            />
            <GroupedUsersRows
              list={juryUsers}
              label="Juries"
              labelBackgroundColor="#FFEAC2"
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
            />
            <GroupedUsersRows
              list={teamUsers}
              label="Teams"
              labelBackgroundColor="#B3FFC2"
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
            />
          </Table.Body>
        </Table>
      </Segment>
      {formOpen && (
        <UserForm
          user={formUser as User}
          dismiss={dismissForm}
          submit={async () => {
            if (formUser.id) {
              await update(formUser);
            } else {
              await create(formUser);
            }
            dismissForm();
          }}
        />
      )}
    </Segment.Group>
  );
});

export default UsersList;
