import { Injectable } from '@nestjs/common';

import { JudgeHost, JudgingResult, JudgingRun } from '@prisma/client';

import config from '../config';
import { Judging, Submission } from '../models';
import { prisma } from './prisma.service';

@Injectable()
export class SystemService {
  async getNextJudging(): Promise<Judging> {
    const judgeHost = await prisma.judgeHost.findFirst({ where: { hostname: config.hostname } });

    if (!judgeHost?.active) return;

    const submission = await this.getNextSubmission();

    if (!submission) return;

    const judging = await this.getOrCreateSubmissionJudging(submission, judgeHost);

    await prisma.submission.update({
      where: { id: submission.id },
      data: { judgeHostId: judgeHost.id },
    });

    return {
      ...judging,
      judgeHost,
      submission,
    };
  }

  getNextSubmission() {
    return prisma.submission.findFirst({
      where: {
        judgeHostId: null,
        contest: { enabled: true },
        problem: { allowJudge: true },
        language: { allowJudge: true },
      },
      include: {
        problem: {
          include: {
            problem: {
              include: {
                runScript: {
                  include: { sourceFile: true, buildScript: true },
                },
                checkScript: {
                  include: { sourceFile: true, buildScript: true },
                },
                testcases: {
                  include: {
                    inputFile: true,
                    outputFile: true,
                  },
                },
              },
            },
          },
        },
        language: {
          include: {
            buildScript: true,
          },
        },
      },
    });
  }

  async getOrCreateSubmissionJudging(submission: Submission, judgeHost: JudgeHost) {
    return (
      (await prisma.judging.findFirst({
        where: {
          submissionId: submission.id,
          endTime: null,
        },
      })) ??
      prisma.judging.create({
        data: {
          startTime: new Date(),
          contestId: submission.contestId,
          judgeHostId: judgeHost.id,
          submissionId: submission.id,
        },
      })
    );
  }

  setJudgingResult(judging: Judging, result: JudgingResult, errorMessage?: string) {
    return prisma.judging.update({
      where: { id: judging.id },
      data: {
        endTime: new Date(),
        result: result,
        systemError: errorMessage,
      },
    });
  }

  addJudgingRun(judging: Judging, judgingRun: JudgingRun) {
    return prisma.judgingRun.create({ data: { ...judgingRun, judgingId: judging.id } });
  }
}
