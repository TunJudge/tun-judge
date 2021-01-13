import { Submission } from '../models';

export interface RunnerStep {
  setNext(runnerStep: RunnerStep): RunnerStep;

  run(submission: Submission): Promise<void>;
}

export abstract class AbstractRunnerStep implements RunnerStep {
  private nextStep: RunnerStep;

  setNext(runnerStep: RunnerStep): RunnerStep {
    this.nextStep = runnerStep;
    return this.nextStep;
  }

  async run(submission: Submission): Promise<void> {
    this.nextStep && (await this.nextStep.run(submission));
  }
}
