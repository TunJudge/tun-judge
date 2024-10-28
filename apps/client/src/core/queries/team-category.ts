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

import type { Prisma, TeamCategory } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateTeamCategory(
  options?: Omit<
    UseMutationOptions<TeamCategory | undefined, DefaultError, Prisma.TeamCategoryCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamCategoryCreateArgs,
    DefaultError,
    TeamCategory,
    true
  >('TeamCategory', 'POST', `${endpoint}/teamCategory/create`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamCategoryCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamCategoryCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, TeamCategory, Prisma.TeamCategoryGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamCategoryCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, TeamCategory, Prisma.TeamCategoryGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyTeamCategory(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.TeamCategoryCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamCategoryCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('TeamCategory', 'POST', `${endpoint}/teamCategory/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamCategoryCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamCategoryCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamCategoryCreateManyArgs>
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

export function useFindManyTeamCategory<
  TArgs extends Prisma.TeamCategoryFindManyArgs,
  TQueryFnData = Array<Prisma.TeamCategoryGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyTeamCategory<
  TArgs extends Prisma.TeamCategoryFindManyArgs,
  TQueryFnData = Array<Prisma.TeamCategoryGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyTeamCategory<
  TArgs extends Prisma.TeamCategoryFindManyArgs,
  TQueryFnData = Array<Prisma.TeamCategoryGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyTeamCategory<
  TArgs extends Prisma.TeamCategoryFindManyArgs,
  TQueryFnData = Array<Prisma.TeamCategoryGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueTeamCategory<
  TArgs extends Prisma.TeamCategoryFindUniqueArgs,
  TQueryFnData = Prisma.TeamCategoryGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueTeamCategory<
  TArgs extends Prisma.TeamCategoryFindUniqueArgs,
  TQueryFnData = Prisma.TeamCategoryGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstTeamCategory<
  TArgs extends Prisma.TeamCategoryFindFirstArgs,
  TQueryFnData = Prisma.TeamCategoryGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstTeamCategory<
  TArgs extends Prisma.TeamCategoryFindFirstArgs,
  TQueryFnData = Prisma.TeamCategoryGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateTeamCategory(
  options?: Omit<
    UseMutationOptions<TeamCategory | undefined, DefaultError, Prisma.TeamCategoryUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamCategoryUpdateArgs,
    DefaultError,
    TeamCategory,
    true
  >('TeamCategory', 'PUT', `${endpoint}/teamCategory/update`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamCategoryUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamCategoryUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, TeamCategory, Prisma.TeamCategoryGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamCategoryUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, TeamCategory, Prisma.TeamCategoryGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyTeamCategory(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.TeamCategoryUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamCategoryUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('TeamCategory', 'PUT', `${endpoint}/teamCategory/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamCategoryUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamCategoryUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamCategoryUpdateManyArgs>
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

export function useUpsertTeamCategory(
  options?: Omit<
    UseMutationOptions<TeamCategory | undefined, DefaultError, Prisma.TeamCategoryUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamCategoryUpsertArgs,
    DefaultError,
    TeamCategory,
    true
  >('TeamCategory', 'POST', `${endpoint}/teamCategory/upsert`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamCategoryUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamCategoryUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, TeamCategory, Prisma.TeamCategoryGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamCategoryUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, TeamCategory, Prisma.TeamCategoryGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteTeamCategory(
  options?: Omit<
    UseMutationOptions<TeamCategory | undefined, DefaultError, Prisma.TeamCategoryDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamCategoryDeleteArgs,
    DefaultError,
    TeamCategory,
    true
  >('TeamCategory', 'DELETE', `${endpoint}/teamCategory/delete`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamCategoryDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamCategoryDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, TeamCategory, Prisma.TeamCategoryGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamCategoryDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, TeamCategory, Prisma.TeamCategoryGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyTeamCategory(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.TeamCategoryDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TeamCategoryDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'TeamCategory',
    'DELETE',
    `${endpoint}/teamCategory/deleteMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TeamCategoryDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.TeamCategoryDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TeamCategoryDeleteManyArgs>
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

export function useAggregateTeamCategory<
  TArgs extends Prisma.TeamCategoryAggregateArgs,
  TQueryFnData = Prisma.GetTeamCategoryAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateTeamCategory<
  TArgs extends Prisma.TeamCategoryAggregateArgs,
  TQueryFnData = Prisma.GetTeamCategoryAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByTeamCategory<
  TArgs extends Prisma.TeamCategoryGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.TeamCategoryGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.TeamCategoryGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.TeamCategoryGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.TeamCategoryGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.TeamCategoryGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.TeamCategoryGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.TeamCategoryGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByTeamCategory<
  TArgs extends Prisma.TeamCategoryGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.TeamCategoryGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.TeamCategoryGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.TeamCategoryGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.TeamCategoryGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.TeamCategoryGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.TeamCategoryGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.TeamCategoryGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountTeamCategory<
  TArgs extends Prisma.TeamCategoryCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.TeamCategoryCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountTeamCategory<
  TArgs extends Prisma.TeamCategoryCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.TeamCategoryCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TeamCategoryCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckTeamCategory<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: { id?: number; name?: string; rank?: number; color?: string; visible?: boolean };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'TeamCategory',
    `${endpoint}/teamCategory/check`,
    args,
    options,
    fetch,
  );
}
