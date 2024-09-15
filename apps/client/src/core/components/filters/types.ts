import { LucideIcon } from 'lucide-react';
import { SelectItem } from 'tw-react-components';

export type FiltersProps = {
  fields: Field[];
  filters: Record<string, FilterItem>;
  updateFilter: (field: string, filter: FilterItem) => void;
  removeFilter: (field: string) => void;
  clearFilters: () => void;
};

export type FieldType = 'number' | 'string' | 'boolean' | 'date' | 'dateTime' | 'relation';

export type Field = {
  key: string;
  label: string;
  icon?: LucideIcon;
  selectables?: SelectItem<string | number, boolean>[];
  transformer?: (query: object) => object;
} & (
  | {
      type: Exclude<FieldType, 'relation'>;
      field: string;
    }
  | {
      type: 'relation';
      field: string;
      constructor: typeof Number | typeof String | typeof Date | typeof Boolean;
    }
  | {
      type: 'custom';
      query: (not?: boolean) => object;
    }
);

export type FilterItem = {
  field: Field;
  operation: string | null;
  not: boolean | null;
  value: null | string | number | boolean | Date | (string | number | boolean | Date)[];
};

export type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
