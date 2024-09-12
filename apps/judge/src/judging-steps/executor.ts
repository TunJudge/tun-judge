import { Injectable } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { chmodSync, existsSync, promises as fs } from 'fs';
import { join } from 'path';

import { getResult, GuardOutput, Spinner, SubmissionHelper } from '../helpers';
import { getOnLog, JudgeLogger } from '../logger';
import { File, Judging, JudgingRun, JudgingRunResult, Testcase } from '../models';
import { DockerService, SocketService, SystemService } from '../services';

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
    private readonly systemService: SystemService,
    private readonly submissionHelper: SubmissionHelper
  ) {
    this.logger = new JudgeLogger(Executor.name, getOnLog(this.socketService));
  }

  async run(judging: Judging): Promise<void> {
    const {
      submission: { id, problem, language },
    } = judging;
    const { testcases, runScript, checkScript } = problem;

    // Make the run script executable
    chmodSync(this.submissionHelper.executableFilePath(runScript.id, runScript.sourceFile), '0775');

    // Create docker container to run the submission
    const runnerContainer = await this.dockerService.createContainer({
      Image: language.dockerImage,
      name: `tun-judge-run-submission-${id}-${Date.now()}`,
    });

    // Create docker container to check the output of the submission
    const checkerContainer = await this.dockerService.createContainer({
      Image: checkScript.dockerImage,
      name: `tun-judge-run-checker-${checkScript.id}-${Date.now()}`,
    });

    // Start both containers
    await runnerContainer.start();
    await checkerContainer.start();

    // Loop over the testcase for running and checking
    for (const testcase of testcases.sort((a, b) => a.rank - b.rank)) {
      this.logger.debug(`Running test ${testcase.rank}\t`, undefined, false);
      const spinner = new Spinner();

      // Executing the run command inside the runner container
      await this.dockerService.execCmdInDocker(
        runnerContainer,
        this.submissionHelper.runCmd(testcase)
      );

      // Read the guard result that contains the used time/memory and the exit code
      const guardOutputPath = this.submissionHelper.extraFilesPath('guard.json');
      const guardOutput: GuardOutput = JSON.parse((await fs.readFile(guardOutputPath)).toString());

      // Get whether the result is 'AC', 'TLE', 'MLE' or 'RE' depending on the guard output
      const result = getResult(guardOutput, problem);

      // In case of the exitCode of the running script is different then zero we stop running and report the result
      if (guardOutput.exitCode) {
        await this.sendJudgingRun(judging, testcase, guardOutput, result);
        await this.systemService.setJudgingResult(judging, result);

        spinner.stop();

        this.logger.log(`Running test ${testcase.rank}\tNOT OK!`);

        return this.dockerService.pruneContainer(runnerContainer, checkerContainer);
      }

      // Executing the checking command inside the checker container
      const checkingResult = await this.dockerService.execCmdInDocker(
        checkerContainer,
        this.submissionHelper.checkerRunCmd(testcase)
      );

      spinner.stop();

      // In case of the exitCode of the checking script is different then zero we stop running and report the result
      if (checkingResult.exitCode) {
        await this.sendJudgingRun(judging, testcase, guardOutput, 'WA');
        await this.systemService.setJudgingResult(judging, 'WA');

        this.logger.log(`Running test ${testcase.rank}\tNOT OK!`);

        return this.dockerService.pruneContainer(runnerContainer, checkerContainer);
      }

      // In case of submission is correct of this testcase we report the result and continue running
      await this.sendJudgingRun(judging, testcase, guardOutput, result);

      this.logger.debug(`Running test ${testcase.rank}\tOK!`);

      // We move the test output files and the guard output files in the testcase folder for backup
      await Promise.all(
        ['test.out', 'test.err', 'checker.out', 'guard.json'].map((file) =>
          fs.rename(
            this.submissionHelper.extraFilesPath(file),
            join(this.submissionHelper.runTestcaseDir(testcase.rank), file)
          )
        )
      );
    }

    // In case all testcases passed then we report the result and prune the containers
    await this.systemService.setJudgingResult(judging, 'AC');

    this.logger.log(`Submission with id ${id} is correct!`);

    await this.dockerService.pruneContainer(runnerContainer, checkerContainer);
  }

  private async sendJudgingRun(
    judging: Judging,
    testcase: Testcase,
    guardOutput: GuardOutput,
    result: JudgingRunResult
  ): Promise<void> {
    const judgingRun: Partial<JudgingRun> = {
      result: result,
      runTime: guardOutput.usedTime / 1000,
      runMemory: guardOutput.usedMemory,
      testcase: testcase,
      judging: judging,
      endTime: new Date(),
    };

    const runOutputPath = this.submissionHelper.extraFilesPath('test.out');
    const runOutput = (await fs.readFile(runOutputPath)).toString().trim();
    const payload = Buffer.from(runOutput).toString('base64');

    judgingRun.runOutput = {
      name: `program.out`,
      type: 'text/plain',
      size: runOutput.length,
      md5Sum: MD5(payload).toString(),
      content: { payload: payload },
    } as File;

    if (guardOutput.exitCode) {
      const errorOutputPath = this.submissionHelper.extraFilesPath('test.err');
      const errorOutput = (await fs.readFile(errorOutputPath)).toString().trim();
      const payload = Buffer.from(errorOutput).toString('base64');

      judgingRun.errorOutput = {
        name: `program.err`,
        type: 'text/plain',
        size: errorOutput.length,
        md5Sum: MD5(payload).toString(),
        content: { payload: payload },
      } as File;
    }

    const checkerOutputPath = this.submissionHelper.extraFilesPath('checker.out');
    if (existsSync(checkerOutputPath)) {
      const checkerOutput = (await fs.readFile(checkerOutputPath)).toString().trim();
      const payload = Buffer.from(checkerOutput).toString('base64');

      judgingRun.checkerOutput = {
        name: 'checker.out',
        type: 'text/plain',
        size: checkerOutput.length,
        md5Sum: MD5(payload).toString(),
        content: { payload: payload },
      } as File;
    }

    return this.systemService.addJudgingRun(judging, judgingRun);
  }
}
