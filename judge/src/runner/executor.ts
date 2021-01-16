import { chmodSync, promises, readFileSync } from 'fs';
import { join } from 'path';
import { AbstractRunnerStep } from './runner-step';
import { Judging } from '../models';
import sh from './submission-helper';
import dockerService from '../services/docker.service';
import { JudgeLogger } from '../services/judge.logger';
import http from '../http/http.client';
import { JudgingRun } from '../models/judging-run.model';
import { MD5 } from 'crypto-js';

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
        promises.copyFile(
          sh.testcaseFilePath(testcase.id, testcase.input),
          join(sh.submissionDir(), 'test.in'),
        ),
        promises.copyFile(
          sh.testcaseFilePath(testcase.id, testcase.output),
          join(sh.submissionDir(), 'test.ans'),
        ),
      ]);
      const runningResult = await dockerService.execCmdInDocker(
        runnerContainer,
        sh.runCmd(),
      );
      const time = /real.*m(.*)s/.exec(runningResult.stdout);
      if (runningResult.exitCode) {
        const payload = Buffer.from(runningResult.stderr).toString('base64');
        await http.post(
          `api/judge-hosts/${submission.judgeHost.hostname}/add-judging-run/${judging.id}`,
          {
            judging: { id: judging.id },
            endTime: new Date(),
            testcase: { id: testcase.id },
            result: 'runtime-error',
            runTime: time.length > 1 ? parseFloat(time[1]) : 0,
            errorOutput: {
              name: 'program.err',
              type: 'text/plain',
              size: runningResult.stderr.length,
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
            result: 'runtime-error',
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
      const runningOutput = readFileSync(
        sh.testFilesPath('test.out'),
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
            result: 'runtime-error',
            runTime: time.length > 1 ? parseFloat(time[1]) : 0,
            runOutput: runOutputFile,
            checkerOutput: checkerOutputFile,
          } as Partial<JudgingRun>,
        );
        await http.put(
          `api/judge-hosts/${submission.judgeHost.hostname}/update-judging/${judging.id}`,
          {
            id: judging.id,
            endTime: new Date(),
            result: 'wrong-answer',
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
            result: 'accepted',
            runTime: time.length > 1 ? parseFloat(time[1]) : 0,
            runOutput: runOutputFile,
            checkerOutput: checkerOutputFile,
          } as Partial<JudgingRun>,
        );
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        logger.log(`Running test ${testcase.rank}...\tOK!`);
      }
    }
    await http.put(
      `api/judge-hosts/${submission.judgeHost.hostname}/update-judging/${judging.id}`,
      {
        id: judging.id,
        endTime: new Date(),
        result: 'accepted',
      } as Partial<Judging>,
    );
    logger.log(`Submission with id ${submission.id} is correct!`);
    await dockerService.pruneContainer(runnerContainer);
    await dockerService.pruneContainer(checkerContainer);
  }
}

const logger = new JudgeLogger(Executor.name);
