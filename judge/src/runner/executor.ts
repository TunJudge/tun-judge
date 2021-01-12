import { AbstractRunnerStep } from './runner-step';
import { Submission } from '../models';

export class Executor extends AbstractRunnerStep {
  async run(submission: Submission): Promise<string> {
    return 'Executed ' + (await super.run(submission));
  }
}
