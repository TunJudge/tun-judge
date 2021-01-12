import { RunnerStep } from './runner-step';
import { Initializer } from './initializer';
import { Compiler } from './compiler';
import { Executor } from './executor';
import { Comparator } from './comparator';
import { Submission } from '../models';

export class Runner {
  private step: RunnerStep;
  constructor() {
    this.step = new Initializer();
    this.step
      .setNext(new Compiler())
      .setNext(new Executor())
      .setNext(new Comparator());
  }

  run = (submission: Submission): Promise<string> => this.step.run(submission);
}

const runner = new Runner();

export default runner;
