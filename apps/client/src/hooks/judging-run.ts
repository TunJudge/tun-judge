/* eslint-disable */
import type {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type {
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';
import type { PolicyCrudKind } from '@zenstackhq/runtime';
import type {
  CheckSelect,
  ExtraMutationOptions,
  ExtraQueryOptions,
  PickEnumerable,
  QueryError,
} from '@zenstackhq/tanstack-query/runtime-v5';
import { getHooksContext } from '@zenstackhq/tanstack-query/runtime-v5/react';
import {
  useInfiniteModelQuery,
  useModelMutation,
  useModelQuery,
} from '@zenstackhq/tanstack-query/runtime-v5/react';
import {
  useSuspenseInfiniteModelQuery,
  useSuspenseModelQuery,
} from '@zenstackhq/tanstack-query/runtime-v5/react';

import type { JudgingRun, Prisma } from '@prisma/client';
import type { JudgingRunResult } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateJudgingRun(
  options?: Omit<
    UseMutationOptions<JudgingRun | undefined, DefaultError, Prisma.JudgingRunCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgingRunCreateArgs, DefaultError, JudgingRun, true>(
    'JudgingRun',
    'POST',
    `${endpoint}/judgingRun/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingRunCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingRunCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, JudgingRun, Prisma.JudgingRunGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingRunCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, JudgingRun, Prisma.JudgingRunGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyJudgingRun(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.JudgingRunCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.JudgingRunCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('JudgingRun', 'POST', `${endpoint}/judgingRun/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingRunCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingRunCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingRunCreateManyArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as Prisma.BatchPayload;
    },
  };
  return mutation;
}

export function useFindManyJudgingRun<
  TArgs extends Prisma.JudgingRunFindManyArgs,
  TQueryFnData = Array<Prisma.JudgingRunGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingRunFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyJudgingRun<
  TArgs extends Prisma.JudgingRunFindManyArgs,
  TQueryFnData = Array<Prisma.JudgingRunGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingRunFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyJudgingRun<
  TArgs extends Prisma.JudgingRunFindManyArgs,
  TQueryFnData = Array<Prisma.JudgingRunGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingRunFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyJudgingRun<
  TArgs extends Prisma.JudgingRunFindManyArgs,
  TQueryFnData = Array<Prisma.JudgingRunGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingRunFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueJudgingRun<
  TArgs extends Prisma.JudgingRunFindUniqueArgs,
  TQueryFnData = Prisma.JudgingRunGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgingRunFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueJudgingRun<
  TArgs extends Prisma.JudgingRunFindUniqueArgs,
  TQueryFnData = Prisma.JudgingRunGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgingRunFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstJudgingRun<
  TArgs extends Prisma.JudgingRunFindFirstArgs,
  TQueryFnData = Prisma.JudgingRunGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingRunFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstJudgingRun<
  TArgs extends Prisma.JudgingRunFindFirstArgs,
  TQueryFnData = Prisma.JudgingRunGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingRunFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateJudgingRun(
  options?: Omit<
    UseMutationOptions<JudgingRun | undefined, DefaultError, Prisma.JudgingRunUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgingRunUpdateArgs, DefaultError, JudgingRun, true>(
    'JudgingRun',
    'PUT',
    `${endpoint}/judgingRun/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingRunUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingRunUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, JudgingRun, Prisma.JudgingRunGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingRunUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, JudgingRun, Prisma.JudgingRunGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyJudgingRun(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.JudgingRunUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.JudgingRunUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('JudgingRun', 'PUT', `${endpoint}/judgingRun/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingRunUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingRunUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingRunUpdateManyArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as Prisma.BatchPayload;
    },
  };
  return mutation;
}

