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
    private readonly executor: Executor
  ) {
    this.logger = new JudgeLogger(JudgingService.name, getOnLog(this.socketService));
    this.run();
  }

  run(): void {
    this.socketService.onNewSubmission(async () => {
      if (!this.lock) {
        this.lock = true;
        try {
          const judging = await this.systemService.getNextJudging();
          if (judging) await this.runJudging(judging);
        } catch (error: any) {
          this.logger.error(error.message, error.trace);
        } finally {
          this.lock = false;
        }
      }
    });
  }

  async runJudging(judging: Judging): Promise<void> {
    try {
      this.logger.log(
        `Judging '${judging.id}' for problem '${judging.submission.problem.name}' and language '${judging.submission.language.name}' received!`
      );
      this.submissionHelper.setSubmission(judging.submission);
      await this.initializer.run(judging);
      const compilationSucceeded = await this.compiler.run(judging);
      compilationSucceeded && (await this.executor.run(judging));
    } catch (error: any) {
      this.logger.error(error.message, error.trace);
      await this.systemService.setJudgingResult(judging, 'SE', error.message);
    }
  }

  @Interval(1000)
  ping(): void {
    this.socketService.ping();
  }
}
