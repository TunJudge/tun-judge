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

import type { Language, Prisma } from '@prisma/client';

import metadata from './__model_meta';

type DefaultError = QueryError;

export function useCreateLanguage(
  options?: Omit<
    UseMutationOptions<Language | undefined, DefaultError, Prisma.LanguageCreateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.LanguageCreateArgs, DefaultError, Language, true>(
    'Language',
    'POST',
    `${endpoint}/language/create`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.LanguageCreateArgs>(
      args: Prisma.SelectSubset<T, Prisma.LanguageCreateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Language, Prisma.LanguageGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.LanguageCreateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Language, Prisma.LanguageGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useCreateManyLanguage(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.LanguageCreateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.LanguageCreateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Language', 'POST', `${endpoint}/language/createMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.LanguageCreateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.LanguageCreateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.LanguageCreateManyArgs>
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

export function useFindManyLanguage<
  TArgs extends Prisma.LanguageFindManyArgs,
  TQueryFnData = Array<Prisma.LanguageGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.LanguageFindManyArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/findMany`,
    args,
    options,
    fetch,
  );
}

export function useInfiniteFindManyLanguage<
  TArgs extends Prisma.LanguageFindManyArgs,
  TQueryFnData = Array<Prisma.LanguageGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.LanguageFindManyArgs>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindManyLanguage<
  TArgs extends Prisma.LanguageFindManyArgs,
  TQueryFnData = Array<Prisma.LanguageGetPayload<TArgs> & { $optimistic?: boolean }>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.LanguageFindManyArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/findMany`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseInfiniteFindManyLanguage<
  TArgs extends Prisma.LanguageFindManyArgs,
  TQueryFnData = Array<Prisma.LanguageGetPayload<TArgs>>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.LanguageFindManyArgs>,
  options?: Omit<
    UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TData>>,
    'queryKey' | 'initialPageParam'
  >,
) {
  options = options ?? { getNextPageParam: () => null };
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseInfiniteModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/findMany`,
    args,
    options,
    fetch,
  );
}

export function useFindUniqueLanguage<
  TArgs extends Prisma.LanguageFindUniqueArgs,
  TQueryFnData = Prisma.LanguageGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.LanguageFindUniqueArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindUniqueLanguage<
  TArgs extends Prisma.LanguageFindUniqueArgs,
  TQueryFnData = Prisma.LanguageGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.LanguageFindUniqueArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/findUnique`,
    args,
    options,
    fetch,
  );
}

export function useFindFirstLanguage<
  TArgs extends Prisma.LanguageFindFirstArgs,
  TQueryFnData = Prisma.LanguageGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.LanguageFindFirstArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseFindFirstLanguage<
  TArgs extends Prisma.LanguageFindFirstArgs,
  TQueryFnData = Prisma.LanguageGetPayload<TArgs> & { $optimistic?: boolean },
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.LanguageFindFirstArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/findFirst`,
    args,
    options,
    fetch,
  );
}

export function useUpdateLanguage(
  options?: Omit<
    UseMutationOptions<Language | undefined, DefaultError, Prisma.LanguageUpdateArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.LanguageUpdateArgs, DefaultError, Language, true>(
    'Language',
    'PUT',
    `${endpoint}/language/update`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.LanguageUpdateArgs>(
      args: Prisma.SelectSubset<T, Prisma.LanguageUpdateArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Language, Prisma.LanguageGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.LanguageUpdateArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Language, Prisma.LanguageGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useUpdateManyLanguage(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.LanguageUpdateManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.LanguageUpdateManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Language', 'PUT', `${endpoint}/language/updateMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.LanguageUpdateManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.LanguageUpdateManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.LanguageUpdateManyArgs>
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

export function useUpsertLanguage(
  options?: Omit<
    UseMutationOptions<Language | undefined, DefaultError, Prisma.LanguageUpsertArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.LanguageUpsertArgs, DefaultError, Language, true>(
    'Language',
    'POST',
    `${endpoint}/language/upsert`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.LanguageUpsertArgs>(
      args: Prisma.SelectSubset<T, Prisma.LanguageUpsertArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Language, Prisma.LanguageGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.LanguageUpsertArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Language, Prisma.LanguageGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteLanguage(
  options?: Omit<
    UseMutationOptions<Language | undefined, DefaultError, Prisma.LanguageDeleteArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<Prisma.LanguageDeleteArgs, DefaultError, Language, true>(
    'Language',
    'DELETE',
    `${endpoint}/language/delete`,
    metadata,
    options,
    fetch,
    true,
  );
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.LanguageDeleteArgs>(
      args: Prisma.SelectSubset<T, Prisma.LanguageDeleteArgs>,
      options?: Omit<
        UseMutationOptions<
          CheckSelect<T, Language, Prisma.LanguageGetPayload<T>> | undefined,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.LanguageDeleteArgs>
        > &
          ExtraMutationOptions,
        'mutationFn'
      >,
    ) => {
      return (await _mutation.mutateAsync(args, options as any)) as
        | CheckSelect<T, Language, Prisma.LanguageGetPayload<T>>
        | undefined;
    },
  };
  return mutation;
}

export function useDeleteManyLanguage(
  options?: Omit<
    UseMutationOptions<Prisma.BatchPayload, DefaultError, Prisma.LanguageDeleteManyArgs> &
      ExtraMutationOptions,
    'mutationFn'
  >,
) {
  const { endpoint, fetch } = getHooksContext();
  const _mutation = useModelMutation<
    Prisma.LanguageDeleteManyArgs,
    DefaultError,
    Prisma.BatchPayload,
    false
  >('Language', 'DELETE', `${endpoint}/language/deleteMany`, metadata, options, fetch, false);
  const mutation = {
    ..._mutation,
    mutateAsync: async <T extends Prisma.LanguageDeleteManyArgs>(
      args: Prisma.SelectSubset<T, Prisma.LanguageDeleteManyArgs>,
      options?: Omit<
        UseMutationOptions<
          Prisma.BatchPayload,
          DefaultError,
          Prisma.SelectSubset<T, Prisma.LanguageDeleteManyArgs>
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

export function useAggregateLanguage<
  TArgs extends Prisma.LanguageAggregateArgs,
  TQueryFnData = Prisma.GetLanguageAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.LanguageAggregateArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseAggregateLanguage<
  TArgs extends Prisma.LanguageAggregateArgs,
  TQueryFnData = Prisma.GetLanguageAggregateType<TArgs>,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<TArgs, Prisma.LanguageAggregateArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/aggregate`,
    args,
    options,
    fetch,
  );
}

export function useGroupByLanguage<
  TArgs extends Prisma.LanguageGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.LanguageGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.LanguageGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.LanguageGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.LanguageGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.LanguageGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.LanguageGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.LanguageGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseGroupByLanguage<
  TArgs extends Prisma.LanguageGroupByArgs,
  HasSelectOrTake extends Prisma.Or<
    Prisma.Extends<'skip', Prisma.Keys<TArgs>>,
    Prisma.Extends<'take', Prisma.Keys<TArgs>>
  >,
  OrderByArg extends Prisma.True extends HasSelectOrTake
    ? { orderBy: Prisma.LanguageGroupByArgs['orderBy'] }
    : { orderBy?: Prisma.LanguageGroupByArgs['orderBy'] },
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
        PickEnumerable<Prisma.LanguageGroupByOutputType, TArgs['by']> & {
          [P in keyof TArgs & keyof Prisma.LanguageGroupByOutputType]: P extends '_count'
            ? TArgs[P] extends boolean
              ? number
              : Prisma.GetScalarType<TArgs[P], Prisma.LanguageGroupByOutputType[P]>
            : Prisma.GetScalarType<TArgs[P], Prisma.LanguageGroupByOutputType[P]>;
        }
      >
    : InputErrors,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args: Prisma.SelectSubset<
    TArgs,
    Prisma.SubsetIntersection<TArgs, Prisma.LanguageGroupByArgs, OrderByArg> & InputErrors
  >,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/groupBy`,
    args,
    options,
    fetch,
  );
}

export function useCountLanguage<
  TArgs extends Prisma.LanguageCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.LanguageCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.LanguageCountArgs>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/count`,
    args,
    options,
    fetch,
  );
}

export function useSuspenseCountLanguage<
  TArgs extends Prisma.LanguageCountArgs,
  TQueryFnData = TArgs extends { select: any }
    ? TArgs['select'] extends true
      ? number
      : Prisma.GetScalarType<TArgs['select'], Prisma.LanguageCountAggregateOutputType>
    : number,
  TData = TQueryFnData,
  TError = DefaultError,
>(
  args?: Prisma.SelectSubset<TArgs, Prisma.LanguageCountArgs>,
  options?: Omit<UseSuspenseQueryOptions<TQueryFnData, TError, TData>, 'queryKey'> &
    ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useSuspenseModelQuery<TQueryFnData, TData, TError>(
    'Language',
    `${endpoint}/language/count`,
    args,
    options,
    fetch,
  );
}

export function useCheckLanguage<TError = DefaultError>(
  args: {
    operation: PolicyCrudKind;
    where?: {
      id?: number;
      name?: string;
      dockerImage?: string;
      extensions?: string;
      allowSubmit?: boolean;
      allowJudge?: boolean;
      buildScriptName?: string;
    };
  },
  options?: Omit<UseQueryOptions<boolean, TError, boolean>, 'queryKey'> & ExtraQueryOptions,
) {
  const { endpoint, fetch } = getHooksContext();
  return useModelQuery<boolean, boolean, TError>(
    'Language',
    `${endpoint}/language/check`,
    args,
    options,
    fetch,
  );
}
