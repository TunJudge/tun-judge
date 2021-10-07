import { Executable } from './executable.model';
import { File } from './file.model';
import { Testcase } from './testcase.model';

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
