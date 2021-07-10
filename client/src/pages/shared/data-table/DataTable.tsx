import { observable } from 'mobx';
import React, { DependencyList, ReactElement, useEffect, useState } from 'react';
import DataTableActionBar from './DataTableActionBar';
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
  disabled?: (item: T, index: number) => boolean;
  canEdit?: (item: T) => boolean;
  onDelete?: (id: number) => void;
  canDelete?: (item: T) => boolean;
  onFormSubmit?: (item: T) => void;
  onFormDismiss?: () => void;
  rowBackgroundColor?: (item: T) => 'white' | 'green' | 'yellow' | 'red' | 'blue';
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
  disabled,
  canEdit,
  onDelete,
  canDelete,
  onFormSubmit,
  onFormDismiss,
  rowBackgroundColor,
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
    setFormItem(formItemInitValue ?? {});
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-y-4 text-black dark:text-white">
      {header && (
        <DataTableActionBar
          header={header}
          canAdd={!!ItemForm}
          onAdd={() => setFormOpen(true)}
          onRefresh={onRefresh}
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
        rowBackgroundColor={rowBackgroundColor}
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
