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

import type { Prisma, TeamContest } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateTeamContest(
  options?: Omit<
    UseMutationOptions<TeamContest | undefined, DefaultError, Prisma.TeamContestCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.TeamContestCreateArgs, DefaultError, TeamContest, true>(
    'TeamContest',
    'POST',
    `${endpoint}/teamContest/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamContestCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamContestCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, TeamContest, Prisma.TeamContestGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamContestCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, TeamContest, Prisma.TeamContestGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyTeamContest(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.TeamContestCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamContestCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('TeamContest', 'POST', `${endpoint}/teamContest/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamContestCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamContestCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamContestCreateManyArgs>
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

export function useFindManyTeamContest<
  TArgs extends Prisma.TeamContestFindManyArgs,
  TQueryFnData = Array<Prisma.TeamContestGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamContestFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyTeamContest<
  TArgs extends Prisma.TeamContestFindManyArgs,
  TQueryFnData = Array<Prisma.TeamContestGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamContestFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyTeamContest<
  TArgs extends Prisma.TeamContestFindManyArgs,
  TQueryFnData = Array<Prisma.TeamContestGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamContestFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyTeamContest<
  TArgs extends Prisma.TeamContestFindManyArgs,
  TQueryFnData = Array<Prisma.TeamContestGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamContestFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueTeamContest<
  TArgs extends Prisma.TeamContestFindUniqueArgs,
  TQueryFnData = Prisma.TeamContestGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TeamContestFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueTeamContest<
  TArgs extends Prisma.TeamContestFindUniqueArgs,
  TQueryFnData = Prisma.TeamContestGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TeamContestFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstTeamContest<
  TArgs extends Prisma.TeamContestFindFirstArgs,
  TQueryFnData = Prisma.TeamContestGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamContestFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstTeamContest<
  TArgs extends Prisma.TeamContestFindFirstArgs,
  TQueryFnData = Prisma.TeamContestGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamContestFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateTeamContest(
  options?: Omit<
    UseMutationOptions<TeamContest | undefined, DefaultError, Prisma.TeamContestUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.TeamContestUpdateArgs, DefaultError, TeamContest, true>(
    'TeamContest',
    'PUT',
    `${endpoint}/teamContest/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamContestUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamContestUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, TeamContest, Prisma.TeamContestGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamContestUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, TeamContest, Prisma.TeamContestGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyTeamContest(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.TeamContestUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamContestUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('TeamContest', 'PUT', `${endpoint}/teamContest/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamContestUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamContestUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamContestUpdateManyArgs>
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

export function useUpsertTeamContest(
  options?: Omit<
    UseMutationOptions<TeamContest | undefined, DefaultError, Prisma.TeamContestUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.TeamContestUpsertArgs, DefaultError, TeamContest, true>(
    'TeamContest',
    'POST',
    `${endpoint}/teamContest/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamContestUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamContestUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, TeamContest, Prisma.TeamContestGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamContestUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, TeamContest, Prisma.TeamContestGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteTeamContest(
  options?: Omit<
    UseMutationOptions<TeamContest | undefined, DefaultError, Prisma.TeamContestDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.TeamContestDeleteArgs, DefaultError, TeamContest, true>(
    'TeamContest',
    'DELETE',
    `${endpoint}/teamContest/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamContestDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamContestDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, TeamContest, Prisma.TeamContestGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamContestDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, TeamContest, Prisma.TeamContestGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyTeamContest(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.TeamContestDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamContestDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('TeamContest', 'DELETE', `${endpoint}/teamContest/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamContestDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamContestDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamContestDeleteManyArgs>
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

export function useAggregateTeamContest<
  TArgs extends Prisma.TeamContestAggregateArgs,
  TQueryFnData = Prisma.GetTeamContestAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TeamContestAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateTeamContest<
  TArgs extends Prisma.TeamContestAggregateArgs,
  TQueryFnData = Prisma.GetTeamContestAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TeamContestAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByTeamContest<
  TArgs extends Prisma.TeamContestGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.TeamContestGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.TeamContestGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.TeamContestGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.TeamContestGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.TeamContestGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.TeamContestGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.TeamContestGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByTeamContest<
  TArgs extends Prisma.TeamContestGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.TeamContestGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.TeamContestGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.TeamContestGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.TeamContestGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.TeamContestGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.TeamContestGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.TeamContestGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountTeamContest<
  TArgs extends Prisma.TeamContestCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.TeamContestCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamContestCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountTeamContest<
  TArgs extends Prisma.TeamContestCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.TeamContestCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamContestCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamContest',
    `${endpoint}/teamContest/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckTeamContest<TError = DefaultError>(
  args: { operation: PolicyCrudKind; where?: { teamId?: number; contestId?: number } },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'TeamContest',
    `${endpoint}/teamContest/check`,
    args,
    options,
    fetch,
  );
}
