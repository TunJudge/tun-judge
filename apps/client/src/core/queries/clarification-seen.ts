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

import type { ClarificationSeen, Prisma } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateClarificationSeen(
  options?: Omit<
    UseMutationOptions<
      ClarificationSeen | undefined,
      DefaultError,
      Prisma.ClarificationSeenCreateArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationSeenCreateArgs,
    DefaultError,
    ClarificationSeen,
    true
  >(
    'ClarificationSeen',
    'POST',
    `${endpoint}/clarificationSeen/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationSeenCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationSeenCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ClarificationSeen, Prisma.ClarificationSeenGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationSeenCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ClarificationSeen, Prisma.ClarificationSeenGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyClarificationSeen(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ClarificationSeenCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationSeenCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'ClarificationSeen',
    'POST',
    `${endpoint}/clarificationSeen/createMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationSeenCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationSeenCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationSeenCreateManyArgs>
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

export function useFindManyClarificationSeen<
  TArgs extends Prisma.ClarificationSeenFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationSeenGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyClarificationSeen<
  TArgs extends Prisma.ClarificationSeenFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationSeenGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyClarificationSeen<
  TArgs extends Prisma.ClarificationSeenFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationSeenGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyClarificationSeen<
  TArgs extends Prisma.ClarificationSeenFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationSeenGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueClarificationSeen<
  TArgs extends Prisma.ClarificationSeenFindUniqueArgs,
  TQueryFnData = Prisma.ClarificationSeenGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueClarificationSeen<
  TArgs extends Prisma.ClarificationSeenFindUniqueArgs,
  TQueryFnData = Prisma.ClarificationSeenGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstClarificationSeen<
  TArgs extends Prisma.ClarificationSeenFindFirstArgs,
  TQueryFnData = Prisma.ClarificationSeenGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstClarificationSeen<
  TArgs extends Prisma.ClarificationSeenFindFirstArgs,
  TQueryFnData = Prisma.ClarificationSeenGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateClarificationSeen(
  options?: Omit<
    UseMutationOptions<
      ClarificationSeen | undefined,
      DefaultError,
      Prisma.ClarificationSeenUpdateArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationSeenUpdateArgs,
    DefaultError,
    ClarificationSeen,
    true
  >(
    'ClarificationSeen',
    'PUT',
    `${endpoint}/clarificationSeen/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationSeenUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationSeenUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ClarificationSeen, Prisma.ClarificationSeenGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationSeenUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ClarificationSeen, Prisma.ClarificationSeenGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyClarificationSeen(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ClarificationSeenUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationSeenUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'ClarificationSeen',
    'PUT',
    `${endpoint}/clarificationSeen/updateMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationSeenUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationSeenUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationSeenUpdateManyArgs>
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

export function useUpsertClarificationSeen(
  options?: Omit<
    UseMutationOptions<
      ClarificationSeen | undefined,
      DefaultError,
      Prisma.ClarificationSeenUpsertArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationSeenUpsertArgs,
    DefaultError,
    ClarificationSeen,
    true
  >(
    'ClarificationSeen',
    'POST',
    `${endpoint}/clarificationSeen/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationSeenUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationSeenUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ClarificationSeen, Prisma.ClarificationSeenGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationSeenUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ClarificationSeen, Prisma.ClarificationSeenGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteClarificationSeen(
  options?: Omit<
    UseMutationOptions<
      ClarificationSeen | undefined,
      DefaultError,
      Prisma.ClarificationSeenDeleteArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationSeenDeleteArgs,
    DefaultError,
    ClarificationSeen,
    true
  >(
    'ClarificationSeen',
    'DELETE',
    `${endpoint}/clarificationSeen/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationSeenDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationSeenDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ClarificationSeen, Prisma.ClarificationSeenGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationSeenDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ClarificationSeen, Prisma.ClarificationSeenGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyClarificationSeen(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ClarificationSeenDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationSeenDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'ClarificationSeen',
    'DELETE',
    `${endpoint}/clarificationSeen/deleteMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationSeenDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationSeenDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationSeenDeleteManyArgs>
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

export function useAggregateClarificationSeen<
  TArgs extends Prisma.ClarificationSeenAggregateArgs,
  TQueryFnData = Prisma.GetClarificationSeenAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateClarificationSeen<
  TArgs extends Prisma.ClarificationSeenAggregateArgs,
  TQueryFnData = Prisma.GetClarificationSeenAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByClarificationSeen<
  TArgs extends Prisma.ClarificationSeenGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ClarificationSeenGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ClarificationSeenGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ClarificationSeenGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ClarificationSeenGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationSeenGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationSeenGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ClarificationSeenGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByClarificationSeen<
  TArgs extends Prisma.ClarificationSeenGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ClarificationSeenGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ClarificationSeenGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ClarificationSeenGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ClarificationSeenGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationSeenGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationSeenGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ClarificationSeenGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountClarificationSeen<
  TArgs extends Prisma.ClarificationSeenCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ClarificationSeenCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountClarificationSeen<
  TArgs extends Prisma.ClarificationSeenCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ClarificationSeenCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationSeenCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckClarificationSeen<TError = DefaultError>(
  args: { operation: PolicyCrudKind; where?: { userId?: number; messageId?: number } },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'ClarificationSeen',
    `${endpoint}/clarificationSeen/check`,
    args,
    options,
    fetch,
  );
}
