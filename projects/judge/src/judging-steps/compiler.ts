import { Injectable } from '@nestjs/common';
import { MD5 } from 'crypto-js';
import { existsSync, promises as fs } from 'fs';
import { join } from 'path';
import { Spinner, SubmissionHelper } from '../helpers';
import { getOnLog, JudgeLogger } from '../logger';
import { Executable, File, Judging } from '../models';
import { DockerService, ExecResult, SocketService, SystemService } from '../services';

/**
 * The Compiler assure the compilation of the submission and checker code source files.
 */
@Injectable()
export class Compiler {
  private readonly logger: JudgeLogger;

  constructor(
    private readonly dockerService: DockerService,
    private readonly socketService: SocketService,
    private readonly systemService: SystemService,
    private readonly submissionHelper: SubmissionHelper
  ) {
    this.logger = new JudgeLogger(Compiler.name, getOnLog(this.socketService));
  }

  async run(judging: Judging): Promise<boolean> {
    const { submission } = judging;
    const {
      problem: { checkScript },
    } = submission;

    const compileSubmissionResult = await this.compileSubmissionFile(judging);

    if (compileSubmissionResult.exitCode) {
      this.logger.error(`Compiling submission file ${submission.file.name}\tNOT OK!`);
      await this.systemService.setJudgingResult(judging, 'CE');
      return false;
    }
    this.logger.log(`Compiling submission file ${submission.file.name}\tOK!`);

    const compileCheckerResult = await this.compileCheckerFile(submission.problem.checkScript);

    if (compileCheckerResult) {
      if (compileCheckerResult.exitCode) {
        this.logger.error(`Compiling executable file ${checkScript.file.name}\tNOT OK!`);
        await this.systemService.setJudgingResult(judging, 'SE', compileCheckerResult.stdout);
        return false;
      }
      this.logger.log(`Compiling executable file ${checkScript.file.name}\tOK!`);
    }

    this.logger.log(`Submission with id ${submission.id} compiled!`);
    return true;
  }

  private async compileSubmissionFile(judging: Judging) {
    const {
      submission: { id, file, language },
    } = judging;

    this.logger.log(`Compiling submission file ${file.name}\t`, undefined, false);
    const spinner = new Spinner();

    // Create docker container to compile the submission file
    const submissionCompilerContainer = await this.dockerService.createContainer({
      Image: language.dockerImage,
      name: `tun-judge-build-submission-${id}-${Date.now()}`,
    });

    // Start the submission compiler container
    await submissionCompilerContainer.start();

    // Make the language build script executable
    await fs.chmod(this.submissionHelper.languageFilePath(), '0775');

    // Executing the compile command inside the submission compile container
    const compileSubmissionResult = await this.dockerService.execCmdInDocker(
      submissionCompilerContainer,
      this.submissionHelper.compileCmd()
    );

    // Compile the guard code inside the language container to assure the compatibility with the linux kernel
    await this.dockerService.execCmdInDocker(
      submissionCompilerContainer,
      ['g++', '--std=c++11', '-pthread', '-o', 'guard', 'guard.cpp'],
      this.submissionHelper.assetsDir()
    );

    // Report the result of the submission file compilation
    await this.setJudgingCompileOutput(judging, compileSubmissionResult);

    await this.dockerService.pruneContainer(submissionCompilerContainer);

    spinner.stop();

    return compileSubmissionResult;
  }

  private async compileCheckerFile(checkScript: Executable): Promise<ExecResult | undefined> {
    // Check if we already built the check script or not to prevent the double work
    const checkerBinPath = this.submissionHelper.executableBinPath(
      checkScript.id,
      checkScript.file
    );
    if (existsSync(checkerBinPath)) return undefined;

    this.logger.log(`Compiling executable file ${checkScript.file.name}\t`, undefined, false);
    const spinner = new Spinner();

    // Create docker container to compile the checker file
    const checkerContainer = await this.dockerService.createContainer({
      Image: checkScript.dockerImage,
      name: `tun-judge-build-checker-${checkScript.id}-${Date.now()}`,
      WorkingDir: this.submissionHelper.executableFileDir(checkScript.id, checkScript.file),
    });

    // Start the checker compiler container
    await checkerContainer.start();

    // Make the checker build script executable
    await fs.chmod(
      this.submissionHelper.executableFilePath(checkScript.id, checkScript.buildScript),
      '0775'
    );

    // Copy the testlib.h to the compiling directory to support the Codeforces checkers
    await fs.copyFile(
      this.submissionHelper.testLibPath,
      join(this.submissionHelper.executableFileDir(checkScript.id, checkScript.file), 'testlib.h')
    );

    // Executing the compile command inside the checker compile container
    const compileCheckerResult = await this.dockerService.execCmdInDocker(
      checkerContainer,
      this.submissionHelper.checkerCompileCmd()
    );

    await this.dockerService.pruneContainer(checkerContainer);

    spinner.stop();

    return compileCheckerResult;
  }

  private async setJudgingCompileOutput(
    judging: Judging,
    compileSubmissionResult: ExecResult
  ): Promise<void> {
    const payload = Buffer.from(compileSubmissionResult.stdout.trim()).toString('base64');
    judging.compileOutput = {
      name: 'compile.out',
      type: 'text/plain',
      size: compileSubmissionResult.stdout.length,
      md5Sum: MD5(payload).toString(),
      content: { payload: payload },
    } as File;
    await this.systemService.updateJudging(judging);
  }
}
