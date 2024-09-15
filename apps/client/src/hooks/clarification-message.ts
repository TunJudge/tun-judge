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

import type { ClarificationMessage, Prisma } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateClarificationMessage(
  options?: Omit<
    UseMutationOptions<
      ClarificationMessage | undefined,
      DefaultError,
      Prisma.ClarificationMessageCreateArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationMessageCreateArgs,
    DefaultError,
    ClarificationMessage,
    true
  >(
    'ClarificationMessage',
    'POST',
    `${endpoint}/clarificationMessage/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationMessageCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationMessageCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          | CheckSelect<T, ClarificationMessage, Prisma.ClarificationMessageGetPayload<T>>
          | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationMessageCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ClarificationMessage, Prisma.ClarificationMessageGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyClarificationMessage(
  options?: Omit<
    UseMutationOptions<
      Prisma.BatchPayload,
      DefaultError,
      Prisma.ClarificationMessageCreateManyArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationMessageCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'ClarificationMessage',
    'POST',
    `${endpoint}/clarificationMessage/createMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationMessageCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationMessageCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationMessageCreateManyArgs>
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

export function useFindManyClarificationMessage<
  TArgs extends Prisma.ClarificationMessageFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationMessageGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyClarificationMessage<
  TArgs extends Prisma.ClarificationMessageFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationMessageGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyClarificationMessage<
  TArgs extends Prisma.ClarificationMessageFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationMessageGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyClarificationMessage<
  TArgs extends Prisma.ClarificationMessageFindManyArgs,
  TQueryFnData = Array<Prisma.ClarificationMessageGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueClarificationMessage<
  TArgs extends Prisma.ClarificationMessageFindUniqueArgs,
  TQueryFnData = Prisma.ClarificationMessageGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueClarificationMessage<
  TArgs extends Prisma.ClarificationMessageFindUniqueArgs,
  TQueryFnData = Prisma.ClarificationMessageGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstClarificationMessage<
  TArgs extends Prisma.ClarificationMessageFindFirstArgs,
  TQueryFnData = Prisma.ClarificationMessageGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstClarificationMessage<
  TArgs extends Prisma.ClarificationMessageFindFirstArgs,
  TQueryFnData = Prisma.ClarificationMessageGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateClarificationMessage(
  options?: Omit<
    UseMutationOptions<
      ClarificationMessage | undefined,
      DefaultError,
      Prisma.ClarificationMessageUpdateArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationMessageUpdateArgs,
    DefaultError,
    ClarificationMessage,
    true
  >(
    'ClarificationMessage',
    'PUT',
    `${endpoint}/clarificationMessage/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationMessageUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationMessageUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          | CheckSelect<T, ClarificationMessage, Prisma.ClarificationMessageGetPayload<T>>
          | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationMessageUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ClarificationMessage, Prisma.ClarificationMessageGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyClarificationMessage(
  options?: Omit<
    UseMutationOptions<
      Prisma.BatchPayload,
      DefaultError,
      Prisma.ClarificationMessageUpdateManyArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationMessageUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'ClarificationMessage',
    'PUT',
    `${endpoint}/clarificationMessage/updateMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationMessageUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationMessageUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationMessageUpdateManyArgs>
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

export function useUpsertClarificationMessage(
  options?: Omit<
    UseMutationOptions<
      ClarificationMessage | undefined,
      DefaultError,
      Prisma.ClarificationMessageUpsertArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationMessageUpsertArgs,
    DefaultError,
    ClarificationMessage,
    true
  >(
    'ClarificationMessage',
    'POST',
    `${endpoint}/clarificationMessage/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationMessageUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationMessageUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          | CheckSelect<T, ClarificationMessage, Prisma.ClarificationMessageGetPayload<T>>
          | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationMessageUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ClarificationMessage, Prisma.ClarificationMessageGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteClarificationMessage(
  options?: Omit<
    UseMutationOptions<
      ClarificationMessage | undefined,
      DefaultError,
      Prisma.ClarificationMessageDeleteArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationMessageDeleteArgs,
    DefaultError,
    ClarificationMessage,
    true
  >(
    'ClarificationMessage',
    'DELETE',
    `${endpoint}/clarificationMessage/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationMessageDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationMessageDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          | CheckSelect<T, ClarificationMessage, Prisma.ClarificationMessageGetPayload<T>>
          | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationMessageDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ClarificationMessage, Prisma.ClarificationMessageGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyClarificationMessage(
  options?: Omit<
    UseMutationOptions<
      Prisma.BatchPayload,
      DefaultError,
      Prisma.ClarificationMessageDeleteManyArgs
    > &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ClarificationMessageDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'ClarificationMessage',
    'DELETE',
    `${endpoint}/clarificationMessage/deleteMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ClarificationMessageDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ClarificationMessageDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ClarificationMessageDeleteManyArgs>
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

export function useAggregateClarificationMessage<
  TArgs extends Prisma.ClarificationMessageAggregateArgs,
  TQueryFnData = Prisma.GetClarificationMessageAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateClarificationMessage<
  TArgs extends Prisma.ClarificationMessageAggregateArgs,
  TQueryFnData = Prisma.GetClarificationMessageAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByClarificationMessage<
  TArgs extends Prisma.ClarificationMessageGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ClarificationMessageGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ClarificationMessageGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ClarificationMessageGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs &
            keyof Prisma.ClarificationMessageGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationMessageGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationMessageGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ClarificationMessageGroupByArgs, OrderByArg> &
      InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByClarificationMessage<
  TArgs extends Prisma.ClarificationMessageGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ClarificationMessageGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ClarificationMessageGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ClarificationMessageGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs &
            keyof Prisma.ClarificationMessageGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationMessageGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ClarificationMessageGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ClarificationMessageGroupByArgs, OrderByArg> &
      InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountClarificationMessage<
  TArgs extends Prisma.ClarificationMessageCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ClarificationMessageCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountClarificationMessage<
  TArgs extends Prisma.ClarificationMessageCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ClarificationMessageCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ClarificationMessageCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckClarificationMessage<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: { id?: number; content?: string; sentById?: number; clarificationId?: number };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'ClarificationMessage',
    `${endpoint}/clarificationMessage/check`,
    args,
    options,
    fetch,
  );
}
