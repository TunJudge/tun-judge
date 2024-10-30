import { JudgingRunResult } from '@prisma/client';

import { Problem } from '../models';

export * from './download-file';
export * from './fix-error';
export * from './spinner';
export * from './submission-helper';
export * from './super-json';

export type GuardOutput = {
  usedTime: number;
  usedMemory: number;
  exitCode: number;
};

export function getResult(guardOutput: GuardOutput, problem: Problem): JudgingRunResult {
  if (!guardOutput.exitCode) return 'ACCEPTED';
  if (guardOutput.usedTime >= problem.timeLimit * 1000) return 'TIME_LIMIT_EXCEEDED';
  if (guardOutput.usedMemory >= problem.memoryLimit) return 'MEMORY_LIMIT_EXCEEDED';
  return 'RUNTIME_ERROR';
}
