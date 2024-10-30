import { JudgingResult } from '@prisma/client';

import { CodeEditorLanguages } from './components';

export const JUDGING_RESULT_LABELS: Record<JudgingResult | 'PENDING', string> = {
  ACCEPTED: 'Accepted',
  WRONG_ANSWER: 'Wrong Answer',
  TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
  MEMORY_LIMIT_EXCEEDED: 'Memory Limit Exceeded',
  RUNTIME_ERROR: 'Runtime Error',
  COMPILATION_ERROR: 'Compile Error',
  SYSTEM_ERROR: 'System Error',
  PENDING: 'Pending',
};

export const LANGUAGES_MAP: Record<string, CodeEditorLanguages> = {
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
