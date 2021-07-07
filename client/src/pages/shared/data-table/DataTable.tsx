import React, { ReactElement, useState } from 'react';
import DataTableActionBar from './DataTableActionBar';
import DataTableBody from './DataTableBody';

export type ListPageTableColumn<T> = {
  header: string;
  field: keyof T;
  className?: string;
  disabled?: (obj: T) => boolean;
  textAlign?: 'center' | 'left' | 'right';
  render: (obj: T) => React.ReactNode;
  onClick?: (obj: T) => void;
};

export type DataTableItemForm<T> = React.FC<{
  item: T;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: T) => void;
}>;

type Props<T> = {
  header: string;
  emptyMessage?: string;
  data: T[];
  columns: ListPageTableColumn<T>[];
  filters?: React.ReactNode;
  pagination?: React.ReactNode;
  notSortable?: boolean;
  formItemInitValue?: Partial<T>;
  ItemForm?: DataTableItemForm<T>;
  withoutActions?: boolean;
  canEdit?: (item: T) => boolean;
  onDelete?: (id: number) => void;
  canDelete?: (item: T) => boolean;
  onRefresh?: () => void;
  onFormSubmit?: (item: T) => void;
  onFormDismiss?: () => void;
  rowBackgroundColor?: (item: T) => 'white' | 'green' | 'yellow' | 'red';
};

function DataTable<T extends { id: number | string }>({
  header,
  emptyMessage,
  data,
  columns,
  filters,
  pagination,
  notSortable,
  formItemInitValue,
  ItemForm,
  withoutActions,
  canEdit,
  onDelete,
  canDelete,
  onRefresh,
  onFormSubmit,
  onFormDismiss,
  rowBackgroundColor,
}: Props<T>): ReactElement {
  const [formItem, setFormItem] = useState<Partial<T>>(formItemInitValue ?? {});
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const openForm = (item: T) => {
    setFormItem(item);
    setFormOpen(true);
  };

  const submitForm = (item: T) => {
    onFormSubmit?.(item);
    dismissForm();
  };

  const dismissForm = () => {
    onFormDismiss?.();
    onRefresh && onRefresh();
    setFormItem(formItemInitValue ?? {});
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col overflow-hidden gap-y-4">
      <DataTableActionBar
        header={header}
        canAdd={!!ItemForm}
        onAdd={() => setFormOpen(true)}
        onRefresh={onRefresh}
      />
      {filters}
      <DataTableBody
        data={data}
        columns={columns}
        emptyMessage={emptyMessage}
        pagination={pagination}
        notSortable={notSortable}
        withoutActions={withoutActions}
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
