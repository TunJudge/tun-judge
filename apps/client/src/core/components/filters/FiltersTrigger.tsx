import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { ListFilterIcon, XIcon } from 'lucide-react';
import { FC } from 'react';
import { Badge } from 'tw-react-components';

import { FiltersTriggerWrapper } from './FiltersTriggerWrapper';
import { FiltersProps } from './types';

export const FiltersTrigger: FC<
  FiltersProps & { mode?: 'start' | 'add'; align?: DropdownMenuContentProps['align'] }
> = (props) => {
  const hasFilters = Object.values(props.filters).some((filter) => !!filter.value);

  return !hasFilters ? (
    <FiltersTriggerWrapper {...props}>
      <Badge
        className="border-border ml-2 h-7 cursor-pointer rounded-md border border-dashed bg-transparent px-2 dark:bg-transparent"
        prefixIcon={ListFilterIcon}
      >
        Filter
      </Badge>
    </FiltersTriggerWrapper>
  ) : (
    <Badge
      className="border-border ml-2 h-7 cursor-pointer rounded-md border border-dashed bg-transparent px-2 dark:bg-transparent"
      suffixIcon={XIcon}
      onClick={props.clearFilters}
    >
      Clear filters
    </Badge>
  );
};
