import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { FC, PropsWithChildren, useRef, useState } from 'react';
import { DropdownMenu, useOutsideClick } from 'tw-react-components';

import { getFilterDefaultOperation } from '../../utils';
import { filterOptions } from './constants';
import { Field, FilterItem, FiltersProps } from './types';

export const FiltersTriggerWrapper: FC<
  PropsWithChildren<
    FiltersProps & { filter?: FilterItem; align?: DropdownMenuContentProps['align'] }
  >
> = ({ filter, fields, align = 'start', updateFilter, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | undefined>(filter?.field);

  const FilterOptions = selectedField && filterOptions[selectedField.type];

  useOutsideClick(contentRef, () => setOpen(false));

  const onSubmit = (field: string, value: FilterItem['value']) => {
    if (!selectedField) return;

    const [, operation] = getFilterDefaultOperation(selectedField);

    updateFilter(field, {
      field: selectedField,
      not: false,
      operation,
      value,
    });
    setOpen(false);
  };

  if (!fields.length) return null;

  return (
    <DropdownMenu open={open} onOpenChange={() => setSelectedField(filter?.field)}>
      <DropdownMenu.Trigger asChild onClick={() => setOpen(true)}>
        {children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-44 overflow-visible" align={align} ref={contentRef}>
        {!FilterOptions ? (
          fields.map((field) => (
            <DropdownMenu.Item
              key={field.key}
              onSelect={(event) => {
                event.preventDefault();
                setSelectedField(field);
              }}
            >
              {field.icon && <DropdownMenu.Icon icon={field.icon} />}
              {field.label}
            </DropdownMenu.Item>
          ))
        ) : (
          <FilterOptions value={filter?.value} field={selectedField} onSubmit={onSubmit} />
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
