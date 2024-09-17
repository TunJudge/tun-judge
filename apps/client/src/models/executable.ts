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

import type { Executable, Prisma } from '@prisma/client';
import type { ExecutableType } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateExecutable(
  options?: Omit<
    UseMutationOptions<Executable | undefined, DefaultError, Prisma.ExecutableCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ExecutableCreateArgs, DefaultError, Executable, true>(
    'Executable',
    'POST',
    `${endpoint}/executable/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ExecutableCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ExecutableCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Executable, Prisma.ExecutableGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ExecutableCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Executable, Prisma.ExecutableGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyExecutable(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ExecutableCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ExecutableCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Executable', 'POST', `${endpoint}/executable/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ExecutableCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ExecutableCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ExecutableCreateManyArgs>
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

export function useFindManyExecutable<
  TArgs extends Prisma.ExecutableFindManyArgs,
  TQueryFnData = Array<Prisma.ExecutableGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ExecutableFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyExecutable<
  TArgs extends Prisma.ExecutableFindManyArgs,
  TQueryFnData = Array<Prisma.ExecutableGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ExecutableFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyExecutable<
  TArgs extends Prisma.ExecutableFindManyArgs,
  TQueryFnData = Array<Prisma.ExecutableGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ExecutableFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyExecutable<
  TArgs extends Prisma.ExecutableFindManyArgs,
  TQueryFnData = Array<Prisma.ExecutableGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ExecutableFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueExecutable<
  TArgs extends Prisma.ExecutableFindUniqueArgs,
  TQueryFnData = Prisma.ExecutableGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ExecutableFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueExecutable<
  TArgs extends Prisma.ExecutableFindUniqueArgs,
  TQueryFnData = Prisma.ExecutableGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ExecutableFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstExecutable<
  TArgs extends Prisma.ExecutableFindFirstArgs,
  TQueryFnData = Prisma.ExecutableGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ExecutableFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstExecutable<
  TArgs extends Prisma.ExecutableFindFirstArgs,
  TQueryFnData = Prisma.ExecutableGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ExecutableFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateExecutable(
  options?: Omit<
    UseMutationOptions<Executable | undefined, DefaultError, Prisma.ExecutableUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ExecutableUpdateArgs, DefaultError, Executable, true>(
    'Executable',
    'PUT',
    `${endpoint}/executable/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ExecutableUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ExecutableUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Executable, Prisma.ExecutableGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ExecutableUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Executable, Prisma.ExecutableGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyExecutable(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ExecutableUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ExecutableUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Executable', 'PUT', `${endpoint}/executable/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ExecutableUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ExecutableUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ExecutableUpdateManyArgs>
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

export function useUpsertExecutable(
  options?: Omit<
    UseMutationOptions<Executable | undefined, DefaultError, Prisma.ExecutableUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ExecutableUpsertArgs, DefaultError, Executable, true>(
    'Executable',
    'POST',
    `${endpoint}/executable/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ExecutableUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.ExecutableUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Executable, Prisma.ExecutableGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ExecutableUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Executable, Prisma.ExecutableGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteExecutable(
  options?: Omit<
    UseMutationOptions<Executable | undefined, DefaultError, Prisma.ExecutableDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ExecutableDeleteArgs, DefaultError, Executable, true>(
    'Executable',
    'DELETE',
    `${endpoint}/executable/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ExecutableDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.ExecutableDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Executable, Prisma.ExecutableGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ExecutableDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Executable, Prisma.ExecutableGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyExecutable(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ExecutableDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ExecutableDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Executable', 'DELETE', `${endpoint}/executable/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ExecutableDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ExecutableDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ExecutableDeleteManyArgs>
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

export function useAggregateExecutable<
  TArgs extends Prisma.ExecutableAggregateArgs,
  TQueryFnData = Prisma.GetExecutableAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ExecutableAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateExecutable<
  TArgs extends Prisma.ExecutableAggregateArgs,
  TQueryFnData = Prisma.GetExecutableAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ExecutableAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByExecutable<
  TArgs extends Prisma.ExecutableGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ExecutableGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ExecutableGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ExecutableGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ExecutableGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ExecutableGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ExecutableGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ExecutableGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByExecutable<
  TArgs extends Prisma.ExecutableGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ExecutableGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ExecutableGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ExecutableGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ExecutableGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ExecutableGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ExecutableGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ExecutableGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountExecutable<
  TArgs extends Prisma.ExecutableCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ExecutableCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ExecutableCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountExecutable<
  TArgs extends Prisma.ExecutableCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ExecutableCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ExecutableCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Executable',
    `${endpoint}/executable/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckExecutable<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      id?: number;
      name?: string;
      description?: string;
      default?: boolean;
      dockerImage?: string;
      type?: ExecutableType;
      sourceFileName?: string;
      buildScriptName?: string;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'Executable',
    `${endpoint}/executable/check`,
    args,
    options,
    fetch,
  );
}
