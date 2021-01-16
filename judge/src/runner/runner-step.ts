import { Judging } from '../models';

export interface RunnerStep {
  setNext(runnerStep: RunnerStep): RunnerStep;

  run(judging: Judging): Promise<void>;
}

export abstract class AbstractRunnerStep implements RunnerStep {
  private nextStep: RunnerStep;

  setNext(runnerStep: RunnerStep): RunnerStep {
    this.nextStep = runnerStep;
    return this.nextStep;
  }

  async run(judging: Judging): Promise<void> {
    this.nextStep && (await this.nextStep.run(judging));
  }
}
