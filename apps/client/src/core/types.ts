import React from 'react';

import { CodeEditorLanguages } from '@shared/CodeEditor';

import { JudgingResult } from './models';

export type Tabs = {
  key: string;
  title: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
  label?: React.ReactNode;
}[];

export const resultMap: Record<JudgingResult | 'PD', string> = {
  AC: 'Accepted',
  WA: 'Wrong Answer',
  TLE: 'Time Limit Exceeded',
  MLE: 'Memory Limit Exceeded',
  RE: 'Runtime Error',
  CE: 'Compile Error',
  SE: 'System Error',
  PD: 'Pending',
};

export const languageMap: Record<string, CodeEditorLanguages> = {
  Text: 'text',
  C: 'c_cpp',
  'C++': 'c_cpp',
  'C#': 'csharp',
  Java: 'java',
  Kotlin: 'kotlin',
  Scala: 'scala',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  'Python 2': 'python',
  'Python 3': 'python',
};
