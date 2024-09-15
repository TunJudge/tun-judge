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

import type { JudgeHost, Prisma } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateJudgeHost(
  options?: Omit<
    UseMutationOptions<JudgeHost | undefined, DefaultError, Prisma.JudgeHostCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgeHostCreateArgs, DefaultError, JudgeHost, true>(
    'JudgeHost',
    'POST',
    `${endpoint}/judgeHost/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgeHostCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgeHostCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, JudgeHost, Prisma.JudgeHostGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgeHostCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, JudgeHost, Prisma.JudgeHostGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyJudgeHost(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.JudgeHostCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.JudgeHostCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('JudgeHost', 'POST', `${endpoint}/judgeHost/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgeHostCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgeHostCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgeHostCreateManyArgs>
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

export function useFindManyJudgeHost<
  TArgs extends Prisma.JudgeHostFindManyArgs,
  TQueryFnData = Array<Prisma.JudgeHostGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgeHostFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyJudgeHost<
  TArgs extends Prisma.JudgeHostFindManyArgs,
  TQueryFnData = Array<Prisma.JudgeHostGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgeHostFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyJudgeHost<
  TArgs extends Prisma.JudgeHostFindManyArgs,
  TQueryFnData = Array<Prisma.JudgeHostGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgeHostFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyJudgeHost<
  TArgs extends Prisma.JudgeHostFindManyArgs,
  TQueryFnData = Array<Prisma.JudgeHostGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgeHostFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueJudgeHost<
  TArgs extends Prisma.JudgeHostFindUniqueArgs,
  TQueryFnData = Prisma.JudgeHostGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgeHostFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueJudgeHost<
  TArgs extends Prisma.JudgeHostFindUniqueArgs,
  TQueryFnData = Prisma.JudgeHostGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgeHostFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstJudgeHost<
  TArgs extends Prisma.JudgeHostFindFirstArgs,
  TQueryFnData = Prisma.JudgeHostGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgeHostFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstJudgeHost<
  TArgs extends Prisma.JudgeHostFindFirstArgs,
  TQueryFnData = Prisma.JudgeHostGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgeHostFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateJudgeHost(
  options?: Omit<
    UseMutationOptions<JudgeHost | undefined, DefaultError, Prisma.JudgeHostUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgeHostUpdateArgs, DefaultError, JudgeHost, true>(
    'JudgeHost',
    'PUT',
    `${endpoint}/judgeHost/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgeHostUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgeHostUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, JudgeHost, Prisma.JudgeHostGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgeHostUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, JudgeHost, Prisma.JudgeHostGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyJudgeHost(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.JudgeHostUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.JudgeHostUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('JudgeHost', 'PUT', `${endpoint}/judgeHost/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgeHostUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgeHostUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgeHostUpdateManyArgs>
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

export function useUpsertJudgeHost(
  options?: Omit<
    UseMutationOptions<JudgeHost | undefined, DefaultError, Prisma.JudgeHostUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgeHostUpsertArgs, DefaultError, JudgeHost, true>(
    'JudgeHost',
    'POST',
    `${endpoint}/judgeHost/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgeHostUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgeHostUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, JudgeHost, Prisma.JudgeHostGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgeHostUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, JudgeHost, Prisma.JudgeHostGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteJudgeHost(
  options?: Omit<
    UseMutationOptions<JudgeHost | undefined, DefaultError, Prisma.JudgeHostDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgeHostDeleteArgs, DefaultError, JudgeHost, true>(
    'JudgeHost',
    'DELETE',
    `${endpoint}/judgeHost/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgeHostDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgeHostDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, JudgeHost, Prisma.JudgeHostGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgeHostDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, JudgeHost, Prisma.JudgeHostGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyJudgeHost(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.JudgeHostDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.JudgeHostDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('JudgeHost', 'DELETE', `${endpoint}/judgeHost/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgeHostDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgeHostDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgeHostDeleteManyArgs>
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

export function useAggregateJudgeHost<
  TArgs extends Prisma.JudgeHostAggregateArgs,
  TQueryFnData = Prisma.GetJudgeHostAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgeHostAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateJudgeHost<
  TArgs extends Prisma.JudgeHostAggregateArgs,
  TQueryFnData = Prisma.GetJudgeHostAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgeHostAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByJudgeHost<
  TArgs extends Prisma.JudgeHostGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.JudgeHostGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.JudgeHostGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.JudgeHostGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.JudgeHostGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.JudgeHostGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.JudgeHostGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.JudgeHostGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByJudgeHost<
  TArgs extends Prisma.JudgeHostGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.JudgeHostGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.JudgeHostGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.JudgeHostGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.JudgeHostGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.JudgeHostGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.JudgeHostGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.JudgeHostGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountJudgeHost<
  TArgs extends Prisma.JudgeHostCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.JudgeHostCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgeHostCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountJudgeHost<
  TArgs extends Prisma.JudgeHostCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.JudgeHostCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgeHostCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckJudgeHost<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: { id?: number; hostname?: string; active?: boolean; userId?: number };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'JudgeHost',
    `${endpoint}/judgeHost/check`,
    args,
    options,
    fetch,
  );
}
