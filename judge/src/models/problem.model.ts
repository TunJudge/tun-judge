import { Testcase } from './testcase.model';
import { File } from './file.model';
import { Executable } from './executable.model';

export interface Problem {
  id: number;
  externalId: string;
  name: string;
  timeLimit: number;
  memoryLimit: number;
  outputLimit: number;
  file: File;
  runScript: Executable;
  checkScript: Executable;
  testcases: Testcase[];
}
