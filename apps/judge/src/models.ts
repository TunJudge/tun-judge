import { Prisma } from '@prisma/client';

export type Judging = Prisma.JudgingGetPayload<{
  include: {
    submission: {
      include: {
        problem: {
          include: {
            problem: {
              include: {
                runScript: {
                  include: { sourceFile: true; buildScript: true };
                };
                checkScript: {
                  include: { sourceFile: true; buildScript: true };
                };
                testcases: {
                  include: {
                    inputFile: true;
                    outputFile: true;
                  };
                };
              };
            };
          };
        };
        language: {
          include: {
            buildScript: true;
          };
        };
      };
    };
    judgeHost: true;
  };
}>;

export type Submission = Judging['submission'];

export type Language = Submission['language'];

export type Problem = Submission['problem']['problem'];

export type Executable = Problem['runScript'];

export type Testcase = Problem['testcases'][0];
