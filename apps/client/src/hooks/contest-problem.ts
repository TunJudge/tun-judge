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

import type { ContestProblem, Prisma } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateContestProblem(
  options?: Omit<
    UseMutationOptions<ContestProblem | undefined, DefaultError, Prisma.ContestProblemCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestProblemCreateArgs,
    DefaultError,
    ContestProblem,
    true
  >('ContestProblem', 'POST', `${endpoint}/contestProblem/create`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestProblemCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestProblemCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ContestProblem, Prisma.ContestProblemGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestProblemCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ContestProblem, Prisma.ContestProblemGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyContestProblem(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ContestProblemCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestProblemCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'ContestProblem',
    'POST',
    `${endpoint}/contestProblem/createMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestProblemCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestProblemCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestProblemCreateManyArgs>
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

export function useFindManyContestProblem<
  TArgs extends Prisma.ContestProblemFindManyArgs,
  TQueryFnData = Array<Prisma.ContestProblemGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestProblemFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyContestProblem<
  TArgs extends Prisma.ContestProblemFindManyArgs,
  TQueryFnData = Array<Prisma.ContestProblemGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestProblemFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyContestProblem<
  TArgs extends Prisma.ContestProblemFindManyArgs,
  TQueryFnData = Array<Prisma.ContestProblemGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestProblemFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyContestProblem<
  TArgs extends Prisma.ContestProblemFindManyArgs,
  TQueryFnData = Array<Prisma.ContestProblemGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestProblemFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueContestProblem<
  TArgs extends Prisma.ContestProblemFindUniqueArgs,
  TQueryFnData = Prisma.ContestProblemGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ContestProblemFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueContestProblem<
  TArgs extends Prisma.ContestProblemFindUniqueArgs,
  TQueryFnData = Prisma.ContestProblemGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ContestProblemFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstContestProblem<
  TArgs extends Prisma.ContestProblemFindFirstArgs,
  TQueryFnData = Prisma.ContestProblemGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestProblemFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstContestProblem<
  TArgs extends Prisma.ContestProblemFindFirstArgs,
  TQueryFnData = Prisma.ContestProblemGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestProblemFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateContestProblem(
  options?: Omit<
    UseMutationOptions<ContestProblem | undefined, DefaultError, Prisma.ContestProblemUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestProblemUpdateArgs,
    DefaultError,
    ContestProblem,
    true
  >('ContestProblem', 'PUT', `${endpoint}/contestProblem/update`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestProblemUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestProblemUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ContestProblem, Prisma.ContestProblemGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestProblemUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ContestProblem, Prisma.ContestProblemGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyContestProblem(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ContestProblemUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestProblemUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'ContestProblem',
    'PUT',
    `${endpoint}/contestProblem/updateMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestProblemUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestProblemUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestProblemUpdateManyArgs>
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

export function useUpsertContestProblem(
  options?: Omit<
    UseMutationOptions<ContestProblem | undefined, DefaultError, Prisma.ContestProblemUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestProblemUpsertArgs,
    DefaultError,
    ContestProblem,
    true
  >('ContestProblem', 'POST', `${endpoint}/contestProblem/upsert`, metadata, options, fetch, true);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestProblemUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestProblemUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ContestProblem, Prisma.ContestProblemGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestProblemUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ContestProblem, Prisma.ContestProblemGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteContestProblem(
  options?: Omit<
    UseMutationOptions<ContestProblem | undefined, DefaultError, Prisma.ContestProblemDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestProblemDeleteArgs,
    DefaultError,
    ContestProblem,
    true
  >(
    'ContestProblem',
    'DELETE',
    `${endpoint}/contestProblem/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestProblemDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestProblemDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, ContestProblem, Prisma.ContestProblemGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestProblemDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, ContestProblem, Prisma.ContestProblemGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyContestProblem(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ContestProblemDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ContestProblemDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >(
    'ContestProblem',
    'DELETE',
    `${endpoint}/contestProblem/deleteMany`,
    metadata,
    options,
    fetch,
    false,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ContestProblemDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ContestProblemDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ContestProblemDeleteManyArgs>
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

export function useAggregateContestProblem<
  TArgs extends Prisma.ContestProblemAggregateArgs,
  TQueryFnData = Prisma.GetContestProblemAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ContestProblemAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateContestProblem<
  TArgs extends Prisma.ContestProblemAggregateArgs,
  TQueryFnData = Prisma.GetContestProblemAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ContestProblemAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByContestProblem<
  TArgs extends Prisma.ContestProblemGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ContestProblemGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ContestProblemGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ContestProblemGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ContestProblemGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ContestProblemGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ContestProblemGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ContestProblemGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByContestProblem<
  TArgs extends Prisma.ContestProblemGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ContestProblemGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ContestProblemGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ContestProblemGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ContestProblemGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ContestProblemGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ContestProblemGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ContestProblemGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountContestProblem<
  TArgs extends Prisma.ContestProblemCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ContestProblemCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestProblemCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountContestProblem<
  TArgs extends Prisma.ContestProblemCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ContestProblemCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ContestProblemCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckContestProblem<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      contestId?: number;
      problemId?: number;
      shortName?: string;
      points?: number;
      allowSubmit?: boolean;
      allowJudge?: boolean;
      color?: string;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'ContestProblem',
    `${endpoint}/contestProblem/check`,
    args,
    options,
    fetch,
  );
}
