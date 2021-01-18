import { SemanticICONS } from 'semantic-ui-react';

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

export const languageMap: Record<
  string,
  'text' | 'sh' | 'c_cpp' | 'java' | 'javascript' | 'python'
> = {
  Text: 'text',
  C: 'c_cpp',
  'C++': 'c_cpp',
  Java: 'java',
  JavaScript: 'javascript',
  Python: 'python',
};
