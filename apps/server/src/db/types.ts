import { PrismaClient } from '@prisma/client';

export type PrismaEntity = {
  [Entity in keyof PrismaClient]: Entity extends `$${string}` | symbol ? never : Entity;
}[keyof PrismaClient];

export type PrismaOperation = Exclude<keyof PrismaClient[PrismaEntity], symbol>;

export type PrismaQuery = {
  entity: PrismaEntity;
  operation: PrismaOperation;
  params: unknown;
};
