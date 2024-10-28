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

import type { Prisma, Testcase } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateTestcase(
  options?: Omit<
    UseMutationOptions<Testcase | undefined, DefaultError, Prisma.TestcaseCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.TestcaseCreateArgs, DefaultError, Testcase, true>(
    'Testcase',
    'POST',
    `${endpoint}/testcase/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TestcaseCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.TestcaseCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Testcase, Prisma.TestcaseGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TestcaseCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Testcase, Prisma.TestcaseGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyTestcase(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.TestcaseCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TestcaseCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Testcase', 'POST', `${endpoint}/testcase/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TestcaseCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.TestcaseCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TestcaseCreateManyArgs>
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

export function useFindManyTestcase<
  TArgs extends Prisma.TestcaseFindManyArgs,
  TQueryFnData = Array<Prisma.TestcaseGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TestcaseFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyTestcase<
  TArgs extends Prisma.TestcaseFindManyArgs,
  TQueryFnData = Array<Prisma.TestcaseGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TestcaseFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyTestcase<
  TArgs extends Prisma.TestcaseFindManyArgs,
  TQueryFnData = Array<Prisma.TestcaseGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TestcaseFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyTestcase<
  TArgs extends Prisma.TestcaseFindManyArgs,
  TQueryFnData = Array<Prisma.TestcaseGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TestcaseFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueTestcase<
  TArgs extends Prisma.TestcaseFindUniqueArgs,
  TQueryFnData = Prisma.TestcaseGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TestcaseFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueTestcase<
  TArgs extends Prisma.TestcaseFindUniqueArgs,
  TQueryFnData = Prisma.TestcaseGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TestcaseFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstTestcase<
  TArgs extends Prisma.TestcaseFindFirstArgs,
  TQueryFnData = Prisma.TestcaseGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TestcaseFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstTestcase<
  TArgs extends Prisma.TestcaseFindFirstArgs,
  TQueryFnData = Prisma.TestcaseGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TestcaseFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateTestcase(
  options?: Omit<
    UseMutationOptions<Testcase | undefined, DefaultError, Prisma.TestcaseUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.TestcaseUpdateArgs, DefaultError, Testcase, true>(
    'Testcase',
    'PUT',
    `${endpoint}/testcase/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TestcaseUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.TestcaseUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Testcase, Prisma.TestcaseGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TestcaseUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Testcase, Prisma.TestcaseGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyTestcase(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.TestcaseUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TestcaseUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Testcase', 'PUT', `${endpoint}/testcase/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TestcaseUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.TestcaseUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TestcaseUpdateManyArgs>
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

export function useUpsertTestcase(
  options?: Omit<
    UseMutationOptions<Testcase | undefined, DefaultError, Prisma.TestcaseUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.TestcaseUpsertArgs, DefaultError, Testcase, true>(
    'Testcase',
    'POST',
    `${endpoint}/testcase/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TestcaseUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.TestcaseUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Testcase, Prisma.TestcaseGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TestcaseUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Testcase, Prisma.TestcaseGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteTestcase(
  options?: Omit<
    UseMutationOptions<Testcase | undefined, DefaultError, Prisma.TestcaseDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.TestcaseDeleteArgs, DefaultError, Testcase, true>(
    'Testcase',
    'DELETE',
    `${endpoint}/testcase/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TestcaseDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.TestcaseDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Testcase, Prisma.TestcaseGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TestcaseDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Testcase, Prisma.TestcaseGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyTestcase(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.TestcaseDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.TestcaseDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Testcase', 'DELETE', `${endpoint}/testcase/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.TestcaseDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.TestcaseDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.TestcaseDeleteManyArgs>
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

export function useAggregateTestcase<
  TArgs extends Prisma.TestcaseAggregateArgs,
  TQueryFnData = Prisma.GetTestcaseAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TestcaseAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateTestcase<
  TArgs extends Prisma.TestcaseAggregateArgs,
  TQueryFnData = Prisma.GetTestcaseAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.TestcaseAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByTestcase<
  TArgs extends Prisma.TestcaseGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.TestcaseGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.TestcaseGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.TestcaseGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.TestcaseGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.TestcaseGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.TestcaseGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.TestcaseGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByTestcase<
  TArgs extends Prisma.TestcaseGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.TestcaseGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.TestcaseGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.TestcaseGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.TestcaseGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.TestcaseGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.TestcaseGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.TestcaseGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountTestcase<
  TArgs extends Prisma.TestcaseCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.TestcaseCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TestcaseCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountTestcase<
  TArgs extends Prisma.TestcaseCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.TestcaseCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.TestcaseCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Testcase',
    `${endpoint}/testcase/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckTestcase<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      id?: number;
      description?: string;
      rank?: number;
      sample?: boolean;
      deleted?: boolean;
      inputFileName?: string;
      outputFileName?: string;
      problemId?: number;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'Testcase',
    `${endpoint}/testcase/check`,
    args,
    options,
    fetch,
  );
}
