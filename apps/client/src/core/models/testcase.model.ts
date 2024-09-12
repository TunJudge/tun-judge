import { File } from './file.model';
import { Problem } from './problem.model';

export interface Testcase {
  id: number;
  input: File;
  output: File;
  description: string;
  rank: number;
  sample: boolean;
  deleted: boolean;
  problem: Problem;
}
