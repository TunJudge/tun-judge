import { CheckIcon } from 'lucide-react';
import { FC, useMemo, useState } from 'react';
import {
  Button,
  DateTimeInput,
  DropdownMenu,
  Flex,
  NumberInput,
  TextInput,
} from 'tw-react-components';

import { getFilterDefaultOperation } from '../../utils';
import { Field, FilterItem } from './types';

export type FilterOptionsProps = {
  field: Field;
  value?: FilterItem['value'];
  onSubmit: (field: string, value: FilterItem['value']) => void;
};

export const StringFilterOptions: FC<FilterOptionsProps> = ({ value, field, onSubmit }) => {
  const [search, setSearch] = useState<string>(value ? String(value) : '');

  const submit = () => {
    const [constructor, operation] = getFilterDefaultOperation(field);

    onSubmit(
      field.key,
      !search
        ? null
        : ['in', 'notIn'].includes(operation)
          ? search.split(',').map((item) => constructor(item))
          : constructor(search),
    );
  };

  return (
    <Flex className="gap-1">
      <TextInput
        size="small"
        autoFocus
        value={search}
        placeholder={field.label}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && submit()}
      />
      <Button
        className="h-7 w-7"
        size="small"
        color="green"
        prefixIcon={CheckIcon}
        onClick={submit}
      />
    </Flex>
  );
};

export const NumberFilterOptions: FC<FilterOptionsProps> = ({ field, onSubmit }) => {
  const [value, setValue] = useState<string>();

  const submit = () => {
    const [constructor, operation] = getFilterDefaultOperation(field);

    onSubmit(
      field.key,
      !value
        ? null
        : ['in', 'notIn'].includes(operation)
          ? value.split(',').map((item) => constructor(item))
          : constructor(value),
    );
  };

  return (
    <Flex className="gap-1">
      <NumberInput
        size="small"
        autoFocus
        placeholder={field.label}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && submit()}
      />
      <Button
        className="h-7 w-7"
        size="small"
        color="green"
        prefixIcon={CheckIcon}
        onClick={submit}
      />
    </Flex>
  );
};

export const DateFilterOptions: FC<FilterOptionsProps> = ({ field, onSubmit }) => (
  <DateTimeInput
    size="small"
    className="[&>div:nth-child(2)]:w-72"
    placeholder={field.label}
    type={field.type === 'date' ? 'date' : 'datetime-local'}
    onChange={(date) => {
      const value = String(date);
      const [constructor, operation] = getFilterDefaultOperation(field);

      onSubmit(
        field.key,
        !value
          ? null
          : ['in', 'notIn'].includes(operation)
            ? value.split(',').map((item) => constructor(item))
            : constructor(value),
      );
    }}
  />
);

export const BooleanFilterOptions: FC<FilterOptionsProps> = ({ field, onSubmit }) =>
  [
    { id: 'yes', label: 'Yes', value: 'true' },
    { id: 'no', label: 'No', value: 'false' },
  ].map((item) => (
    <DropdownMenu.Item
      key={item.id}
      className="cursor-pointer"
      onSelect={() => onSubmit(field.key, item.value)}
    >
      {item.label}
    </DropdownMenu.Item>
  ));

export const SelectFilterOptions: FC<FilterOptionsProps> = ({ value = [], field, onSubmit }) => {
  const [search, setSearch] = useState<string>('');

  const items = useMemo(
    () =>
      field.selectables?.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      ) ?? [],
    [field.selectables, search],
  );

  return (
    <>
      <TextInput
        size="small"
        placeholder={field.label}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => event.stopPropagation()}
      />
      <DropdownMenu.Separator />
      <DropdownMenu.Group className="max-h-[18rem] overflow-auto">
        {items.length > 0 ? (
          items.map((item) => (
            <DropdownMenu.CheckboxItem
              key={item.id}
              className="cursor-pointer"
              onCheckedChange={(checked) => {
                const [constructor, operation] = getFilterDefaultOperation(field);
                const selected = value as (string | number)[];
                const newValue = ['in', 'notIn'].includes(operation)
                  ? String(item.value)
                      .split(',')
                      .map((item) => constructor(item))
                  : [constructor(value)];

                onSubmit(
                  field.key,
                  checked
                    ? [...selected, ...newValue]
                    : selected.filter((v) => !newValue.includes(v)),
                );
              }}
              checked={(value as (string | number)[]).includes(item.id)}
            >
              {item.label}
            </DropdownMenu.CheckboxItem>
          ))
        ) : (
          <DropdownMenu.Item disabled>No items</DropdownMenu.Item>
        )}
      </DropdownMenu.Group>
    </>
  );
};
