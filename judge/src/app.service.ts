import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import config from './config';
import http from './http/http.client';
import { Judging } from './models';
import { Runner } from './runner';
import { JudgeLogger } from './services/judge.logger';

@Injectable()
export class AppService {
  private lock = false;
  private logger = new JudgeLogger(AppService.name);
  private runner = new Runner();

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
          await this.runner.run(judging);
        }
      } catch (e) {
        this.logger.error(e.message);
      } finally {
        this.lock = false;
      }
    }
  }
}
