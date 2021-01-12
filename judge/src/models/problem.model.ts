import { Testcase } from './testcase.model';
import { File } from './file.model';

export interface Problem {
  id: number;
  externalId: string;
  name: string;
  timeLimit: number;
  memoryLimit: number;
  outputLimit: number;
  file: File;
  specialCompareArgs: string;
  testcases: Testcase[];
}
