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

import type { Prisma, Problem } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateProblem(
  options?: Omit<
    UseMutationOptions<Problem | undefined, DefaultError, Prisma.ProblemCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ProblemCreateArgs, DefaultError, Problem, true>(
    'Problem',
    'POST',
    `${endpoint}/problem/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ProblemCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ProblemCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Problem, Prisma.ProblemGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ProblemCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Problem, Prisma.ProblemGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyProblem(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ProblemCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ProblemCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Problem', 'POST', `${endpoint}/problem/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ProblemCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ProblemCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ProblemCreateManyArgs>
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

export function useFindManyProblem<
  TArgs extends Prisma.ProblemFindManyArgs,
  TQueryFnData = Array<Prisma.ProblemGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ProblemFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyProblem<
  TArgs extends Prisma.ProblemFindManyArgs,
  TQueryFnData = Array<Prisma.ProblemGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ProblemFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyProblem<
  TArgs extends Prisma.ProblemFindManyArgs,
  TQueryFnData = Array<Prisma.ProblemGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ProblemFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyProblem<
  TArgs extends Prisma.ProblemFindManyArgs,
  TQueryFnData = Array<Prisma.ProblemGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ProblemFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueProblem<
  TArgs extends Prisma.ProblemFindUniqueArgs,
  TQueryFnData = Prisma.ProblemGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ProblemFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueProblem<
  TArgs extends Prisma.ProblemFindUniqueArgs,
  TQueryFnData = Prisma.ProblemGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ProblemFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstProblem<
  TArgs extends Prisma.ProblemFindFirstArgs,
  TQueryFnData = Prisma.ProblemGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ProblemFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstProblem<
  TArgs extends Prisma.ProblemFindFirstArgs,
  TQueryFnData = Prisma.ProblemGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ProblemFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateProblem(
  options?: Omit<
    UseMutationOptions<Problem | undefined, DefaultError, Prisma.ProblemUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ProblemUpdateArgs, DefaultError, Problem, true>(
    'Problem',
    'PUT',
    `${endpoint}/problem/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ProblemUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.ProblemUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Problem, Prisma.ProblemGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ProblemUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Problem, Prisma.ProblemGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyProblem(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ProblemUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ProblemUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Problem', 'PUT', `${endpoint}/problem/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ProblemUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ProblemUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ProblemUpdateManyArgs>
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

export function useUpsertProblem(
  options?: Omit<
    UseMutationOptions<Problem | undefined, DefaultError, Prisma.ProblemUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ProblemUpsertArgs, DefaultError, Problem, true>(
    'Problem',
    'POST',
    `${endpoint}/problem/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ProblemUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.ProblemUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Problem, Prisma.ProblemGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ProblemUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Problem, Prisma.ProblemGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteProblem(
  options?: Omit<
    UseMutationOptions<Problem | undefined, DefaultError, Prisma.ProblemDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.ProblemDeleteArgs, DefaultError, Problem, true>(
    'Problem',
    'DELETE',
    `${endpoint}/problem/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ProblemDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.ProblemDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Problem, Prisma.ProblemGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ProblemDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Problem, Prisma.ProblemGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyProblem(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.ProblemDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.ProblemDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Problem', 'DELETE', `${endpoint}/problem/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.ProblemDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.ProblemDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.ProblemDeleteManyArgs>
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

export function useAggregateProblem<
  TArgs extends Prisma.ProblemAggregateArgs,
  TQueryFnData = Prisma.GetProblemAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ProblemAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateProblem<
  TArgs extends Prisma.ProblemAggregateArgs,
  TQueryFnData = Prisma.GetProblemAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.ProblemAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByProblem<
  TArgs extends Prisma.ProblemGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ProblemGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ProblemGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ProblemGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ProblemGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ProblemGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ProblemGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ProblemGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByProblem<
  TArgs extends Prisma.ProblemGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.ProblemGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.ProblemGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.ProblemGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.ProblemGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.ProblemGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.ProblemGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.ProblemGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountProblem<
  TArgs extends Prisma.ProblemCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ProblemCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ProblemCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountProblem<
  TArgs extends Prisma.ProblemCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.ProblemCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.ProblemCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Problem',
    `${endpoint}/problem/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckProblem<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      id?: number;
      name?: string;
      memoryLimit?: number;
      outputLimit?: number;
      statementFileName?: string;
      runScriptId?: number;
      checkScriptId?: number;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'Problem',
    `${endpoint}/problem/check`,
    args,
    options,
    fetch,
  );
}