export function useUpsertJudgingRun(
  options?: Omit<
    UseMutationOptions<JudgingRun | undefined, DefaultError, Prisma.JudgingRunUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgingRunUpsertArgs, DefaultError, JudgingRun, true>(
    'JudgingRun',
    'POST',
    `${endpoint}/judgingRun/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingRunUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingRunUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, JudgingRun, Prisma.JudgingRunGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingRunUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, JudgingRun, Prisma.JudgingRunGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteJudgingRun(
  options?: Omit<
    UseMutationOptions<JudgingRun | undefined, DefaultError, Prisma.JudgingRunDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgingRunDeleteArgs, DefaultError, JudgingRun, true>(
    'JudgingRun',
    'DELETE',
    `${endpoint}/judgingRun/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingRunDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingRunDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, JudgingRun, Prisma.JudgingRunGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingRunDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, JudgingRun, Prisma.JudgingRunGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyJudgingRun(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.JudgingRunDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.JudgingRunDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('JudgingRun', 'DELETE', `${endpoint}/judgingRun/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingRunDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingRunDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingRunDeleteManyArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as Prisma.BatchPayload;
    },
  };
  return mutation;
}

export function useAggregateJudgingRun<
  TArgs extends Prisma.JudgingRunAggregateArgs,
  TQueryFnData = Prisma.GetJudgingRunAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgingRunAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateJudgingRun<
  TArgs extends Prisma.JudgingRunAggregateArgs,
  TQueryFnData = Prisma.GetJudgingRunAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgingRunAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByJudgingRun<
  TArgs extends Prisma.JudgingRunGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.JudgingRunGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.JudgingRunGroupByArgs['orderBy'] },
  OrderFields extends Prisma.ExcludeUnderscoreKeys<
    Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>
  >,
  ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>,
  ByValid extends Prisma.Has<ByFields, OrderFields>,
  HavingFields extends Prisma.GetHavingFields<TArgs['having']>,
  HavingValid extends Prisma.Has<ByFields, HavingFields>,
  ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False,
  InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
        }[HavingFields]
      : 'take' extends Prisma.Keys<TArgs>
        ? 'orderBy' extends Prisma.Keys<TArgs>
          ? ByValid extends Prisma.True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Prisma.Keys<TArgs>
          ? 'orderBy' extends Prisma.Keys<TArgs>
            ? ByValid extends Prisma.True
              ? {}
              : {
                  [P in OrderFields]: P extends ByFields
                    ? never
                    : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                }[OrderFields]
            : 'Error: If you provide "skip", you also need to provide "orderBy"'
          : ByValid extends Prisma.True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields],
  TQueryFnData = {} extends InputErrors
    ? Array<
        PickEnumerable<Prisma.JudgingRunGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.JudgingRunGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.JudgingRunGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.JudgingRunGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.JudgingRunGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByJudgingRun<
  TArgs extends Prisma.JudgingRunGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.JudgingRunGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.JudgingRunGroupByArgs['orderBy'] },
  OrderFields extends Prisma.ExcludeUnderscoreKeys<
    Prisma.Keys<Prisma.MaybeTupleToUnion<TArgs['orderBy']>>
  >,
  ByFields extends Prisma.MaybeTupleToUnion<TArgs['by']>,
  ByValid extends Prisma.Has<ByFields, OrderFields>,
  HavingFields extends Prisma.GetHavingFields<TArgs['having']>,
  HavingValid extends Prisma.Has<ByFields, HavingFields>,
  ByEmpty extends TArgs['by'] extends never[] ? Prisma.True : Prisma.False,
  InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
        }[HavingFields]
      : 'take' extends Prisma.Keys<TArgs>
        ? 'orderBy' extends Prisma.Keys<TArgs>
          ? ByValid extends Prisma.True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : 'skip' extends Prisma.Keys<TArgs>
          ? 'orderBy' extends Prisma.Keys<TArgs>
            ? ByValid extends Prisma.True
              ? {}
              : {
                  [P in OrderFields]: P extends ByFields
                    ? never
                    : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                }[OrderFields]
            : 'Error: If you provide "skip", you also need to provide "orderBy"'
          : ByValid extends Prisma.True
            ? {}
            : {
                [P in OrderFields]: P extends ByFields
                  ? never
                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
              }[OrderFields],
  TQueryFnData = {} extends InputErrors
    ? Array<
        PickEnumerable<Prisma.JudgingRunGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.JudgingRunGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.JudgingRunGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.JudgingRunGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.JudgingRunGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountJudgingRun<
  TArgs extends Prisma.JudgingRunCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.JudgingRunCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingRunCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountJudgingRun<
  TArgs extends Prisma.JudgingRunCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.JudgingRunCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingRunCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckJudgingRun<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      id?: number;
      result?: JudgingRunResult;
      judgingId?: number;
      testcaseId?: number;
      runOutputFileName?: string;
      errorOutputFileName?: string;
      checkerOutputFileName?: string;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'JudgingRun',
    `${endpoint}/judgingRun/check`,
    args,
    options,
    fetch,
  );
}
