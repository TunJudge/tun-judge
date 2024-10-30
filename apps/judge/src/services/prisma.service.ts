import { serialize } from '@zenstackhq/runtime/browser';

import type { PrismaClient } from '@prisma/client';

import config from '../config';
import { marshal, unmarshal } from '../helpers';
import { fetchCookie } from '../http';

export const prisma = new Proxy({} as PrismaClient, {
  get: (_, entity: string): unknown =>
    new Proxy(
      {},
      {
        get: (_: unknown, operation: string): unknown =>
          async function (params: unknown) {
            let url = `${config.url}/api/rpc/${entity}/${operation}`;
            let method: string;
            let body;

            switch (operation) {
              case 'findMany':
              case 'findUnique':
              case 'findFirst':
              case 'count':
              case 'aggregate':
              case 'groupBy':
                url = makeUrl(url, params);
                method = 'GET';
                break;

              case 'create':
              case 'createMany':
              case 'upsert':
                method = 'POST';
                body = marshal(params);
                break;

              case 'update':
              case 'updateMany':
                method = 'PUT';
                body = marshal(params);
                break;

              case 'delete':
              case 'deleteMany':
                url = makeUrl(url, params);
                method = 'DELETE';
                break;

              default:
                throw new Error(`Unknown operation ${operation}`);
            }

            const res = await fetchCookie(url, {
              method,
              headers: body
                ? {
                    'Content-Type': 'application/json',
                  }
                : undefined,
              body,
              credentials: 'include',
            });

            if (!res.ok) {
              const errData = unmarshal(await res.text());
              if (
                errData.error?.prisma &&
                errData.error?.code === 'P2004' &&
                errData.error?.reason === 'RESULT_NOT_READABLE'
              ) {
                // policy doesn't allow mutation result to be read back, just return undefined
                return undefined as unknown;
              }
              const error: Error & { info?: unknown; status?: number } = new Error(
                'An error occurred while fetching the data.',
              );
              error.info = errData.error;
              error.status = res.status;
              throw error;
            }

            const textResult = await res.text();
            try {
              return unmarshal(textResult).data;
            } catch (err) {
              console.error(`Unable to deserialize data:`, textResult);
              throw err;
            }
          },
      },
    ),
});

function makeUrl(url: string, args: unknown) {
  if (!args) {
    return url;
  }

  const { data, meta } = serialize(args);
  let result = `${url}?q=${encodeURIComponent(JSON.stringify(data))}`;
  if (meta) {
    result += `&meta=${encodeURIComponent(JSON.stringify({ serialization: meta }))}`;
  }
  return result;
}
