import submissionHelper from './submission-helper';
import { RunnerStep } from './runner-step';
import { Initializer } from './initializer';
import { Compiler } from './compiler';
import { Executor } from './executor';
import { Submission } from '../models';

export class Runner {
  private step: RunnerStep;
  constructor() {
    this.step = new Initializer();
    this.step.setNext(new Compiler()).setNext(new Executor());
  }

  run = (submission: Submission): Promise<void> => {
    submissionHelper.setSubmission(submission);
    return this.step.run(submission);
  };
}

const runner = new Runner();

export default runner;
