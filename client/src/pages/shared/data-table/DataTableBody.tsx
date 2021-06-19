import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { Icon, SemanticWIDTHS, Table } from 'semantic-ui-react';
import { generalComparator } from '../../../core/helpers';

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

type Props<T> = {
  data: T[];
  columns: ListPageTableColumn<T>[];
  emptyMessage?: string;
  pagination?: React.ReactNode;
  notSortable?: boolean;
  withoutActions?: boolean;
  onEdit?: (item: T) => void;
  canEdit?: (item: T) => boolean;
  onDelete?: (id: number) => void;
  canDelete?: (item: T) => boolean;
  rowBackgroundColor?: (item: T) => string;
};

function DataTableBody<T extends { id: number | string }>({
  data,
  columns,
  emptyMessage,
  pagination,
  notSortable,
  withoutActions,
  onEdit,
  canEdit,
  onDelete,
  canDelete,
  rowBackgroundColor,
}: Props<T>): ReactElement {
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
                  {canEdit?.(item) && (
                    <Icon
                      name="edit"
                      onClick={() => onEdit?.(item)}
                      style={{ cursor: 'pointer', marginLeft: '0', marginRight: '0' }}
                    />
                  )}
                  {(!canDelete || canDelete(item)) && (
                    <Icon
                      name="trash"
                      color="red"
                      onClick={() => onDelete?.(item.id as number)}
                      style={{
                        cursor: 'pointer',
                        marginLeft: canEdit?.(item) && '10%',
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
  );
}

export default DataTableBody;
