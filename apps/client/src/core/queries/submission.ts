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

import type { Prisma, Submission } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateSubmission(
  options?: Omit<
    UseMutationOptions<Submission | undefined, DefaultError, Prisma.SubmissionCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.SubmissionCreateArgs, DefaultError, Submission, true>(
    'Submission',
    'POST',
    `${endpoint}/submission/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.SubmissionCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.SubmissionCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Submission, Prisma.SubmissionGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.SubmissionCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Submission, Prisma.SubmissionGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManySubmission(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SubmissionCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.SubmissionCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Submission', 'POST', `${endpoint}/submission/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.SubmissionCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.SubmissionCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.SubmissionCreateManyArgs>
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

export function useFindManySubmission<
  TArgs extends Prisma.SubmissionFindManyArgs,
  TQueryFnData = Array<Prisma.SubmissionGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.SubmissionFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManySubmission<
  TArgs extends Prisma.SubmissionFindManyArgs,
  TQueryFnData = Array<Prisma.SubmissionGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.SubmissionFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManySubmission<
  TArgs extends Prisma.SubmissionFindManyArgs,
  TQueryFnData = Array<Prisma.SubmissionGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.SubmissionFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManySubmission<
  TArgs extends Prisma.SubmissionFindManyArgs,
  TQueryFnData = Array<Prisma.SubmissionGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.SubmissionFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueSubmission<
  TArgs extends Prisma.SubmissionFindUniqueArgs,
  TQueryFnData = Prisma.SubmissionGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.SubmissionFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueSubmission<
  TArgs extends Prisma.SubmissionFindUniqueArgs,
  TQueryFnData = Prisma.SubmissionGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.SubmissionFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstSubmission<
  TArgs extends Prisma.SubmissionFindFirstArgs,
  TQueryFnData = Prisma.SubmissionGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.SubmissionFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstSubmission<
  TArgs extends Prisma.SubmissionFindFirstArgs,
  TQueryFnData = Prisma.SubmissionGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.SubmissionFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateSubmission(
  options?: Omit<
    UseMutationOptions<Submission | undefined, DefaultError, Prisma.SubmissionUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.SubmissionUpdateArgs, DefaultError, Submission, true>(
    'Submission',
    'PUT',
    `${endpoint}/submission/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.SubmissionUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.SubmissionUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Submission, Prisma.SubmissionGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.SubmissionUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Submission, Prisma.SubmissionGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManySubmission(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SubmissionUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.SubmissionUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Submission', 'PUT', `${endpoint}/submission/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.SubmissionUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.SubmissionUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.SubmissionUpdateManyArgs>
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

export function useUpsertSubmission(
  options?: Omit<
    UseMutationOptions<Submission | undefined, DefaultError, Prisma.SubmissionUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.SubmissionUpsertArgs, DefaultError, Submission, true>(
    'Submission',
    'POST',
    `${endpoint}/submission/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.SubmissionUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.SubmissionUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Submission, Prisma.SubmissionGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.SubmissionUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Submission, Prisma.SubmissionGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteSubmission(
  options?: Omit<
    UseMutationOptions<Submission | undefined, DefaultError, Prisma.SubmissionDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.SubmissionDeleteArgs, DefaultError, Submission, true>(
    'Submission',
    'DELETE',
    `${endpoint}/submission/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.SubmissionDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.SubmissionDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Submission, Prisma.SubmissionGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.SubmissionDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Submission, Prisma.SubmissionGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManySubmission(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.SubmissionDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.SubmissionDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Submission', 'DELETE', `${endpoint}/submission/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.SubmissionDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.SubmissionDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.SubmissionDeleteManyArgs>
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

export function useAggregateSubmission<
  TArgs extends Prisma.SubmissionAggregateArgs,
  TQueryFnData = Prisma.GetSubmissionAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.SubmissionAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateSubmission<
  TArgs extends Prisma.SubmissionAggregateArgs,
  TQueryFnData = Prisma.GetSubmissionAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.SubmissionAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupBySubmission<
  TArgs extends Prisma.SubmissionGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.SubmissionGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.SubmissionGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.SubmissionGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.SubmissionGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.SubmissionGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.SubmissionGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.SubmissionGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupBySubmission<
  TArgs extends Prisma.SubmissionGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.SubmissionGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.SubmissionGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.SubmissionGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.SubmissionGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.SubmissionGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.SubmissionGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.SubmissionGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountSubmission<
  TArgs extends Prisma.SubmissionCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.SubmissionCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.SubmissionCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountSubmission<
  TArgs extends Prisma.SubmissionCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.SubmissionCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.SubmissionCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Submission',
    `${endpoint}/submission/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckSubmission<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      id?: number;
      valid?: boolean;
      sourceFileName?: string;
      teamId?: number;
      contestId?: number;
      problemId?: number;
      languageId?: number;
      judgeHostId?: number;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'Submission',
    `${endpoint}/submission/check`,
    args,
    options,
    fetch,
  );
}
