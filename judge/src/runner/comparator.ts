import { AbstractRunnerStep } from './runner-step';
import { Submission } from '../models';

export class Comparator extends AbstractRunnerStep {
  async run(submission: Submission): Promise<string> {
    return 'Compared ' + (await super.run(submission));
  }
}
