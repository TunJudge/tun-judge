import { Submission } from '../models';

export interface RunnerStep {
  setNext(runnerStep: RunnerStep): RunnerStep;

  run(submission: Submission): Promise<string>;
}

export abstract class AbstractRunnerStep implements RunnerStep {
  private nextStep: RunnerStep;

  setNext(runnerStep: RunnerStep): RunnerStep {
    this.nextStep = runnerStep;
    return this.nextStep;
  }

  run(submission: Submission): Promise<string> {
    if (this.nextStep) {
      return this.nextStep.run(submission);
    }
    return null;
  }
}
