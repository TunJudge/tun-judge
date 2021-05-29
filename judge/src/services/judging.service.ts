import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import config from '../config';
import { SubmissionHelper } from '../helpers';
import http from '../http/http.client';
import { Compiler, Executor, Initializer } from '../judging-steps';
import { getOnLog, JudgeLogger } from '../logger';
import { Judging } from '../models';
import { SocketService } from './socket.service';

@Injectable()
export class JudgingService {
  private readonly logger: JudgeLogger;
  private lock = false;

  constructor(
    private readonly socketService: SocketService,
    private readonly submissionHelper: SubmissionHelper,
    @Inject(forwardRef(() => Initializer))
    private readonly initializer: Initializer,
    @Inject(forwardRef(() => Compiler))
    private readonly compiler: Compiler,
    @Inject(forwardRef(() => Executor))
    private readonly executor: Executor,
  ) {
    this.logger = new JudgeLogger(
      JudgingService.name,
      getOnLog(this.socketService),
    );
  }

  @Interval(1000)
  async run(): Promise<void> {
    if (!this.lock) {
      this.lock = true;
      try {
        const judging = await http.get<Judging>(
          `api/judge-hosts/${config.hostname}/next-judging`,
        );
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
    this.submissionHelper.setSubmission(judging.submission);
    await this.initializer.run(judging);
    await this.compiler.run(judging);
    await this.executor.run(judging);
  }
}
