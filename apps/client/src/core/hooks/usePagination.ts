import { SetStateAction, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setCurrentPage = useCallback(
    (page: SetStateAction<number>): void => {
      if (typeof page !== 'number') return;

      page ? searchParams.set('page', String(page + 1)) : searchParams.delete('page');

      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  return useMemo(
    () => ({
      currentPage: parseInt(searchParams.get('page') ?? '1') - 1,
      setCurrentPage,
    }),
    [searchParams, setCurrentPage],
  );
}
