import { File } from './file.model';

export type ExecutableType = 'RUNNER' | 'CHECKER';

export interface Executable {
  id: number;
  name: string;
  description: string;
  default: boolean;
  dockerImage: string;
  sourceFile: File;
  buildScript: File;
  type: ExecutableType;
}
