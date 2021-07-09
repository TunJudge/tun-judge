import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';
import { generalComparator } from '../../../core/helpers';
import Spinner from '../Spinner';

export type ListPageTableColumn<T> = {
  header: string;
  field: keyof T;
  className?: string;
  disabled?: (obj: T) => boolean;
  textAlign?: 'center' | 'left' | 'right';
  render: (obj: T) => React.ReactNode;
  onClick?: (obj: T) => void;
};

type Props<T> = {
  data: T[];
  loading: boolean;
  columns: ListPageTableColumn<T>[];
  emptyMessage?: string;
  pagination?: React.ReactNode;
  notSortable?: boolean;
  withoutActions?: boolean;
  onEdit?: (item: T) => void;
  canEdit?: (item: T) => boolean;
  onDelete?: (id: number) => void;
  canDelete?: (item: T) => boolean;
  rowBackgroundColor?: (item: T) => 'white' | 'green' | 'yellow' | 'red' | 'blue';
};

function DataTableBody<T extends { id: number | string }>({
  data,
  loading,
  columns,
  emptyMessage,
  pagination,
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
    <div className="border overflow-auto border-gray-300 rounded-md shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="divide-x">
            <th
              className="px-4 py-2 text-center font-medium text-gray-700 uppercase tracking-wider"
              onClick={() => handleSort('id')}
            >
              #
            </th>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-2 text-center font-medium text-gray-700 uppercase tracking-wider"
                // sorted={sortState.column === column.field ? sortState.direction! : undefined}
                // textAlign={column.textAlign ?? 'left'}
                onClick={() => handleSort(column.field)}
              >
                {column.header}
              </th>
            ))}
            {!withoutActions && (
              <th className="px-4 py-2 text-center font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="relative bg-white divide-y divide-y-200">
          {loading && (
            <tr>
              <td className="absolute h-full w-full items-center bg-gray-100 bg-opacity-50">
                <Spinner />
              </td>
            </tr>
          )}
          {sortState.data.length === 0 ? (
            <tr>
              <td className="px-6 py-4 text-center" colSpan={20}>
                {loading ? <Spinner /> : emptyMessage ?? 'No data'}
              </td>
            </tr>
          ) : (
            sortState.data.map((item) => {
              const backgroundColor = rowBackgroundColor?.(item);

              return (
                <tr
                  key={item.id}
                  className={classNames('divide-x', {
                    'bg-blue-200': backgroundColor === 'blue',
                    'bg-green-200': backgroundColor === 'green',
                    'bg-yellow-200': backgroundColor === 'yellow',
                    'bg-red-200': backgroundColor === 'red',
                    'bg-white': backgroundColor === 'white',
                  })}
                >
                  <td className="px-4 py-2 text-center">{item.id}</td>
                  {columns.map((column, index) => (
                    <td
                      key={`${item.id}-${index}`}
                      className={classNames(
                        'px-4 py-2',
                        {
                          'text-center': column.textAlign === 'center',
                          'text-right': column.textAlign === 'right',
                          'text-left': (column.textAlign ?? 'left') === 'left',
                        },
                        column.className,
                      )}
                      // disabled={column.disabled && column.disabled(item)}
                      onClick={() => column.onClick && column.onClick(item)}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                  {!withoutActions && (
                    <td>
                      <div className="flex items-center justify-center h-full gap-1 px-4 py-2">
                        {canEdit?.(item) && (
                          <PencilAltIcon
                            className="p-2 w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200"
                            onClick={() => onEdit?.(item)}
                          />
                        )}
                        {(!canDelete || canDelete(item)) && (
                          <TrashIcon
                            className="p-2 w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 text-red-700"
                            onClick={() => onDelete?.(item.id as number)}
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
        {pagination}
      </table>
    </div>
  );
}

export default DataTableBody;
