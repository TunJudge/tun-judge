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

import type { Contest, Prisma } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateContest(
  options?: Omit<
    UseMutationOptions<Contest | undefined, DefaultError, Prisma.ContestCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ContestCreateArgs, DefaultError, Contest, true>(
    'Contest',
    'POST',
    `${endpoint}/contest/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Contest, Prisma.ContestGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Contest, Prisma.ContestGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyContest(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ContestCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Contest', 'POST', `${endpoint}/contest/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestCreateManyArgs>
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

export function useFindManyContest<
  TArgs extends Prisma.ContestFindManyArgs,
  TQueryFnData = Array<Prisma.ContestGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyContest<
  TArgs extends Prisma.ContestFindManyArgs,
  TQueryFnData = Array<Prisma.ContestGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyContest<
  TArgs extends Prisma.ContestFindManyArgs,
  TQueryFnData = Array<Prisma.ContestGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyContest<
  TArgs extends Prisma.ContestFindManyArgs,
  TQueryFnData = Array<Prisma.ContestGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueContest<
  TArgs extends Prisma.ContestFindUniqueArgs,
  TQueryFnData = Prisma.ContestGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ContestFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueContest<
  TArgs extends Prisma.ContestFindUniqueArgs,
  TQueryFnData = Prisma.ContestGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ContestFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstContest<
  TArgs extends Prisma.ContestFindFirstArgs,
  TQueryFnData = Prisma.ContestGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstContest<
  TArgs extends Prisma.ContestFindFirstArgs,
  TQueryFnData = Prisma.ContestGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateContest(
  options?: Omit<
    UseMutationOptions<Contest | undefined, DefaultError, Prisma.ContestUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ContestUpdateArgs, DefaultError, Contest, true>(
    'Contest',
    'PUT',
    `${endpoint}/contest/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Contest, Prisma.ContestGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Contest, Prisma.ContestGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyContest(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ContestUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Contest', 'PUT', `${endpoint}/contest/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestUpdateManyArgs>
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

export function useUpsertContest(
  options?: Omit<
    UseMutationOptions<Contest | undefined, DefaultError, Prisma.ContestUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ContestUpsertArgs, DefaultError, Contest, true>(
    'Contest',
    'POST',
    `${endpoint}/contest/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Contest, Prisma.ContestGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Contest, Prisma.ContestGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteContest(
  options?: Omit<
    UseMutationOptions<Contest | undefined, DefaultError, Prisma.ContestDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ContestDeleteArgs, DefaultError, Contest, true>(
    'Contest',
    'DELETE',
    `${endpoint}/contest/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Contest, Prisma.ContestGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Contest, Prisma.ContestGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyContest(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ContestDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Contest', 'DELETE', `${endpoint}/contest/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestDeleteManyArgs>
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

export function useAggregateContest<
  TArgs extends Prisma.ContestAggregateArgs,
  TQueryFnData = Prisma.GetContestAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ContestAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateContest<
  TArgs extends Prisma.ContestAggregateArgs,
  TQueryFnData = Prisma.GetContestAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ContestAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByContest<
  TArgs extends Prisma.ContestGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ContestGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ContestGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ContestGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ContestGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ContestGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ContestGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ContestGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByContest<
  TArgs extends Prisma.ContestGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ContestGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ContestGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ContestGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ContestGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ContestGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ContestGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ContestGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountContest<
  TArgs extends Prisma.ContestCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ContestCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountContest<
  TArgs extends Prisma.ContestCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ContestCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Contest',
    `${endpoint}/contest/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckContest<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      id?: number;
      name?: string;
      shortName?: string;
      enabled?: boolean;
      processBalloons?: boolean;
      public?: boolean;
      openToAllTeams?: boolean;
      verificationRequired?: boolean;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'Contest',
    `${endpoint}/contest/check`,
    args,
    options,
    fetch,
  );
}
