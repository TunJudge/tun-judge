import { Field, FilterItem } from '../components';

export function queryParser(query: URLSearchParams, fields: Field[]): Record<string, FilterItem> {
  const filters: Record<string, FilterItem> = {};

  for (const field of fields) {
    if (field.key === 'page') {
      throw new Error('Key as "page" is not allowed');
    }

    const value = query.get(field.key);

    if (field.type === 'custom') {
      filters[field.key] = { field, not: null, operation: null, value };

      continue;
    }

    const [, not, operation, filterValue] = /^(\[not])?([^(]*)\((.*)\)$/.exec(value ?? '') ?? [];

    const [constructor, defaultOperation] = getFilterDefaultOperation(field);

    filters[field.key] = {
      field,
      operation: operation ?? defaultOperation,
      not: !!not,
      value: !filterValue
        ? null
        : ['in', 'notIn'].includes(operation ?? defaultOperation)
          ? filterValue.split(',').map((item) => constructor(item))
          : constructor(filterValue),
    };
  }

  return filters;
}

export function getFilterDefaultOperation(field: Field) {
  return (
    field.type === 'relation'
      ? [field.constructor, 'in']
      : field.type === 'number'
        ? [Number, 'equals']
        : field.type === 'date' || field.type === 'dateTime'
          ? [(value: string) => new Date(value), 'gte']
          : field.type === 'boolean'
            ? [String, 'equals']
            : [String, 'contains']
  ) as [typeof Number | typeof String | typeof Date | typeof Boolean, string];
}
