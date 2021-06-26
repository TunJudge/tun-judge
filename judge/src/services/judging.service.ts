import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { SubmissionHelper } from '../helpers';
import { Compiler, Executor, Initializer } from '../judging-steps';
import { getOnLog, JudgeLogger } from '../logger';
import { Judging } from '../models';
import { SocketService } from './socket.service';
import { SystemService } from './system.service';

@Injectable()
export class JudgingService {
  private readonly logger: JudgeLogger;
  private lock = false;

  constructor(
    private readonly socketService: SocketService,
    private readonly submissionHelper: SubmissionHelper,
    private readonly systemService: SystemService,
    @Inject(forwardRef(() => Initializer))
    private readonly initializer: Initializer,
    @Inject(forwardRef(() => Compiler))
    private readonly compiler: Compiler,
    @Inject(forwardRef(() => Executor))
    private readonly executor: Executor,
  ) {
    this.logger = new JudgeLogger(JudgingService.name, getOnLog(this.socketService));
    setInterval(() => this.logger.verbose('test'), 1000);
  }

  @Interval(1000)
  async run(): Promise<void> {
    if (!this.lock) {
      this.lock = true;
      try {
        const judging = await this.systemService.getNextJudging();
        if (judging) {
          this.logger.log(
            `Judging '${judging.id}' for problem '${judging.submission.problem.name}' and language '${judging.submission.language.name}' received!`,
          );
          await this.runJudging(judging);
        }
      } catch (e) {
        this.logger.error(e.message);
      } finally {
        this.lock = false;
      }
    }
  }

  async runJudging(judging: Judging): Promise<void> {
    try {
      this.submissionHelper.setSubmission(judging.submission);
      await this.initializer.run(judging);
      await this.compiler.run(judging);
      await this.executor.run(judging);
    } catch (e) {
      await this.systemService.setJudgingResult(judging, 'SE', e.message);
      this.logger.error(e.message, e.trace);
    }
  }
}
