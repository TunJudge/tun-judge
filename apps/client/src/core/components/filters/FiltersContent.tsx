import { PlusIcon, XIcon } from 'lucide-react';
import { FC } from 'react';
import { Badge, DropdownMenu, Flex, getDisplayDate } from 'tw-react-components';

import { FiltersTriggerWrapper } from './FiltersTriggerWrapper';
import { operations } from './constants';
import { FilterItem, FiltersProps } from './types';

export const FiltersContent: FC<FiltersProps> = (props) => {
  const { filters, updateFilter, removeFilter } = props;

  const filtersItems = Object.values(filters).filter((filter) => !!filter.value);
  const availableFields = props.fields.filter(
    (field) => !filtersItems.some((filter) => filter.field.key === field.key),
  );

  if (!filtersItems.length) return;

  const getFilterValue = (filter: FilterItem) => {
    const field = filter.field;

    switch (field.type) {
      case 'string':
      case 'number':
        return filter.value as number | string;
      case 'date':
      case 'dateTime':
        return getDisplayDate(filter.value as Date, 'dddd, MMMM Do YYYY, HH:mm:ss');
      case 'relation':
        return field.selectables
          ?.filter((item) => (filter.value as (string | number)[]).includes(item.id))
          .map((item) => item.label)
          .join(', ');
      case 'boolean':
      case 'custom':
        return String(filter.value) === 'true' ? 'Yes' : 'No';
    }
  };

  return (
    <Flex wrap>
      {filtersItems.map((filter) => (
        <Flex
          key={filter.field.key}
          className="h-7 gap-0 divide-x-2 divide-white overflow-hidden rounded-md bg-slate-100 [align-items:stretch] dark:divide-slate-900 dark:bg-slate-700"
        >
          <Flex className="px-2" align="center">
            {filter.field.label}
          </Flex>
          {filter.field.type !== 'custom' && filter.field.type !== 'boolean' && (
            <>
              {filter.not && (
                <Flex
                  className="cursor-pointer bg-slate-200 px-2 dark:bg-slate-800"
                  align="center"
                  onClick={() => updateFilter(filter.field.key, { ...filter, not: false })}
                >
                  Not
                </Flex>
              )}
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Flex
                    className="cursor-pointer bg-slate-200 px-2 dark:bg-slate-800"
                    align="center"
                  >
                    {filter.operation && operations[filter.field.type][filter.operation]}
                  </Flex>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="w-32" align="start">
                  {Object.entries(operations[filter.field.type])
                    .filter(([op]) => !(filter.not && op === 'not'))
                    .map(([op, opLabel]) => (
                      <DropdownMenu.Item
                        key={op}
                        onSelect={() =>
                          updateFilter(filter.field.key, {
                            ...filter,
                            ...(op === 'not' ? { not: true } : { operation: op }),
                          })
                        }
                      >
                        {opLabel}
                      </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
              </DropdownMenu>
            </>
          )}
          <FiltersTriggerWrapper {...props} filter={filter}>
            <Flex className="cursor-pointer px-2" align="center">
              {getFilterValue(filter)}
            </Flex>
          </FiltersTriggerWrapper>
          <Flex
            className="cursor-pointer px-1 transition-colors hover:bg-red-500 hover:text-white dark:hover:bg-red-600"
            align="center"
            onClick={() => removeFilter(filter.field.key)}
          >
            <XIcon className="h-4 w-4" />
          </Flex>
        </Flex>
      ))}
      <FiltersTriggerWrapper {...props} fields={availableFields}>
        <Badge
          className="h-7 w-7 cursor-pointer justify-center rounded-md border border-dashed border-slate-300 bg-transparent p-0 dark:border-slate-600"
          prefixIcon={PlusIcon}
        />
      </FiltersTriggerWrapper>
    </Flex>
  );
};
