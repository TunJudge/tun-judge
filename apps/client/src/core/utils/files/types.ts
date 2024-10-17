import { FileKind } from '@prisma/client';

export type FileUpdateStatus = { metadata: FileInput; file: File } & (
  | { status: 'new' }
  | { status: 'moving' }
  | { status: 'deleting' }
  | { status: 'duplicated' }
  | { status: 'uploading'; progress: number }
  | { status: 'failed'; error: string }
  | { status: 'done' }
);

export type FileInput = {
  name: string;
  type: string;
  size: number;
  md5Sum: string;
  kind: FileKind;
  parentDirectoryName?: string;
};
