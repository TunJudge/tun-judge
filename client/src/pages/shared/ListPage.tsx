import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Header, Icon, Menu, Segment, Table } from 'semantic-ui-react';
import cn from 'classnames';
import { generalComparator } from '../../core/helpers';

export type ListPageTableColumn<T> = {
  header: string;
  field: keyof T;
  className?: string;
  render: (obj: T) => React.ReactNode;
  onClick?: (obj: T) => void;
};

type ListPageProps<T> = {
  header: string;
  emptyMessage?: string;
  data: T[];
  columns: ListPageTableColumn<T>[];
  formItemInitValue?: Partial<T>;
  ItemForm?: React.FC<{ item: T; dismiss: () => void; submit: (item: T) => void }>;
  withoutActions?: boolean;
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
  emptyMessage,
  data,
  columns,
  formItemInitValue,
  ItemForm,
  withoutActions,
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
  const [sortState, setSortState] = useState<{
    column: keyof T | null;
    data: T[];
    direction: 'ascending' | 'descending' | null;
  }>({
    column: null,
    data: data,
    direction: null,
  });

  useEffect(() => {
    setSortState(({ column, direction }) => {
      if (column && direction) {
        return {
          column: column,
          direction: direction,
          data: data
            .slice()
            .sort((a, b) =>
              direction === 'ascending'
                ? generalComparator(a[column], b[column])
                : generalComparator(b[column], a[column]),
            ),
        };
      }
      return { column: column, direction: direction, data: data };
    });
  }, [data]);

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

  const handleSort = (field: keyof T): void => {
    const { column, direction, data } = sortState;
    if (column === field) {
      setSortState({
        column: field,
        data: data.slice().reverse(),
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      });
    } else {
      setSortState({
        column: field,
        data: data.slice().sort((a, b) => generalComparator(a[field], b[field])),
        direction: 'ascending',
      });
    }
  };

  return (
    <Segment.Group>
      <Segment as={Menu} style={{ padding: 0 }} borderless>
        <Menu.Item>
          <Header>{header}</Header>
        </Menu.Item>
        <Menu.Item position="right">
          {onRefresh && (
            <Button color="blue" className={cn({ 'mr-2': !!ItemForm })} icon onClick={onRefresh}>
              <Icon name="refresh" />
            </Button>
          )}
          {ItemForm && (
            <Button color="blue" icon onClick={() => setFormOpen(true)}>
              <Icon name="plus" />
            </Button>
          )}
        </Menu.Item>
      </Segment>
      <Segment>
        <Table striped sortable celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                width="1"
                textAlign="center"
                sorted={sortState.column === 'id' ? sortState.direction! : undefined}
                onClick={() => handleSort('id')}
              >
                ID
              </Table.HeaderCell>
              {columns.map((column, index) => (
                <Table.HeaderCell
                  key={index}
                  sorted={sortState.column === column.field ? sortState.direction! : undefined}
                  onClick={() => handleSort(column.field)}
                >
                  {column.header}
                </Table.HeaderCell>
              ))}
              {!withoutActions && <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortState.data.length === 0 ? (
              <Table.Row textAlign="center">
                <Table.Cell colSpan="10">{emptyMessage ?? 'No data'}</Table.Cell>
              </Table.Row>
            ) : (
              sortState.data.map((item) => (
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
                  {!withoutActions && (
                    <Table.Cell textAlign="center">
                      {ItemForm && (
                        <Icon
                          name="edit"
                          onClick={() => openForm(item)}
                          style={{ cursor: 'pointer', marginRight: '0' }}
                        />
                      )}
                      {(!canDelete || canDelete(item)) && (
                        <Icon
                          name="trash"
                          color="red"
                          onClick={() => onDelete && onDelete(item.id)}
                          style={{
                            cursor: 'pointer',
                            marginLeft: ItemForm && '25%',
                            marginRight: '0',
                          }}
                        />
                      )}
                    </Table.Cell>
                  )}
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
