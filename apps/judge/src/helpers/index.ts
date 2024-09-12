import { JudgingRunResult, Problem } from '../models';

export * from './spinner';
export * from './submission-helper';

export type GuardOutput = {
  usedTime: number;
  usedMemory: number;
  exitCode: number;
};

export function getResult(guardOutput: GuardOutput, problem: Problem): JudgingRunResult {
  if (!guardOutput.exitCode) return 'AC';
  if (guardOutput.usedTime >= problem.timeLimit * 1000) return 'TLE';
  if (guardOutput.usedMemory >= problem.memoryLimit) return 'MLE';
  return 'RE';
}
