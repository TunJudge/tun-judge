import { chmodSync, promises as fs } from 'fs';
import { join } from 'path';
import { AbstractRunnerStep } from './runner-step';
import { Judging } from '../models';
import sh from './submission-helper';
import dockerService from '../services/docker.service';
import { JudgeLogger } from '../services/judge.logger';
import http from '../http/http.client';
import { JudgingRun } from '../models/judging-run.model';
import { MD5 } from 'crypto-js';

type GuardOutput = {
  usedTime: number;
  usedMemory: number;
  exitCode: number;
};

export class Executor extends AbstractRunnerStep {
  async run(judging: Judging): Promise<void> {
    const { submission } = judging;
    const { testcases, runScript } = submission.problem;
    chmodSync(sh.executableFilePath(runScript.id, runScript.file), '0775');
    const runnerContainer = await dockerService.createContainer({
      Image: submission.language.dockerImage,
      name: sh.containerRunName(),
      HostConfig: {
        Memory: submission.problem.memoryLimit * 1024,
      },
    });
    const checkerContainer = await dockerService.createContainer({
      Image: submission.problem.checkScript.dockerImage,
      name: sh.checkerRunName(),
    });
    await runnerContainer.start();
    await checkerContainer.start();
    for (const testcase of testcases.sort((a, b) => a.rank - b.rank)) {
      logger.log(`Running test ${testcase.rank}...`, undefined, false);
      await Promise.all([
        fs.copyFile(
          sh.testcaseFilePath(testcase.id, testcase.input),
          sh.extraFilesPath('test.in'),
        ),
        fs.copyFile(
          sh.testcaseFilePath(testcase.id, testcase.output),
          sh.extraFilesPath('test.ans'),
        ),
      ]);
      await dockerService.execCmdInDocker(runnerContainer, sh.runCmd());
      const guardOutput: GuardOutput = JSON.parse(
        (await fs.readFile(sh.extraFilesPath('guard.json'))).toString(),
      );
      if (guardOutput.exitCode) {
        const errorOutput = (
          await fs.readFile(sh.extraFilesPath('test.out'))
        ).toString();
        const result = getResult(
          guardOutput,
          submission.problem.timeLimit,
          submission.problem.memoryLimit,
        );
        const payload = Buffer.from(errorOutput).toString('base64');
        await http.post(
          `api/judge-hosts/${submission.judgeHost.hostname}/add-judging-run/${judging.id}`,
          {
            judging: { id: judging.id },
            endTime: new Date(),
            testcase: { id: testcase.id },
            result: result,
            runTime: guardOutput.usedTime / 1000,
            errorOutput: {
              name: 'program.err',
              type: 'text/plain',
              size: errorOutput.length,
              md5Sum: MD5(payload).toString(),
              content: {
                payload: payload,
              },
            },
          } as Partial<JudgingRun>,
        );
        await http.put(
          `api/judge-hosts/${submission.judgeHost.hostname}/update-judging/${judging.id}`,
          {
            id: judging.id,
            endTime: new Date(),
            result: result,
          } as Partial<Judging>,
        );
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        logger.error(`Running test ${testcase.rank}...\tNOT OK!`);
        await dockerService.pruneContainer(runnerContainer);
        await dockerService.pruneContainer(checkerContainer);
        return;
      }
      const checkingResult = await dockerService.execCmdInDocker(
        checkerContainer,
        sh.checkerRunCmd(),
      );
      const runningOutput = (
        await fs.readFile(sh.extraFilesPath('test.out'))
      ).toString();
      const runningPayload = Buffer.from(runningOutput).toString('base64');
      const runOutputFile = {
        name: 'program.out',
        type: 'text/plain',
        size: runningOutput.length,
        md5Sum: MD5(runningPayload).toString(),
        content: {
          payload: runningPayload,
        },
      };
      const checkerPayload = Buffer.from(checkingResult.stdout).toString(
        'base64',
      );
      const checkerOutputFile = {
        name: 'checker.out',
        type: 'text/plain',
        size: checkingResult.stdout.length,
        md5Sum: MD5(checkerPayload).toString(),
        content: {
          payload: checkerPayload,
        },
      };
      if (checkingResult.exitCode) {
        await http.post(
          `api/judge-hosts/${submission.judgeHost.hostname}/add-judging-run/${judging.id}`,
          {
            judging: { id: judging.id },
            endTime: new Date(),
            testcase: { id: testcase.id },
            result: 'WA',
            runTime: guardOutput.usedTime / 1000,
            runOutput: runOutputFile,
            checkerOutput: checkerOutputFile,
          } as Partial<JudgingRun>,
        );
        await http.put(
          `api/judge-hosts/${submission.judgeHost.hostname}/update-judging/${judging.id}`,
          {
            id: judging.id,
            endTime: new Date(),
            result: 'WA',
          } as Partial<Judging>,
        );
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        logger.error(`Running test ${testcase.rank}...\tNOT OK!`);
        await dockerService.pruneContainer(runnerContainer);
        await dockerService.pruneContainer(checkerContainer);
        return;
      } else {
        await http.post(
          `api/judge-hosts/${submission.judgeHost.hostname}/add-judging-run/${judging.id}`,
          {
            judging: { id: judging.id },
            endTime: new Date(),
            testcase: { id: testcase.id },
            result: 'AC',
            runTime: guardOutput.usedTime / 1000,
            runOutput: runOutputFile,
            checkerOutput: checkerOutputFile,
          } as Partial<JudgingRun>,
        );
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        logger.log(`Running test ${testcase.rank}...\tOK!`);
        for (const file of ['test.in', 'test.out', 'test.ans', 'guard.json']) {
          await fs.copyFile(
            sh.extraFilesPath(file),
            join(sh.runTestcaseDir(testcase.rank), file),
          );
          await fs.unlink(sh.extraFilesPath(file));
        }
      }
    }
    await http.put(
      `api/judge-hosts/${submission.judgeHost.hostname}/update-judging/${judging.id}`,
      {
        id: judging.id,
        endTime: new Date(),
        result: 'AC',
      } as Partial<Judging>,
    );
    logger.log(`Submission with id ${submission.id} is correct!`);
    await dockerService.pruneContainer(runnerContainer);
    await dockerService.pruneContainer(checkerContainer);
  }
}

const logger = new JudgeLogger(Executor.name);

function getResult(
  guardOutput: GuardOutput,
  timeLimit: number,
  memoryLimit: number,
): 'TLE' | 'MLE' | 'RE' {
  if (guardOutput.usedTime > timeLimit * 1000) {
    return 'TLE';
  }
  if (guardOutput.usedMemory > memoryLimit) {
    return 'MLE';
  }
  return 'RE';
}
