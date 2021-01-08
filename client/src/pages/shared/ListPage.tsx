import React, { PropsWithChildren } from 'react';
import { Button, Header, Icon, Menu, Segment } from 'semantic-ui-react';
import cn from 'classnames';
import { observer } from 'mobx-react';

type ListPageProps = {
  header: string;
  onAdd?: () => void;
  onRefresh?: () => void;
};

const ListPage: React.FC<PropsWithChildren<ListPageProps>> = observer(
  ({ header, onAdd, onRefresh, children }) => {
    return (
      <Segment.Group>
        <Segment as={Menu} style={{ padding: 0 }} borderless>
          <Menu.Item>
            <Header>{header}</Header>
          </Menu.Item>
          <Menu.Item position="right">
            {onRefresh && (
              <Button color="blue" className={cn({ 'mr-2': !!onAdd })} icon onClick={onRefresh}>
                <Icon name="refresh" />
              </Button>
            )}
            {onAdd && (
              <Button color="blue" icon onClick={onAdd}>
                <Icon name="plus" />
              </Button>
            )}
          </Menu.Item>
        </Segment>
        <Segment>{children}</Segment>
      </Segment.Group>
    );
  },
);

export default ListPage;
