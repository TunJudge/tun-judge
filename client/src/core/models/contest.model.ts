import { Problem } from './problem.model';

export interface Contest {
  id: number;
  externalId: string;
  name: string;
  shortName: string;
  activateTime: Date;
  startTime: Date;
  freezeTime: Date;
  endTime: Date;
  unfreezeTime: Date;
  finalizeTime: Date;
  finalizeComment: string;
  extraBronzeMedals: number;
  enabled: boolean;
  processBalloons: boolean;
  public: boolean;
  problems: Problem[];
}
