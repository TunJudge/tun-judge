import submissionHelper from './submission-helper';
import { RunnerStep } from './runner-step';
import { Initializer } from './initializer';
import { Compiler } from './compiler';
import { Executor } from './executor';
import { Judging } from '../models';

export class Runner {
  private step: RunnerStep;
  constructor() {
    this.step = new Initializer();
    this.step.setNext(new Compiler()).setNext(new Executor());
  }

  run = (judging: Judging): Promise<void> => {
    submissionHelper.setSubmission(judging.submission);
    return this.step.run(judging);
  };
}

const runner = new Runner();

export default runner;
