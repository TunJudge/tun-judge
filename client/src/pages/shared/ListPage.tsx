import React, { ReactElement, useState } from 'react';
import { Button, Header, Icon, Menu, Segment, Table } from 'semantic-ui-react';

export type ListPageTableColumn<T> = {
  header: string;
  field: keyof T;
  className?: string;
  render: (obj: T) => React.ReactNode;
  onClick?: (obj: T) => void;
};

type ListPageProps<T> = {
  header: string;
  data: T[];
  columns: ListPageTableColumn<T>[];
  formItemInitValue?: Partial<T>;
  ItemForm: React.FC<{ item: T; dismiss: () => void; submit: (item: T) => void }>;
  onDelete?: (id: number) => void;
  canDelete?: (item: T) => boolean;
  onRefresh?: () => void;
  onFormOpen?: (item: T) => void;
  onFormSubmit?: (item: T) => void;
  onFormDismiss?: () => void;
  rowBackgroundColor?: (item: T) => string;
};

function ListPage<T extends { id: number }>({
  header,
  data,
  columns,
  formItemInitValue,
  ItemForm,
  onDelete,
  canDelete,
  onRefresh,
  onFormOpen,
  onFormSubmit,
  onFormDismiss,
  rowBackgroundColor,
}: ListPageProps<T>): ReactElement {
  const [formItem, setFormItem] = useState<Partial<T>>(formItemInitValue ?? {});
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const openForm = (item: T) => {
    onFormOpen && onFormOpen(item);
    setFormItem(item);
    setFormOpen(true);
  };

  const submitForm = (item: T) => {
    onFormSubmit && onFormSubmit(item);
    dismissForm();
  };

  const dismissForm = () => {
    onFormDismiss && onFormDismiss();
    onRefresh && onRefresh();
    setFormItem(formItemInitValue ?? {});
    setFormOpen(false);
  };

  return (
    <Segment.Group>
      <Segment as={Menu} style={{ padding: 0 }} borderless>
        <Menu.Item>
          <Header>{header}</Header>
        </Menu.Item>
        <Menu.Item position="right">
          {onRefresh && (
            <Button color="blue" className="mr-2" icon onClick={onRefresh}>
              <Icon name="refresh" />
            </Button>
          )}
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
              {columns.map((column, index) => (
                <Table.HeaderCell key={index}>{column.header}</Table.HeaderCell>
              ))}
              <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.length === 0 ? (
              <Table.Row textAlign="center">
                <Table.Cell colSpan="10">No data</Table.Cell>
              </Table.Row>
            ) : (
              data.map((item) => (
                <Table.Row
                  key={item.id}
                  style={{ backgroundColor: rowBackgroundColor && rowBackgroundColor(item) }}
                >
                  <Table.Cell textAlign="center">{item.id}</Table.Cell>
                  {columns.map((column, index) => (
                    <Table.Cell
                      key={`${item.id}-${index}`}
                      className={column.className}
                      onClick={() => column.onClick && column.onClick(item)}
                    >
                      {column.render(item)}
                    </Table.Cell>
                  ))}
                  <Table.Cell textAlign="center">
                    <Icon
                      name="edit"
                      onClick={() => openForm(item)}
                      style={{ cursor: 'pointer', marginRight: '0' }}
                    />
                    {(!canDelete || canDelete(item)) && (
                      <Icon
                        name="trash"
                        color="red"
                        onClick={() => onDelete && onDelete(item.id)}
                        style={{ cursor: 'pointer', marginLeft: '25%', marginRight: '0' }}
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
        {formOpen && ItemForm && (
          <ItemForm item={formItem as T} dismiss={dismissForm} submit={submitForm} />
        )}
      </Segment>
    </Segment.Group>
  );
}

export default ListPage;
