import { Judging } from '../models';
import { Compiler } from './compiler';
import { Executor } from './executor';
import { Initializer } from './initializer';
import { RunnerStep } from './runner-step';
import submissionHelper from './submission-helper';

/**
 * The Runner is the chain of all the steps to run the submission.
 */
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
