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

import type { Prisma, ScoreCache } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateScoreCache(
  options?: Omit<
    UseMutationOptions<ScoreCache | undefined, DefaultError, Prisma.ScoreCacheCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ScoreCacheCreateArgs, DefaultError, ScoreCache, true>(
    'ScoreCache',
    'POST',
    `${endpoint}/scoreCache/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ScoreCacheCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ScoreCacheCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ScoreCache, Prisma.ScoreCacheGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ScoreCacheCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ScoreCache, Prisma.ScoreCacheGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyScoreCache(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ScoreCacheCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ScoreCacheCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('ScoreCache', 'POST', `${endpoint}/scoreCache/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ScoreCacheCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ScoreCacheCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ScoreCacheCreateManyArgs>
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

export function useFindManyScoreCache<
  TArgs extends Prisma.ScoreCacheFindManyArgs,
  TQueryFnData = Array<Prisma.ScoreCacheGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyScoreCache<
  TArgs extends Prisma.ScoreCacheFindManyArgs,
  TQueryFnData = Array<Prisma.ScoreCacheGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyScoreCache<
  TArgs extends Prisma.ScoreCacheFindManyArgs,
  TQueryFnData = Array<Prisma.ScoreCacheGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyScoreCache<
  TArgs extends Prisma.ScoreCacheFindManyArgs,
  TQueryFnData = Array<Prisma.ScoreCacheGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueScoreCache<
  TArgs extends Prisma.ScoreCacheFindUniqueArgs,
  TQueryFnData = Prisma.ScoreCacheGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueScoreCache<
  TArgs extends Prisma.ScoreCacheFindUniqueArgs,
  TQueryFnData = Prisma.ScoreCacheGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstScoreCache<
  TArgs extends Prisma.ScoreCacheFindFirstArgs,
  TQueryFnData = Prisma.ScoreCacheGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstScoreCache<
  TArgs extends Prisma.ScoreCacheFindFirstArgs,
  TQueryFnData = Prisma.ScoreCacheGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateScoreCache(
  options?: Omit<
    UseMutationOptions<ScoreCache | undefined, DefaultError, Prisma.ScoreCacheUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ScoreCacheUpdateArgs, DefaultError, ScoreCache, true>(
    'ScoreCache',
    'PUT',
    `${endpoint}/scoreCache/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ScoreCacheUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ScoreCacheUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ScoreCache, Prisma.ScoreCacheGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ScoreCacheUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ScoreCache, Prisma.ScoreCacheGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyScoreCache(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ScoreCacheUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ScoreCacheUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('ScoreCache', 'PUT', `${endpoint}/scoreCache/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ScoreCacheUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ScoreCacheUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ScoreCacheUpdateManyArgs>
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

export function useUpsertScoreCache(
  options?: Omit<
    UseMutationOptions<ScoreCache | undefined, DefaultError, Prisma.ScoreCacheUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ScoreCacheUpsertArgs, DefaultError, ScoreCache, true>(
    'ScoreCache',
    'POST',
    `${endpoint}/scoreCache/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ScoreCacheUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.ScoreCacheUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ScoreCache, Prisma.ScoreCacheGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ScoreCacheUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ScoreCache, Prisma.ScoreCacheGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteScoreCache(
  options?: Omit<
    UseMutationOptions<ScoreCache | undefined, DefaultError, Prisma.ScoreCacheDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ScoreCacheDeleteArgs, DefaultError, ScoreCache, true>(
    'ScoreCache',
    'DELETE',
    `${endpoint}/scoreCache/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ScoreCacheDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.ScoreCacheDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ScoreCache, Prisma.ScoreCacheGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ScoreCacheDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ScoreCache, Prisma.ScoreCacheGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyScoreCache(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ScoreCacheDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ScoreCacheDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('ScoreCache', 'DELETE', `${endpoint}/scoreCache/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ScoreCacheDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ScoreCacheDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ScoreCacheDeleteManyArgs>
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

export function useAggregateScoreCache<
  TArgs extends Prisma.ScoreCacheAggregateArgs,
  TQueryFnData = Prisma.GetScoreCacheAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateScoreCache<
  TArgs extends Prisma.ScoreCacheAggregateArgs,
  TQueryFnData = Prisma.GetScoreCacheAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByScoreCache<
  TArgs extends Prisma.ScoreCacheGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ScoreCacheGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ScoreCacheGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ScoreCacheGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ScoreCacheGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ScoreCacheGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ScoreCacheGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ScoreCacheGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByScoreCache<
  TArgs extends Prisma.ScoreCacheGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ScoreCacheGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ScoreCacheGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ScoreCacheGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ScoreCacheGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ScoreCacheGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ScoreCacheGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ScoreCacheGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountScoreCache<
  TArgs extends Prisma.ScoreCacheCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ScoreCacheCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountScoreCache<
  TArgs extends Prisma.ScoreCacheCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ScoreCacheCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ScoreCacheCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckScoreCache<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      contestId?: number;
      teamId?: number;
      problemId?: number;
      submissions?: number;
      pending?: number;
      correct?: boolean;
      firstToSolve?: boolean;
      restrictedSubmissions?: number;
      restrictedPending?: number;
      restrictedCorrect?: boolean;
      restrictedFirstToSolve?: boolean;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'ScoreCache',
    `${endpoint}/scoreCache/check`,
    args,
    options,
    fetch,
  );
}
