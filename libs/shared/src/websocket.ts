export type WebSocketEvent =
  | 'contests'
  | 'scoreboard'
  | 'submissions'
  | 'judgings'
  | 'judgingRuns'
  | 'clarifications'
  | `judgeHost-${string}-logs`;
