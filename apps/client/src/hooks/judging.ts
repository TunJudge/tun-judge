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

import type { Judging, Prisma } from '@prisma/client';
import type { JudgingResult } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateJudging(
  options?: Omit<
    UseMutationOptions<Judging | undefined, DefaultError, Prisma.JudgingCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgingCreateArgs, DefaultError, Judging, true>(
    'Judging',
    'POST',
    `${endpoint}/judging/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Judging, Prisma.JudgingGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Judging, Prisma.JudgingGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyJudging(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.JudgingCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.JudgingCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Judging', 'POST', `${endpoint}/judging/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingCreateManyArgs>
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

export function useFindManyJudging<
  TArgs extends Prisma.JudgingFindManyArgs,
  TQueryFnData = Array<Prisma.JudgingGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyJudging<
  TArgs extends Prisma.JudgingFindManyArgs,
  TQueryFnData = Array<Prisma.JudgingGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyJudging<
  TArgs extends Prisma.JudgingFindManyArgs,
  TQueryFnData = Array<Prisma.JudgingGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyJudging<
  TArgs extends Prisma.JudgingFindManyArgs,
  TQueryFnData = Array<Prisma.JudgingGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueJudging<
  TArgs extends Prisma.JudgingFindUniqueArgs,
  TQueryFnData = Prisma.JudgingGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgingFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueJudging<
  TArgs extends Prisma.JudgingFindUniqueArgs,
  TQueryFnData = Prisma.JudgingGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgingFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstJudging<
  TArgs extends Prisma.JudgingFindFirstArgs,
  TQueryFnData = Prisma.JudgingGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstJudging<
  TArgs extends Prisma.JudgingFindFirstArgs,
  TQueryFnData = Prisma.JudgingGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateJudging(
  options?: Omit<
    UseMutationOptions<Judging | undefined, DefaultError, Prisma.JudgingUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgingUpdateArgs, DefaultError, Judging, true>(
    'Judging',
    'PUT',
    `${endpoint}/judging/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Judging, Prisma.JudgingGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Judging, Prisma.JudgingGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyJudging(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.JudgingUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.JudgingUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Judging', 'PUT', `${endpoint}/judging/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingUpdateManyArgs>
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

export function useUpsertJudging(
  options?: Omit<
    UseMutationOptions<Judging | undefined, DefaultError, Prisma.JudgingUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgingUpsertArgs, DefaultError, Judging, true>(
    'Judging',
    'POST',
    `${endpoint}/judging/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Judging, Prisma.JudgingGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Judging, Prisma.JudgingGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteJudging(
  options?: Omit<
    UseMutationOptions<Judging | undefined, DefaultError, Prisma.JudgingDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.JudgingDeleteArgs, DefaultError, Judging, true>(
    'Judging',
    'DELETE',
    `${endpoint}/judging/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Judging, Prisma.JudgingGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Judging, Prisma.JudgingGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyJudging(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.JudgingDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.JudgingDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Judging', 'DELETE', `${endpoint}/judging/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.JudgingDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.JudgingDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.JudgingDeleteManyArgs>
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

export function useAggregateJudging<
  TArgs extends Prisma.JudgingAggregateArgs,
  TQueryFnData = Prisma.GetJudgingAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgingAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateJudging<
  TArgs extends Prisma.JudgingAggregateArgs,
  TQueryFnData = Prisma.GetJudgingAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.JudgingAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByJudging<
  TArgs extends Prisma.JudgingGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.JudgingGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.JudgingGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.JudgingGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.JudgingGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.JudgingGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.JudgingGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.JudgingGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByJudging<
  TArgs extends Prisma.JudgingGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.JudgingGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.JudgingGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.JudgingGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.JudgingGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.JudgingGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.JudgingGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.JudgingGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountJudging<
  TArgs extends Prisma.JudgingCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.JudgingCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountJudging<
  TArgs extends Prisma.JudgingCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.JudgingCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.JudgingCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Judging',
    `${endpoint}/judging/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckJudging<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      id?: number;
      result?: JudgingResult;
      systemError?: string;
      verified?: boolean;
      verifyComment?: string;
      valid?: boolean;
      compileOutputFileName?: string;
      submissionId?: number;
      juryMemberId?: number;
      contestId?: number;
      judgeHostId?: number;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'Judging',
    `${endpoint}/judging/check`,
    args,
    options,
    fetch,
  );
}
