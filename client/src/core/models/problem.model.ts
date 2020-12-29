export interface Problem {
  id: number;
  externalId: string;
  name: string;
  timeLimit: number;
  memoryLimit: number;
  outputLimit: number;
  problemText: string;
  problemTextType: string;
  specialCompareArgs: string;
}
