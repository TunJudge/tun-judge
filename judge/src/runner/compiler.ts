import { AbstractRunnerStep } from './runner-step';
import { Submission } from '../models';
import { Logger } from '@nestjs/common';

export class Compiler extends AbstractRunnerStep {
  async run(submission: Submission): Promise<string> {
    logger.log(`[Submission] Submission with id ${submission.id} compiled!`);
    return 'Compiled ' + (await super.run(submission));
  }
}

const logger = new Logger(Compiler.name);
