import { Judging } from './judging.model';
import { Testcase } from './testcase.model';
import { File } from './file.model';

export interface JudgingRun {
  id: number;
  result: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE';
  endTime: Date;
  runTime: number;
  runMemory: number;
  judging: Judging;
  testcase: Testcase;
  runOutput: File;
  errorOutput: File;
  checkerOutput: File;
}
