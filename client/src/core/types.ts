import { SemanticICONS } from 'semantic-ui-react';
import { CodeEditorLanguages } from '../pages/shared/CodeEditor';

export type Tabs = {
  key: string;
  title: string;
  icon: SemanticICONS;
}[];

export const resultMap = {
  AC: 'Accepted',
  WA: 'Wrong Answer',
  TLE: 'Time Limit Exceeded',
  MLE: 'Memory Limit Exceeded',
  RE: 'Runtime Error',
  CE: 'Compile Error',
  PD: 'Pending',
};

export const languageMap: Record<string, CodeEditorLanguages> = {
  Text: 'text',
  C: 'c_cpp',
  'C++': 'c_cpp',
  Java: 'java',
  Kotlin: 'kotlin',
  Scala: 'scala',
  JavaScript: 'javascript',
  Python: 'python',
};
