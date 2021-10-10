import { File } from './file.model';

export interface Language {
  id: number;
  name: string;
  dockerImage: string;
  extensions: string[];
  allowSubmit: boolean;
  allowJudge: boolean;
  buildScript: File;
}
