import { Injectable } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { chmodSync, existsSync, promises as fs } from 'fs';
import { join } from 'path';
import { clearLine, cursorTo } from 'readline';
import { SubmissionHelper } from '../helpers';
import http from '../http/http.client';
import { getOnLog, JudgeLogger } from '../logger';
import { Judging, Testcase } from '../models';
import { JudgingRun } from '../models/judging-run.model';
import { DockerService, SocketService } from '../services';
import { startSpinner, stopSpinner } from '../utils';

type GuardOutput = {
  usedTime: number;
  usedMemory: number;
  exitCode: number;
};

/**
 * The Executor assure the execution of the submission binary on each testcase
 * and it also checks the result of the run and reports it to TunJudge server.
 */
@Injectable()
export class Executor {
  private readonly logger: JudgeLogger;

  constructor(
    private readonly dockerService: DockerService,
    private readonly socketService: SocketService,
    private readonly submissionHelper: SubmissionHelper,
  ) {
    this.logger = new JudgeLogger(Executor.name, getOnLog(this.socketService));
  }

  async run(judging: Judging): Promise<void> {
    const {
      submission: { id: submissionId, problem, language },
    } = judging;
    const { testcases, runScript } = problem;
    // Make the run script executable
    chmodSync(
      this.submissionHelper.executableFilePath(runScript.id, runScript.file),
      '0775',
    );
    // Create docker container to run the submission
    const runnerContainer = await this.dockerService.createContainer({
      Image: language.dockerImage,
      name: this.submissionHelper.runContainerName(),
    });
    // Create docker container to check the output of the submission
    const checkerContainer = await this.dockerService.createContainer({
      Image: problem.checkScript.dockerImage,
      name: this.submissionHelper.runCheckerContainerName(),
    });
    // Start both containers
    await runnerContainer.start();
    await checkerContainer.start();
    // Loop over the testcase for running and checking
    for (const testcase of testcases.sort((a, b) => a.rank - b.rank)) {
      this.logger.log(`Running test ${testcase.rank}\t`, undefined, false);
      const spinner = startSpinner();
      // Executing the run command inside the runner container
      await this.dockerService.execCmdInDocker(
        runnerContainer,
        this.submissionHelper.runCmd(testcase),
      );
      // Read the guard result that contains the used time/memory and the exit code
      const guardOutput: GuardOutput = JSON.parse(
        (
          await fs.readFile(this.submissionHelper.extraFilesPath('guard.json'))
        ).toString(),
      );
      // Get whether the result is 'AC', 'TLE', 'MLE' or 'RE' depending on the guard output
      const result = this.getResult(
        guardOutput,
        problem.timeLimit,
        problem.memoryLimit,
      );
      // In case of the exitCode of the running script is different then zero we stop running and report the result
      if (guardOutput.exitCode) {
        await this.sendJudgingRun(judging, testcase, guardOutput, result);
        await this.updateJudging(judging, result);
        stopSpinner(spinner);
        clearLine(process.stdout, 0);
        cursorTo(process.stdout, 0);
        await this.dockerService.pruneContainer(
          runnerContainer,
          checkerContainer,
        );
        this.logger.error(`Running test ${testcase.rank}\tNOT OK!`);
        return;
      }
      // Executing the checking command inside the checker container
      const checkingResult = await this.dockerService.execCmdInDocker(
        checkerContainer,
        this.submissionHelper.checkerRunCmd(testcase),
      );
      stopSpinner(spinner);
      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);
      // In case of the exitCode of the checking script is different then zero we stop running and report the result
      if (checkingResult.exitCode) {
        await this.sendJudgingRun(judging, testcase, guardOutput, 'WA');
        await this.updateJudging(judging, 'WA');
        await this.dockerService.pruneContainer(
          runnerContainer,
          checkerContainer,
        );
        this.logger.error(`Running test ${testcase.rank}\tNOT OK!`);
        return;
      } else {
        // In case of submission is correct of this testcase we report the result and continue running
        await this.sendJudgingRun(judging, testcase, guardOutput, result);
        this.logger.log(`Running test ${testcase.rank}\tOK!`);
        // We move the test output and the guard output in the testcase folder for backup
        for (const file of [
          'test.out',
          'test.err',
          'checker.out',
          'guard.json',
        ]) {
          await fs.copyFile(
            this.submissionHelper.extraFilesPath(file),
            join(this.submissionHelper.runTestcaseDir(testcase.rank), file),
          );
          await fs.unlink(this.submissionHelper.extraFilesPath(file));
        }
      }
    }
    // In case all testcases passed then we report the result and prune the containers
    await this.updateJudging(judging, 'AC');
    this.logger.log(`Submission with id ${submissionId} is correct!`);
    await this.dockerService.pruneContainer(runnerContainer, checkerContainer);
  }

  private getResult(
    guardOutput: GuardOutput,
    timeLimit: number,
    memoryLimit: number,
  ): 'AC' | 'TLE' | 'MLE' | 'RE' {
    if (!guardOutput.exitCode) {
      return 'AC';
    }
    if (guardOutput.usedTime >= timeLimit * 1000) {
      return 'TLE';
    }
    if (guardOutput.usedMemory >= memoryLimit) {
      return 'MLE';
    }
    return 'RE';
  }

  private async updateJudging(
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

  private async sendJudgingRun(
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
      await fs.readFile(this.submissionHelper.extraFilesPath('test.out'))
    )
      .toString()
      .trim();
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
        await fs.readFile(this.submissionHelper.extraFilesPath('test.err'))
      )
        .toString()
        .trim();
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

    if (existsSync(this.submissionHelper.extraFilesPath('checker.out'))) {
      const checkerOutput = (
        await fs.readFile(this.submissionHelper.extraFilesPath('checker.out'))
      )
        .toString()
        .trim();
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
}
