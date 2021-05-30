import { Injectable } from '@nestjs/common';
import config from '../config';
import http from '../http/http.client';
import { FileContent, Judging, JudgingResult, JudgingRun } from '../models';

@Injectable()
export class SystemService {
  getNextJudging(): Promise<Judging> {
    return http.get<Judging>(`api/judge-hosts/${config.hostname}/next-judging`);
  }

  getTestcaseFileContent(testcaseId: number, type: 'input' | 'output'): Promise<FileContent> {
    return http.get<FileContent>(`api/testcases/${testcaseId}/content/${type}`);
  }

  setJudgingResult(judging: Judging, result: JudgingResult, errorMessage?: string): Promise<void> {
    judging.endTime = new Date();
    judging.result = result;
    judging.systemError = errorMessage;
    return this.updateJudging(judging);
  }

  updateJudging(judging: Judging): Promise<void> {
    return http.put(
      `api/judge-hosts/${judging.judgeHost.hostname}/update-judging/${judging.id}`,
      judging,
    );
  }

  addJudgingRun(judging: Judging, judgingRun: Partial<JudgingRun>): Promise<void> {
    return http.post(
      `api/judge-hosts/${judging.judgeHost.hostname}/add-judging-run/${judging.id}`,
      judgingRun,
    );
  }
}
