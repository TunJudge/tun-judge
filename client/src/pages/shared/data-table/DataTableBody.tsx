import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';
import { generalComparator } from '../../../core/helpers';
import Spinner from '../Spinner';

export type ListPageTableColumn<T> = {
  header: string;
  field: keyof T;
  className?: string;
  disabled?: (obj: T, index: number) => boolean;
  textAlign?: 'center' | 'left' | 'right';
  render: (obj: T, index: number) => React.ReactNode;
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
  disabled?: (item: T, index: number) => boolean;
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
  notSortable,
  disabled,
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
    <div className="border border-gray-300 rounded-md shadow dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="text-center bg-gray-50 text-gray-700 dark:text-gray-300 dark:bg-gray-700">
          <tr className="divide-x dark:divide-gray-800">
            <th
              className="px-4 py-2 font-medium tracking-wider"
              onClick={() => !notSortable && handleSort('id')}
            >
              #
            </th>
            {columns.map((column, index) => (
              <th
                key={index}
                className={classNames('px-4 py-2 font-medium tracking-wider', {
                  'text-center': column.textAlign === 'center',
                  'text-right': column.textAlign === 'right',
                  'text-left': (column.textAlign ?? 'left') === 'left',
                })}
                onClick={() => !notSortable && handleSort(column.field)}
              >
                {column.header}
                {sortState.column === column.field ? sortState.direction! : undefined}
              </th>
            ))}
            {!withoutActions && <th className="px-4 py-2 font-medium tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="relative bg-white divide-y divide-y-200 dark:bg-gray-800 dark:divide-gray-700">
          {loading && (
            <tr>
              <td className="absolute h-full w-full items-center">
                <Spinner className="rounded-b-md bg-opacity-50 dark:bg-opacity-50" />
              </td>
            </tr>
          )}
          {sortState.data.length === 0 ? (
            <tr>
              <td className="px-6 py-4 text-center dark:bg-gray-800" colSpan={20}>
                {loading ? <Spinner className="dark:bg-gray-800" /> : emptyMessage ?? 'No data'}
              </td>
            </tr>
          ) : (
            sortState.data.map((item, rowIndex) => {
              const backgroundColor = rowBackgroundColor?.(item);

              return (
                <tr
                  key={item.id}
                  className={classNames('divide-x dark:divide-gray-700', {
                    'bg-blue-200 dark:bg-blue-800': backgroundColor === 'blue',
                    'bg-green-200 dark:bg-green-800': backgroundColor === 'green',
                    'bg-yellow-200 dark:bg-yellow-800': backgroundColor === 'yellow',
                    'bg-red-200 dark:bg-red-800': backgroundColor === 'red',
                    'bg-white dark:bg-gray-800': backgroundColor === 'white',
                    'text-gray-300 dark:text-gray-600': disabled?.(item, rowIndex),
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
                          'text-gray-300 dark:text-gray-600': column.disabled?.(item, rowIndex),
                        },
                        column.className,
                      )}
                      onClick={() => column.onClick && column.onClick(item)}
                    >
                      {column.render(item, rowIndex)}
                    </td>
                  ))}
                  {!withoutActions && (
                    <td>
                      <div className="flex items-center justify-center h-full gap-1 px-4 py-2">
                        {canEdit?.(item) && (
                          <PencilAltIcon
                            className="p-2 w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => onEdit?.(item)}
                          />
                        )}
                        {(!canDelete || canDelete(item)) && (
                          <TrashIcon
                            className="p-2 w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 text-red-700 dark:hover:bg-gray-700"
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
