import { Judging } from './judging.model';
import { Testcase } from './testcase.model';
import { File } from './file.model';

export interface JudgingRun {
  id: number;
  result: string;
  endTime: Date;
  runTime: number;
  judging: Judging;
  testcase: Testcase;
  runOutput: File;
  errorOutput: File;
  checkerOutput: File;
}
