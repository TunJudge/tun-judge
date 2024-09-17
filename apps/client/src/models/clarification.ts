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

import type { Clarification, Prisma } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateClarification(
  options?: Omit<
    UseMutationOptions<Clarification | undefined, DefaultError, Prisma.ClarificationCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationCreateArgs,
    DefaultError,
    Clarification,
    true
  >('Clarification', 'POST', `${endpoint}/clarification/create`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Clarification, Prisma.ClarificationGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Clarification, Prisma.ClarificationGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyClarification(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ClarificationCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'Clarification',
    'POST',
    `${endpoint}/clarification/createMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationCreateManyArgs>
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

export function useFindManyClarification<
  TArgs extends Prisma.ClarificationFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyClarification<
  TArgs extends Prisma.ClarificationFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyClarification<
  TArgs extends Prisma.ClarificationFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyClarification<
  TArgs extends Prisma.ClarificationFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueClarification<
  TArgs extends Prisma.ClarificationFindUniqueArgs,
  TQueryFnData = Prisma.ClarificationGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueClarification<
  TArgs extends Prisma.ClarificationFindUniqueArgs,
  TQueryFnData = Prisma.ClarificationGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstClarification<
  TArgs extends Prisma.ClarificationFindFirstArgs,
  TQueryFnData = Prisma.ClarificationGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstClarification<
  TArgs extends Prisma.ClarificationFindFirstArgs,
  TQueryFnData = Prisma.ClarificationGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateClarification(
  options?: Omit<
    UseMutationOptions<Clarification | undefined, DefaultError, Prisma.ClarificationUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationUpdateArgs,
    DefaultError,
    Clarification,
    true
  >('Clarification', 'PUT', `${endpoint}/clarification/update`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Clarification, Prisma.ClarificationGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Clarification, Prisma.ClarificationGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyClarification(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ClarificationUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'Clarification',
    'PUT',
    `${endpoint}/clarification/updateMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationUpdateManyArgs>
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

export function useUpsertClarification(
  options?: Omit<
    UseMutationOptions<Clarification | undefined, DefaultError, Prisma.ClarificationUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationUpsertArgs,
    DefaultError,
    Clarification,
    true
  >('Clarification', 'POST', `${endpoint}/clarification/upsert`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Clarification, Prisma.ClarificationGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Clarification, Prisma.ClarificationGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteClarification(
  options?: Omit<
    UseMutationOptions<Clarification | undefined, DefaultError, Prisma.ClarificationDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationDeleteArgs,
    DefaultError,
    Clarification,
    true
  >('Clarification', 'DELETE', `${endpoint}/clarification/delete`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Clarification, Prisma.ClarificationGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Clarification, Prisma.ClarificationGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyClarification(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ClarificationDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'Clarification',
    'DELETE',
    `${endpoint}/clarification/deleteMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationDeleteManyArgs>
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

export function useAggregateClarification<
  TArgs extends Prisma.ClarificationAggregateArgs,
  TQueryFnData = Prisma.GetClarificationAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateClarification<
  TArgs extends Prisma.ClarificationAggregateArgs,
  TQueryFnData = Prisma.GetClarificationAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByClarification<
  TArgs extends Prisma.ClarificationGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ClarificationGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ClarificationGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ClarificationGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ClarificationGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ClarificationGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByClarification<
  TArgs extends Prisma.ClarificationGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ClarificationGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ClarificationGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ClarificationGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ClarificationGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ClarificationGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountClarification<
  TArgs extends Prisma.ClarificationCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ClarificationCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountClarification<
  TArgs extends Prisma.ClarificationCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ClarificationCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Clarification',
    `${endpoint}/clarification/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckClarification<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      id?: number;
      general?: boolean;
      contestId?: number;
      problemId?: number;
      teamId?: number;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'Clarification',
    `${endpoint}/clarification/check`,
    args,
    options,
    fetch,
  );
}
