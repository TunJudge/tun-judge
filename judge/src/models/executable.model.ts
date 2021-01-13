import { File } from './file.model';

export type ExecutableType = 'RUNNER' | 'CHECKER';

export interface Executable {
  id: number;
  name: string;
  description: string;
  default: boolean;
  dockerImage: string;
  file: File;
  buildScript: File;
  type: ExecutableType;
}
