import { File } from './file.model';
import { Judging } from './judging.model';
import { Testcase } from './testcase.model';

export type JudgingRunResult = 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE';

export interface JudgingRun {
  id: number;
  result: JudgingRunResult;
  endTime: Date;
  runTime: number;
  runMemory: number;
  judging: Judging;
  testcase: Testcase;
  runOutput: File;
  errorOutput: File;
  checkerOutput: File;
}
