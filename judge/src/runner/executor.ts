import { chmodSync, existsSync, promises as fs } from 'fs';
import { join } from 'path';
import { MD5 } from 'crypto-js';

import { AbstractRunnerStep } from './runner-step';
import { Judging, Testcase } from '../models';
import sh from './submission-helper';
import dockerService from '../services/docker.service';
import { JudgeLogger } from '../services/judge.logger';
import http from '../http/http.client';
import { JudgingRun } from '../models/judging-run.model';

type GuardOutput = {
  usedTime: number;
  usedMemory: number;
  exitCode: number;
};

/**
 * The Executor assure the execution of the submission binary on each testcase
 * and it also checks the result of the run and reports it to TunJudge server.
 */
export class Executor extends AbstractRunnerStep {
  async run(judging: Judging): Promise<void> {
    const {
      submission: { id: submissionId, problem, language },
    } = judging;
    const { testcases, runScript } = problem;
    // Make the run script executable
    chmodSync(sh.executableFilePath(runScript.id, runScript.file), '0775');
    // Create docker container to run the submission
    const runnerContainer = await dockerService.createContainer({
      Image: language.dockerImage,
      name: sh.runContainerName(),
    });
    // Create docker container to check the output of the submission
    const checkerContainer = await dockerService.createContainer({
      Image: problem.checkScript.dockerImage,
      name: sh.runCheckerContainerName(),
    });
    // Start both containers
    await runnerContainer.start();
    await checkerContainer.start();
    // Loop over the testcase for running and checking
    for (const testcase of testcases.sort((a, b) => a.rank - b.rank)) {
      logger.log(`Running test ${testcase.rank}...`, undefined, false);
      // Executing the run command inside the runner container
      await dockerService.execCmdInDocker(runnerContainer, sh.runCmd(testcase));
      // Read the guard result that contains the used time/memory and the exit code
      const guardOutput: GuardOutput = JSON.parse(
        (await fs.readFile(sh.extraFilesPath('guard.json'))).toString(),
      );
      // Get whether the result is 'AC', 'TLE', 'MLE' or 'RE' depending on the guard output
      const result = getResult(
        guardOutput,
        problem.timeLimit,
        problem.memoryLimit,
      );
      // In case of the exitCode of the running script is different then zero we stop running and report the result
      if (guardOutput.exitCode) {
        await sendJudgingRun(judging, testcase, guardOutput, result);
        await updateJudging(judging, result);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        await dockerService.pruneContainer(runnerContainer, checkerContainer);
        logger.error(`Running test ${testcase.rank}...\tNOT OK!`);
        return;
      }
      // Executing the checking command inside the checker container
      const checkingResult = await dockerService.execCmdInDocker(
        checkerContainer,
        sh.checkerRunCmd(testcase),
      );
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      // In case of the exitCode of the checking script is different then zero we stop running and report the result
      if (checkingResult.exitCode) {
        await sendJudgingRun(judging, testcase, guardOutput, 'WA');
        await updateJudging(judging, 'WA');
        await dockerService.pruneContainer(runnerContainer, checkerContainer);
        logger.error(`Running test ${testcase.rank}...\tNOT OK!`);
        return;
      } else {
        // In case of submission is correct of this testcase we report the result and continue running
        await sendJudgingRun(judging, testcase, guardOutput, result);
        logger.log(`Running test ${testcase.rank}...\tOK!`);
        // We move the test output and the guard output in the testcase folder for backup
        for (const file of [
          'test.out',
          'test.err',
          'checker.out',
          'guard.json',
        ]) {
          await fs.copyFile(
            sh.extraFilesPath(file),
            join(sh.runTestcaseDir(testcase.rank), file),
          );
          await fs.unlink(sh.extraFilesPath(file));
        }
      }
    }
    // In case all testcases passed then we report the result and prune the containers
    await updateJudging(judging, 'AC');
    logger.log(`Submission with id ${submissionId} is correct!`);
    await dockerService.pruneContainer(runnerContainer, checkerContainer);
  }
}

const logger = new JudgeLogger(Executor.name);

function getResult(
  guardOutput: GuardOutput,
  timeLimit: number,
  memoryLimit: number,
): 'AC' | 'TLE' | 'MLE' | 'RE' {
  if (!guardOutput.exitCode) {
    return 'AC';
  }
  if (guardOutput.usedTime > timeLimit * 1000) {
    return 'TLE';
  }
  if (guardOutput.usedMemory > memoryLimit) {
    return 'MLE';
  }
  return 'RE';
}

async function updateJudging(
  judging: Judging,
  result: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE',
): Promise<void> {
  await http.put(
    `api/judge-hosts/${judging.submission.judgeHost.hostname}/update-judging/${judging.id}`,
    {
      id: judging.id,
      endTime: new Date(),
      result: result,
    } as Partial<Judging>,
  );
}

async function sendJudgingRun(
  judging: Judging,
  testcase: Testcase,
  guardOutput: GuardOutput,
  result: 'AC' | 'WA' | 'TLE' | 'MLE' | 'RE',
): Promise<void> {
  const {
    submission: {
      judgeHost: { hostname },
    },
  } = judging;

  const judgingRun: Partial<JudgingRun> = {
    id: undefined,
    result: result,
    runTime: guardOutput.usedTime / 1000,
    runMemory: guardOutput.usedMemory,
    testcase: testcase,
    judging: judging,
    endTime: new Date(),
    runOutput: undefined,
    errorOutput: undefined,
    checkerOutput: undefined,
  };

  const runOutput = (
    await fs.readFile(sh.extraFilesPath('test.out'))
  ).toString();
  const payload = Buffer.from(runOutput).toString('base64');
  judgingRun.runOutput = {
    id: undefined,
    name: `program.out`,
    type: 'text/plain',
    size: runOutput.length,
    md5Sum: MD5(payload).toString(),
    content: { id: undefined, payload: payload },
  };

  if (guardOutput.exitCode) {
    const errorOutput = (
      await fs.readFile(sh.extraFilesPath('test.err'))
    ).toString();
    const payload = Buffer.from(errorOutput).toString('base64');
    judgingRun.errorOutput = {
      id: undefined,
      name: `program.err`,
      type: 'text/plain',
      size: errorOutput.length,
      md5Sum: MD5(payload).toString(),
      content: { id: undefined, payload: payload },
    };
  }

  if (existsSync(sh.extraFilesPath('checker.out'))) {
    const checkerOutput = (
      await fs.readFile(sh.extraFilesPath('checker.out'))
    ).toString();
    const payload = Buffer.from(checkerOutput).toString('base64');
    judgingRun.checkerOutput = {
      id: undefined,
      name: 'checker.out',
      type: 'text/plain',
      size: checkerOutput.length,
      md5Sum: MD5(payload).toString(),
      content: { id: undefined, payload: payload },
    };
  }

  await http.post(
    `api/judge-hosts/${hostname}/add-judging-run/${judging.id}`,
    judgingRun,
  );
}
