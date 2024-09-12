import { FileContent } from './file-content.model';

export interface File {
  id: number;
  name: string;
  type: string;
  size: number;
  md5Sum: string;
  content: FileContent;
}
