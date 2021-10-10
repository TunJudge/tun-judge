import { ChevronDownIcon, ChevronUpIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';
import { generalComparator } from '../../../core/helpers';
import Spinner from '../Spinner';

export type ListPageTableColumn<T> = {
  header: string;
  field: keyof T;
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
  onRowClick?: (item: T) => void;
  rowBackgroundColor?: (item: T) => 'white' | 'green' | 'yellow' | 'red' | 'blue';
  editIcon?: React.FC<React.ComponentProps<'svg'>>;
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
  onRowClick,
  rowBackgroundColor,
  editIcon: EditIcon = PencilAltIcon,
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
                ? generalComparator()(a[column], b[column])
                : generalComparator()(b[column], a[column])
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
        data: data.slice().sort((a, b) => generalComparator()(a[field], b[field])),
        direction: 'ascending',
      });
    }
  };

  return (
    <div className="flex overflow-auto rounded-md shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="sticky top-0 z-10 text-center bg-gray-50 text-gray-700 dark:text-gray-300 dark:bg-gray-700">
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
                  'cursor-pointer': !notSortable,
                })}
                onClick={() => !notSortable && handleSort(column.field)}
              >
                <div
                  className={classNames('flex items-center gap-2', {
                    'justify-left text-left': (column.textAlign ?? 'left') === 'left',
                    'justify-center text-center': column.textAlign === 'center',
                    'justify-right text-right': column.textAlign === 'right',
                  })}
                >
                  {column.header}
                  {sortState.column === column.field ? (
                    sortState.direction === 'ascending' ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : sortState.direction === 'descending' ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : undefined
                  ) : undefined}
                </div>
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
                {loading ? <Spinner /> : emptyMessage ?? 'No data'}
              </td>
            </tr>
          ) : (
            sortState.data.map((item, rowIndex) => {
              const backgroundColor = rowBackgroundColor?.(item);

              return (
                <tr
                  key={item.id}
                  className={classNames('divide-x dark:divide-gray-700', {
                    'bg-blue-300 dark:bg-blue-800': backgroundColor === 'blue',
                    'bg-green-300 dark:bg-green-800': backgroundColor === 'green',
                    'bg-yellow-300 dark:bg-yellow-800': backgroundColor === 'yellow',
                    'bg-red-300 dark:bg-red-800': backgroundColor === 'red',
                    'bg-white dark:bg-gray-800': backgroundColor === 'white',
                    'text-gray-300 dark:text-gray-600': disabled?.(item, rowIndex),
                    'cursor-pointer': !!onRowClick,
                  })}
                  onClick={() => onRowClick?.(item)}
                >
                  <td className="px-4 py-2 text-center">{item.id}</td>
                  {columns.map((column, index) => (
                    <td
                      key={`${item.id}-${index}`}
                      className={classNames('px-4 py-2', { 'cursor-pointer': !!column.onClick })}
                      onClick={() => column.onClick?.(item)}
                    >
                      <div
                        className={classNames('flex items-center gap-2', {
                          'justify-left text-left': (column.textAlign ?? 'left') === 'left',
                          'justify-center text-center': column.textAlign === 'center',
                          'justify-right text-right': column.textAlign === 'right',
                          'text-gray-300 dark:text-gray-600': column.disabled?.(item, rowIndex),
                        })}
                      >
                        {column.render(item, rowIndex)}
                      </div>
                    </td>
                  ))}
                  {!withoutActions && (
                    <td>
                      <div className="flex items-center justify-center h-full gap-2 px-4 py-1">
                        {canEdit?.(item) && (
                          <EditIcon
                            className="p-2 w-9 h-9 cursor-pointer rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900"
                            onClick={() => onEdit?.(item)}
                          />
                        )}
                        {(!canDelete || canDelete(item)) && (
                          <TrashIcon
                            className="p-2 w-9 h-9 cursor-pointer rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-red-700 dark:hover:bg-gray-900"
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
        {pagination && (
          <tfoot className="sticky bottom-0 z-10 border-t bg-gray-50 text-gray-700 dark:text-gray-300 dark:bg-gray-700">
            {pagination}
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default DataTableBody;
