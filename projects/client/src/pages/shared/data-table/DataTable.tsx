import { PlusIcon, RefreshIcon } from '@heroicons/react/outline';
import { observable } from 'mobx';
import React, { DependencyList, ReactElement, useEffect, useState } from 'react';
import HeaderActionBar from '../HeaderActionBar';
import DataTableBody from './DataTableBody';

export type ListPageTableColumn<T> = {
  header: string;
  field: keyof T;
  className?: string;
  disabled?: (obj: T, index: number) => boolean;
  textAlign?: 'center' | 'left' | 'right';
  render: (obj: T, index: number) => React.ReactNode;
  onClick?: (obj: T) => void;
};

export type DataTableItemForm<T> = React.FC<{
  item: T;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: T) => void;
}>;

type Props<T> = {
  header?: string;
  emptyMessage?: string;
  dataFetcher: () => Promise<T[]>;
  dataDependencies?: DependencyList;
  columns: ListPageTableColumn<T>[];
  filters?: React.ReactNode;
  pagination?: React.ReactNode;
  notSortable?: boolean;
  formItemInitValue?: Partial<T>;
  ItemForm?: DataTableItemForm<T>;
  withoutActions?: boolean;
  fetchOnClose?: boolean;
  disabled?: (item: T, index: number) => boolean;
  canEdit?: (item: T) => boolean;
  onDelete?: (id: number) => void;
  canDelete?: (item: T) => boolean;
  onFormSubmit?: (item: T) => void;
  onFormDismiss?: () => void;
  onRowClick?: (item: T) => void;
  rowBackgroundColor?: (item: T) => 'white' | 'green' | 'yellow' | 'red' | 'blue';
  editIcon?: React.FC<React.ComponentProps<'svg'>>;
};

function DataTable<T extends { id: number | string }>({
  header,
  emptyMessage,
  dataFetcher,
  dataDependencies = [],
  columns,
  filters,
  pagination,
  notSortable,
  formItemInitValue,
  ItemForm,
  withoutActions,
  fetchOnClose,
  disabled,
  canEdit,
  onDelete,
  canDelete,
  onFormSubmit,
  onFormDismiss,
  onRowClick,
  rowBackgroundColor,
  editIcon,
}: Props<T>): ReactElement {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [formItem, setFormItem] = useState<Partial<T>>(formItemInitValue ?? {});
  const [formOpen, setFormOpen] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    dataFetcher()
      .then(setData)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dataDependencies]);

  const onRefresh = () => {
    setLoading(true);
    dataFetcher()
      .then(setData)
      .finally(() => setLoading(false));
  };

  const openForm = (item: T) => {
    setFormItem(observable({ ...item }));
    setFormOpen(true);
  };

  const submitForm = async (item: T) => {
    await onFormSubmit?.(item);
    await dismissForm();
  };

  const dismissForm = async () => {
    await onFormDismiss?.();
    setFormOpen(false);
    setFormItem(formItemInitValue ?? {});
    fetchOnClose && onRefresh();
  };

  return (
    <div className="flex flex-col overflow-hidden gap-y-4 text-black dark:text-white">
      {header && (
        <HeaderActionBar
          header={header}
          actions={[
            {
              label: 'Add',
              visible: !!ItemForm,
              icon: PlusIcon,
              onClick: () => setFormOpen(true),
            },
            {
              label: 'Refresh',
              icon: RefreshIcon,
              onClick: onRefresh,
            },
          ]}
        />
      )}
      {filters}
      <DataTableBody
        data={data}
        loading={loading}
        columns={columns}
        emptyMessage={emptyMessage}
        pagination={pagination}
        notSortable={notSortable}
        withoutActions={withoutActions}
        disabled={disabled}
        onEdit={openForm}
        canEdit={(item) => (canEdit?.(item) ?? true) && !!ItemForm}
        onDelete={onDelete}
        canDelete={canDelete}
        onRowClick={onRowClick}
        rowBackgroundColor={rowBackgroundColor}
        editIcon={editIcon}
      />
      {ItemForm && (
        <ItemForm
          item={formItem as T}
          isOpen={formOpen}
          onClose={dismissForm}
          onSubmit={submitForm}
        />
      )}
    </div>
  );
}

export default DataTable;
