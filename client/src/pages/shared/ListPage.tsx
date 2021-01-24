import cn from 'classnames';
import React, { CSSProperties, ReactElement, useEffect, useRef, useState } from 'react';
import {
  Button,
  Header,
  Icon,
  Menu,
  Popup,
  Segment,
  SemanticWIDTHS,
  Table,
} from 'semantic-ui-react';
import { generalComparator } from '../../core/helpers';

export type ListPageTableColumn<T> = {
  header: string;
  field: keyof T;
  className?: string;
  disabled?: (obj: T) => boolean;
  width?: SemanticWIDTHS;
  textAlign?: 'center' | 'left' | 'right';
  style?: CSSProperties;
  render: (obj: T) => React.ReactNode;
  onClick?: (obj: T) => void;
};

type ListPageProps<T> = {
  header: string;
  emptyMessage?: string;
  data: T[];
  columns: ListPageTableColumn<T>[];
  filters?: any;
  pagination?: any;
  notSortable?: boolean;
  formItemInitValue?: Partial<T>;
  ItemForm?: React.FC<{ item: T; dismiss: () => void; submit: (item: T) => void }>;
  zipUrl?: (item: T) => string;
  withoutActions?: boolean;
  unzip?: (file: File) => void;
  onDelete?: (id: number) => void;
  canDelete?: (item: T) => boolean;
  onRefresh?: () => void;
  onFormOpen?: (item: T) => void;
  onFormSubmit?: (item: T) => void;
  onFormDismiss?: () => void;
  rowBackgroundColor?: (item: T) => string;
};

function ListPage<T extends { id: number | string }>({
  header,
  emptyMessage,
  data,
  columns,
  filters,
  pagination,
  notSortable,
  formItemInitValue,
  ItemForm,
  zipUrl,
  withoutActions,
  unzip,
  onDelete,
  canDelete,
  onRefresh,
  onFormOpen,
  onFormSubmit,
  onFormDismiss,
  rowBackgroundColor,
}: ListPageProps<T>): ReactElement {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
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
    <>
      <Segment as={Menu} style={{ padding: 0 }} borderless>
        <Menu.Item>
          <Header>{header}</Header>
        </Menu.Item>
        <Menu.Item position="right">
          {unzip && (
            <Popup
              trigger={
                <Button
                  className="mr-2"
                  color="blue"
                  icon
                  onClick={() => uploadInputRef.current?.click()}
                >
                  <Icon name="upload" />
                  <input
                    type="file"
                    hidden
                    ref={(ref) => (uploadInputRef.current = ref)}
                    onChange={async (event) => {
                      const files = event.target.files;
                      if (files?.length) {
                        await unzip(files[0]);
                      }
                      event.target.files = null;
                    }}
                  />
                </Button>
              }
              position="bottom center"
            >
              Upload a ZIP
            </Popup>
          )}
          {onRefresh && (
            <Popup
              trigger={
                <Button
                  color="blue"
                  className={cn({ 'mr-2': !!ItemForm })}
                  icon
                  onClick={onRefresh}
                >
                  <Icon name="refresh" />
                </Button>
              }
              position="bottom center"
            >
              Refresh
            </Popup>
          )}
          {ItemForm && (
            <Popup
              trigger={
                <Button color="blue" icon onClick={() => setFormOpen(true)}>
                  <Icon name="plus" />
                </Button>
              }
              position="bottom center"
            >
              Add
            </Popup>
          )}
        </Menu.Item>
      </Segment>
      {filters}
      <Table striped sortable={!notSortable} celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              width="1"
              textAlign="center"
              sorted={sortState.column === 'id' ? sortState.direction! : undefined}
              onClick={() => handleSort('id')}
            >
              #
            </Table.HeaderCell>
            {columns.map((column, index) => (
              <Table.HeaderCell
                key={index}
                sorted={sortState.column === column.field ? sortState.direction! : undefined}
                textAlign={column.textAlign ?? 'left'}
                width={column.width}
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
              <Table.Cell colSpan="20">{emptyMessage ?? 'No data'}</Table.Cell>
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
                    textAlign={column.textAlign ?? 'left'}
                    disabled={column.disabled && column.disabled(item)}
                    width={column.width}
                    style={column.style}
                    onClick={() => column.onClick && column.onClick(item)}
                  >
                    {column.render(item)}
                  </Table.Cell>
                ))}
                {!withoutActions && (
                  <Table.Cell textAlign="center">
                    {zipUrl && (
                      <a
                        href={zipUrl(item)}
                        download="contest.zip"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon name="zip" style={{ marginRight: '0' }} />
                      </a>
                    )}
                    {ItemForm && (
                      <Icon
                        name="edit"
                        onClick={() => openForm(item)}
                        style={{ cursor: 'pointer', marginLeft: zipUrl && '10%', marginRight: '0' }}
                      />
                    )}
                    {(!canDelete || canDelete(item)) && (
                      <Icon
                        name="trash"
                        color="red"
                        onClick={() => onDelete && onDelete(item.id as number)}
                        style={{
                          cursor: 'pointer',
                          marginLeft: ItemForm && '10%',
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
        {pagination}
      </Table>
      {formOpen && ItemForm && (
        <ItemForm item={formItem as T} dismiss={dismissForm} submit={submitForm} />
      )}
    </>
  );
}

export default ListPage;
