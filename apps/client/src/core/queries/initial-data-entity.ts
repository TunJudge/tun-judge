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

import type { InitialDataEntity, Prisma } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateInitialDataEntity(
  options?: Omit<
    UseMutationOptions<
      InitialDataEntity | undefined,
      DefaultError,
      Prisma.InitialDataEntityCreateArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.InitialDataEntityCreateArgs,
    DefaultError,
    InitialDataEntity,
    true
  >(
    'InitialDataEntity',
    'POST',
    `${endpoint}/initialDataEntity/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.InitialDataEntityCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.InitialDataEntityCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, InitialDataEntity, Prisma.InitialDataEntityGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.InitialDataEntityCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, InitialDataEntity, Prisma.InitialDataEntityGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyInitialDataEntity(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.InitialDataEntityCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.InitialDataEntityCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'InitialDataEntity',
    'POST',
    `${endpoint}/initialDataEntity/createMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.InitialDataEntityCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.InitialDataEntityCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.InitialDataEntityCreateManyArgs>
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

export function useFindManyInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityFindManyArgs,
  TQueryFnData = Array<Prisma.InitialDataEntityGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityFindManyArgs,
  TQueryFnData = Array<Prisma.InitialDataEntityGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityFindManyArgs,
  TQueryFnData = Array<Prisma.InitialDataEntityGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityFindManyArgs,
  TQueryFnData = Array<Prisma.InitialDataEntityGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityFindUniqueArgs,
  TQueryFnData = Prisma.InitialDataEntityGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityFindUniqueArgs,
  TQueryFnData = Prisma.InitialDataEntityGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityFindFirstArgs,
  TQueryFnData = Prisma.InitialDataEntityGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityFindFirstArgs,
  TQueryFnData = Prisma.InitialDataEntityGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateInitialDataEntity(
  options?: Omit<
    UseMutationOptions<
      InitialDataEntity | undefined,
      DefaultError,
      Prisma.InitialDataEntityUpdateArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.InitialDataEntityUpdateArgs,
    DefaultError,
    InitialDataEntity,
    true
  >(
    'InitialDataEntity',
    'PUT',
    `${endpoint}/initialDataEntity/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.InitialDataEntityUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.InitialDataEntityUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, InitialDataEntity, Prisma.InitialDataEntityGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.InitialDataEntityUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, InitialDataEntity, Prisma.InitialDataEntityGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyInitialDataEntity(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.InitialDataEntityUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.InitialDataEntityUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'InitialDataEntity',
    'PUT',
    `${endpoint}/initialDataEntity/updateMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.InitialDataEntityUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.InitialDataEntityUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.InitialDataEntityUpdateManyArgs>
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

export function useUpsertInitialDataEntity(
  options?: Omit<
    UseMutationOptions<
      InitialDataEntity | undefined,
      DefaultError,
      Prisma.InitialDataEntityUpsertArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.InitialDataEntityUpsertArgs,
    DefaultError,
    InitialDataEntity,
    true
  >(
    'InitialDataEntity',
    'POST',
    `${endpoint}/initialDataEntity/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.InitialDataEntityUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.InitialDataEntityUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, InitialDataEntity, Prisma.InitialDataEntityGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.InitialDataEntityUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, InitialDataEntity, Prisma.InitialDataEntityGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteInitialDataEntity(
  options?: Omit<
    UseMutationOptions<
      InitialDataEntity | undefined,
      DefaultError,
      Prisma.InitialDataEntityDeleteArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.InitialDataEntityDeleteArgs,
    DefaultError,
    InitialDataEntity,
    true
  >(
    'InitialDataEntity',
    'DELETE',
    `${endpoint}/initialDataEntity/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.InitialDataEntityDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.InitialDataEntityDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, InitialDataEntity, Prisma.InitialDataEntityGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.InitialDataEntityDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, InitialDataEntity, Prisma.InitialDataEntityGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyInitialDataEntity(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.InitialDataEntityDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.InitialDataEntityDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'InitialDataEntity',
    'DELETE',
    `${endpoint}/initialDataEntity/deleteMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.InitialDataEntityDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.InitialDataEntityDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.InitialDataEntityDeleteManyArgs>
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

export function useAggregateInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityAggregateArgs,
  TQueryFnData = Prisma.GetInitialDataEntityAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityAggregateArgs,
  TQueryFnData = Prisma.GetInitialDataEntityAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.InitialDataEntityGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.InitialDataEntityGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.InitialDataEntityGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.InitialDataEntityGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.InitialDataEntityGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.InitialDataEntityGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.InitialDataEntityGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.InitialDataEntityGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.InitialDataEntityGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.InitialDataEntityGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.InitialDataEntityGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.InitialDataEntityGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.InitialDataEntityGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.InitialDataEntityGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.InitialDataEntityCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountInitialDataEntity<
  TArgs extends Prisma.InitialDataEntityCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.InitialDataEntityCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.InitialDataEntityCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckInitialDataEntity<TError = DefaultError>(
  args: { operation: PolicyCrudKind; where?: { id?: number; name?: string } },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'InitialDataEntity',
    `${endpoint}/initialDataEntity/check`,
    args,
    options,
    fetch,
  );
}
