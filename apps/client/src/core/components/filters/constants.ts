import { FC } from 'react';

import { Prisma } from '@prisma/client';

import {
  BooleanFilterOptions,
  DateFilterOptions,
  FilterOptionsProps,
  NumberFilterOptions,
  SelectFilterOptions,
  StringFilterOptions,
} from './FilterOptions';
import { FieldType } from './types';

export const numberOperations: Record<keyof Omit<Prisma.IntFilter, 'in' | 'notIn'>, string> = {
  equals: 'Equals',
  lt: 'Lower then',
  lte: 'Lower then or equal',
  gt: 'Greater then',
  gte: 'Greater then or equal',
  not: 'Not',
};

export const stringOperations: Record<
  keyof Omit<Prisma.StringFilter, 'in' | 'notIn' | 'lt' | 'lte' | 'gt' | 'gte' | 'mode'>,
  string
> = {
  contains: 'Contains',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  equals: 'Equals',
  not: 'Not',
};

const booleanOperations: Record<keyof Pick<Prisma.BoolFilter, 'equals'>, string> = {
  equals: 'Equals',
};

export const datetimeOperations: Record<keyof Omit<Prisma.DateTimeFilter, 'in' | 'notIn'>, string> =
  {
    equals: 'Equals',
    lt: 'Lower then',
    lte: 'Lower then or equal',
    gt: 'Greater then',
    gte: 'Greater then or equal',
    not: 'Not',
  };

export const relationOperations: Record<
  keyof Pick<Prisma.IntFilter | Prisma.StringFilter, 'in' | 'notIn'>,
  string
> = {
  in: 'In',
  notIn: 'Not in',
};

export const operations: Record<FieldType, Record<string, string>> = {
  number: numberOperations,
  string: stringOperations,
  boolean: booleanOperations,
  date: datetimeOperations,
  dateTime: datetimeOperations,
  relation: relationOperations,
};

export const filterOptions: Record<FieldType | 'custom', FC<FilterOptionsProps>> = {
  number: NumberFilterOptions,
  string: StringFilterOptions,
  date: DateFilterOptions,
  dateTime: DateFilterOptions,
  boolean: BooleanFilterOptions,
  relation: SelectFilterOptions,
  custom: BooleanFilterOptions,
};
