import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTableSorting, Paths, generalComparator } from 'tw-react-components';

export type Sorting<T> = ReturnType<typeof useSorting<T>>;

export function useSorting<T>(
  field?: Paths<T>,
  direction?: DataTableSorting<T>['direction'],
  mode: 'query' | 'state' = 'query',
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<URLSearchParams>(new URLSearchParams());

  const sorting = useMemo(
    () => (mode === 'query' ? searchParams : state),
    [mode, searchParams, state],
  );

  const setSorting = useCallback(
    (sorting: DataTableSorting<T>): void => {
      if (mode === 'query') {
        sorting.field !== (field ?? 'id')
          ? searchParams.set('sortBy', sorting.field as string)
          : searchParams.delete('sortBy');
        sorting.direction !== (direction ?? 'asc')
          ? searchParams.set('sortDirection', sorting.direction)
          : searchParams.delete('sortDirection');

        setSearchParams(searchParams);
      } else {
        setState(
          new URLSearchParams({
            sortBy: sorting.field ?? field ?? 'id',
            sortDirection: sorting.direction ?? 'asc',
          }),
        );
      }
    },
    [mode, field, direction, searchParams, setSearchParams],
  );

  const orderBy: OrderBy = useMemo(
    () =>
      (sorting.get('sortBy') ?? field ?? 'id')
        .split('.')
        .reverse()
        .reduce(
          (prev, curr) => ({ [curr]: prev }),
          (sorting.get('sortDirection') ?? direction ?? 'asc') as unknown as OrderBy,
        ),
    [direction, field, sorting],
  );

  return useMemo(
    () => ({
      orderBy,
      sorting: {
        field: (sorting.get('sortBy') ?? field ?? 'id') as Paths<T>,
        direction: (sorting.get('sortDirection') ?? direction ?? 'asc') as 'asc' | 'desc',
        comparator: generalComparator,
      },
      setSorting,
    }),
    [orderBy, sorting, field, direction, setSorting],
  );
}

type OrderBy = Record<string, 'asc' | 'desc' | object>;
